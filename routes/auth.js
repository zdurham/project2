const db = require("../models")
const { check, validationResult } = require('express-validator/check');

module.exports = (app, passport) => {
  
  // Displaying sign up page
  app.get("/sign-up", (req, res) => {
    res.render("sign-up", {message:  req.flash('signUpFailure')})
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
      res.render('dashboard', {user: req.user})
    })
  
  // Registering user
  app.post("/sign-up", passport.authenticate('local-signup', {
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
    passport.authenticate('local-signin', {
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