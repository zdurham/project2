const db = require("../models")
const { check, validationResult } = require('express-validator/check');
const request = require('request')

// for the Stripe call later
const querystring = require('querystring')
const env = require('dotenv')
env.load()


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

//---------------------------------------------
// Setting up Stripe and keys
//---------------------------------------------
// const keyPublishable = process.env.PUBLISHABLE_KEY
// const keySecret = process.env.SECRET_KEY

const stripe = require('stripe')(process.env.SECRET_KEY)


module.exports = (app, passport) => {
  
  // Displaying sign up page
  app.get("/sign-up", (req, res) => {

    // This renders the page and any error messages
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

  app.get('/sign-in', (req, res) => { 
    res.render('sign-in', {
      badEmail: req.flash('badEmail'),
      badPass: req.flash('badPass'),
      emailErr: req.flash('emailErr'),
      passErr: req.flash('passErr')
    })
  })

  // Logging out
  app.get("/logout", (req, res) => {
    req.session.destroy((err) => {
      res.redirect('/')
    })
  })

  // Displaying welcome after successful login
  app.get('/dashboard', isLoggedIn, (req, res) => {
    db.User.findOne({
      where: {
        id: req.user.id
      },
      include: [{model: db.Post}, {model: db.Comment}]
    }).then(user => res.render('dashboard', {user: user}))
   })
  
   // Attempting to go to create-post without having signed in
   app.get('/create-post', isLoggedIn, (req, res) => {
     res.render('create-post')
   })

   // Attempting to go to create cause without having signed in
   app.get('/create-cause', isLoggedIn, (req, res) => {
     res.render('create-cause', {user: req.user})
   })

  // Registering user
  app.post("/sign-up", [
    check('email').isEmail().withMessage('Email is not valid!'), 
    check('password').not().isEmpty().withMessage('This is a required field'),
    check('username').not().isEmpty().withMessage('This is a required field'),
    check('firstName').not().isEmpty().withMessage('This is a required field'),
    check('lastName').not().isEmpty().withMessage('This is a required field'),
    check('password2').not().isEmpty().withMessage('Your passwords do not match!').custom((value,{req}) => value === req.body.password)
  
    ], 
    (req, res, next) => {
      err = validationResult(req).mapped()
      
      if (err.email || err.password || err.password2 || err.username || err.firstName || err.lastName) {
        if (err.email) {
          req.flash('badEmail', 'Please enter a valid email address')
        }
        if (err.username) {
          req.flash('badUser', 'This field is required')
        }
        if (err.password) {
          req.flash('badPass', 'Your password is required')
        }
        if (err.password2) {
          req.flash('noMatch', 'Your passwords do not match')
        }
        if (err.lastName) {
          req.flash('badFirst', 'This is a required field')
        }
        if (err.firstName) {
          req.flash('badLast', 'This is a required field')
        }
        return res.redirect('/sign-up')
      }
      else {
        next()
      } 
    }, passport.authenticate('local-signup', {
      successRedirect: '/dashboard',
   
      failureRedirect: '/sign-up',

      failureFlash: true
  }));

  // Returning user signs in
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
    }, passport.authenticate('local-signin', {
      successRedirect: '/dashboard',
      
      failureRedirect: '/sign-in',
  
      failureFlash: true
    })
  );

  //---------------------------------------------
  //
  //
  //
  // Setting up Stripe routes, hopefully they work
  //
  //
  //
  //---------------------------------------------

  //
  //  This route is the Stripe Checkout Route
  //
  app.post("/causes/:cause/charge", (req, res) => {
    res.locals.amount = req.body.amount * 100
    db.Cause.findOne({
      where: {
        id: req.params.cause
      },
      include: db.User
    }).then(cause => {
      res.locals.id = cause.User.id
      res.locals.causeEmail = cause.User.email
      res.locals.progress = cause.progress
      res.locals.username = cause.User.username
      const account = cause.User.stripeAccountId;

      stripe.charges.create({
        
        amount: res.locals.amount,
        destination: {
          amount: res.locals.amount,
          account: account
        },
        description: "Sample Charge",
        currency: "usd",
        source: req.body.stripeToken   
    }).then(charge => {
      let actualCharge = (charge.amount / 100)
      res.render("charge", {
        user: req.user,
        chargeAmount: actualCharge,
      })
      // Send confirmation email
      let donorEmail = {
        from: gmail,
        to: req.user.email,
        subject: 'Rally Point Charge Confirmation',
        html: 
        `<h1>Thank you for your donation!</h1>
        <h3>Your card has been charged $${actualCharge}</h3>
        <h3>If you have any questions, feel free to email us back at this address</h4>
        <br><br><br>
        
        <h3>Best,<h3>
        <br>
        <h3>The RallyPoint Team</h3>` //, // plaintext body
        // html: '<b>Hello world ✔</b>' // You can choose to send an HTML body instead
      };

      let recipientEmail = {
        from: gmail,
        to: res.locals.causeEmail,
        subject: 'Your cause has recieved a donation!',
        html: 
        `<h1>Your cause has recieved a donation!</h1>
        <h3>You have recieved a donation of $${actualCharge}.</h3>
        <h3>To see your current balance, login to you Stripe Dashboard from Rally Point.</h3>
        <br><br><br>
        
        <h3>Best,<h3>
        <br>
        <h3>The RallyPoint Team</h3>`
        
        //, // plaintext body
        // html: '<b>Hello world ✔</b>' // You can choose to send an HTML body instead
      };

      transporter.sendMail(donorEmail, function(error, info){
        if(error){
            console.log(error);
            
        }else{
            console.log('Message sent: ' + info.response);
            
        };
      });

      transporter.sendMail(recipientEmail, function(error, info){
        if(error){
            console.log(error);
            
        }else{
            console.log('Message sent: ' + info.response);
            
        };
      });
      let paymentObj = {
        amount: actualCharge,
        date: new Date(),
        recipient: res.locals.username,
        UserId: req.user.id
      }

      db.Payment.create(paymentObj).then(payment => console.log(payment))

      let earningObj = {
        amount: actualCharge,
        date: new Date(),
        donor: req.user.id,
        UserId: res.locals.id
      }

      db.Earning.create(earningObj).then(earning => console.log(earning))

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
  //-------------------------------------------------
  // Connect Stuff
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


  app.get('/token', isLoggedIn, async (req, res) => {
    // Check the state we got back equals the one we generated before proceeding.
    if (req.session.state != req.query.state) {
      res.redirect('/sign-in');
    }
    // Post the authorization code to Stripe to complete the authorization flow.
    request.post('https://connect.stripe.com/oauth/token', {
      form: {
        grant_type: 'authorization_code',
        client_id: 'ca_BOWzYl4q2Nq34am4i7mndZm4wDfoC4BO',
        client_secret: 'sk_test_H1nezbdzzB1eiwgOWgvCV3FL',
        code: req.query.code
      },
      json: true
    }, (err, response, body) => {
      if (err || body.error) {
        console.log('The Stripe onboarding process has not succeeded.');
      } else {
        // Update the model and store the Stripe account ID in the datastore.
        // This Stripe account ID will be used to pay out to the pilot.
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
      // Redirect to the final stage.
      
      res.redirect('/dashboard');
    });
  });

  // Stripe user dashboard link
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
  

  function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
      return next();
    res.redirect('/sign-in')
  }
}