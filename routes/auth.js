const db = require("../models")
const { check, validationResult } = require('express-validator/check');

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
    }));



  function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
      return next();
    res.redirect('/')
  }
}