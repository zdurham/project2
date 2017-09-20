// Dependencies for this module
const db = require("../models")
const { check, validationResult } = require('express-validator/check');
const request = require('request')


// Specifically used for Stripe functions later
const stripe = require('stripe')(process.env.SECRET_KEY)
const querystring = require('querystring')
const env = require('dotenv')
env.load()

// For nodemailer to work, gmail information and initialization
// 
// NOTE FOR FUTURE BUILDS:
// Stripe has built in reciepts which may make nodemailer redundant, however
// they do not work in test mode, so nodemailer is useful for us until
// production stage
const nodemailer = require('nodemailer')
const gmail = process.env.GMAIL_USERNAME
const gpass = process.env.GMAIL_PASSWORD
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: gmail,
    pass: gpass
  }
})

// These routes are exported as a function which takes the express app and passport
module.exports = (app, passport) => {
  

  //---------------------------------------------
  // GET ROUTES
  //---------------------------------------------

  // Displaying sign up page
  app.get("/sign-up", (req, res) => {

    // This renders the page along with any error messages communicated from express-validator or 
    // the local strategies
    res.render("sign-up", {
      message:  req.flash('signUpFailure'),
      badEmail: req.flash('badEmail'),
      badPass: req.flash('badPass'),
      badUser: req.flash('badUser'), 
      noMatch: req.flash('noMatch'),
      badFirst: req.flash('badFirst'),
      badLast: req.flash('badLast')
    })
  }) 

  // Display sign-in page, along with any
  // errors that may arise during the login process
  app.get('/sign-in', (req, res) => { 
    res.render('sign-in', {
      badEmail: req.flash('badEmail'),
      badPass: req.flash('badPass'),
      emailErr: req.flash('emailErr'),
      passErr: req.flash('passErr')
    })
  })

  // Route for logging out
  app.get("/logout", (req, res) => {
    req.session.destroy((err) => {
      res.redirect('/')
    })
  })

  // Displaying welcome after successful login
  app.get('/dashboard', isLoggedIn, (req, res) => {
    
    // Reach into database to gather user information for the page
    // The query gathers all related tables for User history
    db.User.findOne({
      where: {
        id: req.user.id
      },
      include: [{model: db.Post}, {model: db.Comment}, {model: db.Payment}, {model: db.Earning}, {model: db.Cause}]
    }).then(user => {
      res.render('dashboard', {user: user, payments: user.Payments, earnings: user.Earnings, comments: user.Comments, causes: user.Causes, posts: user.Posts})
    })
   })
  
   // If logged in, displays Create Post page
   // isLoggedIn is function that checks 
   // for req.user, if no user, redirected to 
   // sign-in page
   app.get('/create-post', isLoggedIn, (req, res) => {
     res.render('create-post', {user: req.user})
   })

   // If logged in, this will display Create Cause page
   // Again, isLoggedIn is checking for user to be logged in
   // If not logged in, redirected to sign-in page
   app.get('/create-cause', isLoggedIn, (req, res) => {
     res.render('create-cause', {user: req.user})
   })


  //---------------------------------------------
  // POST ROUTES
  //---------------------------------------------
  
  // Route for registering. Takes user info
  // from the sign up page and stores in mySQL database
  // express validator is used to check for proper inputs
  app.post("/sign-up", [
    check('email').isEmail().withMessage('Email is not valid!'), 
    check('password').not().isEmpty().withMessage('Please fill out all required fields to continue'),
    check('username').not().isEmpty().withMessage('Please fill out all required fields to continue'),
    check('firstName').not().isEmpty().withMessage('Please fill out all required fields to continue'),
    check('lastName').not().isEmpty().withMessage('Please fill out all required fields to continue'),
    check('password2').not().isEmpty().withMessage('Your passwords do not match!').custom((value,{req}) => value === req.body.password)
  
    ], 
    (req, res, next) => {
      err = validationResult(req).mapped()
      
      if (err.email || err.password || err.password2 || err.username || err.firstName || err.lastName) {
        if (err.email) {
          req.flash('badEmail', 'Please enter a valid email address')
        }
        if (err.username) {
          req.flash('badUser', 'Please fill out all required fields to continue')
        }
        if (err.password) {
          req.flash('badPass', 'Your password is required')
        }
        if (err.password2) {
          req.flash('noMatch', 'Your passwords do not match')
        }
        if (err.lastName) {
          req.flash('badFirst', 'Please fill out all required fields to continue')
        }
        if (err.firstName) {
          req.flash('badLast', 'Please fill out all required fields to continue')
        }
        return res.redirect('/sign-up')
      }
      else {
        next()
      }
    // if everything works out on express-validation, proceed to local signup strategy 
    }, passport.authenticate('local-signup', {
      successRedirect: '/dashboard',
   
      failureRedirect: '/sign-up',

      failureFlash: true
  }));

  // Returning user signs in
  // express validator is used to check for proper inputs
  app.post("/sign-in", [
    // check the email
    check('email').isEmail().withMessage('Email is not valid!'), 
    // check the password
    check('password').not().isEmpty().withMessage('You must fill out the password field to continue')], 

    (req, res, next) => {
      err = validationResult(req).mapped()
      
      if (err.email || err.password) {
        if (err.email) {
          req.flash('badEmail', 'Please enter a valid email address')
        }
        if (err.password) {
          req.flash('badPass', 'Your password is required')
        }
        return res.redirect('/sign-in')
      }
      else {
        next()
      }
    // If inputs make it through express-validator
    // proceed to local-signin strategy
    }, passport.authenticate('local-signin', {
      successRedirect: '/dashboard',
      
      failureRedirect: '/sign-in',
  
      failureFlash: true
    })
  );

  //---------------------------------------------
  // Stripe Routes
  //---------------------------------------------

  // This large frankenstein function does a lot:
  // Creates a charge for stripe
  // Emails donor and recipient
  // Stores transaction information in earnings and payment tables
  // Update progress on cause
  app.post("/causes/:cause/charge", (req, res) => {
    res.locals.amount = req.body.amount * 100
    db.Cause.findOne({
      where: {
        id: req.params.cause
      },
      include: db.User
    }).then(cause => {
      res.locals.cause = cause.id
      res.locals.id = cause.User.id
      res.locals.causeEmail = cause.User.email
      res.locals.progress = cause.progress
      res.locals.username = cause.User.username
      const account = cause.User.stripeAccountId;

      stripe.charges.create({
        
        amount: res.locals.amount,
        receipt_email: req.user.email,
        destination: {
          amount: res.locals.amount,
          account: account
        },
        description: "Sample Charge",
        currency: "usd",
        source: req.body.stripeToken
        
    }).then(charge => {
      
      // After the charge has been processed
      // We return the charge object
      // the charge must be converted to an actual amount
      // as Stripe considers transactions by cents
      let actualCharge = (charge.amount / 100)
      res.render("charge", {
        user: req.user,
        chargeAmount: actualCharge,
      })

      // Here we define an email object to be sent
      // to the donor according to nodemailer
      // documentation
      let donorEmail = {
        from: gmail,
        to: req.user.email,
        subject: 'Rally Point Charge Confirmation',
        html: 
        `<h2>Thank you for your donation!</h2>
        <h3>Your card has been charged $${actualCharge}</h3>
        <h3>If you have any questions, feel free to email us back at this address</h4>
        <h3>To see your transaction history, visit your personal dashboard.</h3>
        <br><br><br>
        
        <h3>Best,<h3>
        <br>
        <h3>The RallyPoint Team</h3>` 
      };

      // Here we define an email object to be sent
      // to the recipient according to nodemailer
      // documentation
      let recipientEmail = {
        from: gmail,
        to: res.locals.causeEmail,
        subject: 'Your cause has recieved a donation!',
        html: 
        `<h1>Your cause has recieved a donation!</h1>
        <h3>You have recieved a donation of $${actualCharge}.</h3>
        <h3>To see your transaction history, visit your personal dashboard.</h3>
        <br><br><br>
        
        <h3>Best,<h3>
        <br>
        <h3>The RallyPoint Team</h3>`
      };

      // Actual function to send donorEmail. Console.logs to confirm
      transporter.sendMail(donorEmail, function(error, info){
        if(error){
            console.log(error);
            
        }else{
            console.log('Message sent: ' + info.response);
            
        };
      });
      // Actual function to send recipientEmail. Console.logs to confirm
      transporter.sendMail(recipientEmail, function(error, info){
        if(error){
            console.log(error);
            
        }else{
            console.log('Message sent: ' + info.response);
            
        };
      });

      // Define paymentObj to be stored in payment table
      // This is essentially meant to be a history
      // for the user to look back on later
      let paymentObj = {
        amount: actualCharge,
        date: new Date(),
        recipient: res.locals.username,
        causeId: res.locals.cause,
        UserId: req.user.id
      }

      // Store paymentObj in Payment table
      db.Payment.create(paymentObj).then(payment => console.log(payment))

      // Define earning for recipient and store in database
      // Again, this is to track transaction history
      // And have a memory of recieving money, and from
      // whom
      let earningObj = {
        amount: actualCharge,
        date: new Date(),
        donor: req.user.id,
        causeId: res.locals.cause,
        UserId: res.locals.id,
      }

      // Store earningObj in Payment table
      db.Earning.create(earningObj).then(earning => console.log(earning))

      // Update the progress amount for this cause
      db.Cause.update({
        progress: parseInt(charge.amount / 100) + parseInt(res.locals.progress)
      }, {
        where: {
          id: req.params.cause
        }
      }).then(cause => console.log(cause)) 
    })
    });
  });

  


  // This allows a user to connect their stripe account
  // with the RallyPoint website upon registering with RallyPoint
  // Activated when the user presses the 'Connect with Stripe'
  // button on their dashboard
  app.get('/authorize', isLoggedIn, (req, res) => {
    // Generate a random string as state to protect from CSRF and place it in the session.
    req.session.state = Math.random().toString(36).slice(2);
    // Prepare the mandatory Stripe parameters.
    let parameters = {
      client_id: 'ca_BOWzYl4q2Nq34am4i7mndZm4wDfoC4BO',
      state: req.session.state
    };
    // Optionally, Stripe Connect accepts `first_name`, `last_name`, `email`,
    // and `phone` in the query parameters for them to be autofilled.
    parameters = Object.assign(parameters, {
      first_name: req.user.firstName,
      last_name: req.user.lastName,
      email: req.user.email
    });
    // Redirect to Stripe to start the Connect onboarding.
    res.redirect('https://connect.stripe.com/express/oauth/authorize' + '?' + querystring.stringify(parameters));
  });

  // This route is used after the user connects
  // their account with Stripe. It redirects the user back 
  // to RallyPoint with their unique stripe ID
  // That stripe id is stored in their user information in mySQL
  app.get('/token', isLoggedIn, (req, res) => {
    // Check the state we got back equals the one we generated before proceeding.
    if (req.session.state != req.query.state) {
      res.redirect('/sign-in');
    }
    // Post the authorization code to Stripe to complete the authorization flow.
    request.post('https://connect.stripe.com/oauth/token', {
      form: {
        grant_type: 'authorization_code',
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.SECRET_KEY,
        code: req.query.code
      },
      json: true
    }, (err, response, body) => {
      if (err || body.error) {
        console.log('The Stripe onboarding process has not succeeded.');
      } else {
        
        // This is where we store the unique stripe user id
        req.user.stripeAccountId = body.stripe_user_id;
        db.User.update(
          {
            stripeAccountId: req.user.stripeAccountId
          },
          {
          where: {
            id: req.user.id
          }
        }).then(user => console.log(user))
      }
      
      // At last, once the heavy lifting is done
      // we redirect to the dashboard page
      res.redirect('/dashboard');
    });
  });

  // Stripe user dashboard link
  // the user can press this to visit
  // their unique stripe dashboard
  app.post('/dashboard/stripe-dash', (req, res) => {
    let user = req.user
    stripe.accounts.createLoginLink(
      user.stripeAccountId,
      function(err, link) {
        if (err) throw err

        res.redirect(link.url)
      }
    );
  })
  
  // This function checks to see if a user is logged in
  // Used in routes above to gate certain pages
  function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
      return next();
    res.redirect('/sign-in')
  }
}