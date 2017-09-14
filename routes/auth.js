const db = require("../models")
const { check, validationResult } = require('express-validator/check');
const request = require('request')
// for the Stripe call later
const querystring = require('querystring')
const dotenv = require('dotenv')
dotenv.load()

//---------------------------------------------
// Setting up Stripe and keys
//---------------------------------------------
// const keyPublishable = process.env.PUBLISHABLE_KEY
// const keySecret = process.env.SECRET_KEY

const stripe = require('stripe')('sk_test_H1nezbdzzB1eiwgOWgvCV3FL')


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
     res.render('create-cause')
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
  // Setting up Stripe routes, hopefully they work
  //---------------------------------------------

  // Checkout stuff
  app.get('/donate', (req, res) => {
    res.render('donate', {keyPublishable: pk_test_CSHPgEKseohmnLTK37yhKPio})
  })


  app.post("/charge", (req, res) => {
    let amount = req.body.amount;
    let account = post.User.stripeAccountId

    stripe.customers.create({
      email: req.body.stripeEmail,
      source: req.body.stripeToken
    })
    .then(customer =>
      stripe.charges.create({
        amount,
        destination: {
          account: account
        },
        description: "Sample Charge",
        currency: "usd",
        customer: customer.id
        
      }))
    .then(charge => res.render("charge.pug"));
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




  function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
      return next();
    res.redirect('/sign-in')
  }
}