const db = require("../models")

module.exports = (app, passport) => {
  
  // Displaying sign up page
  app.get("/sign-up", (req, res) => {
    res.render("sign-up", {message:  req.flash('signUpFailure')})
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
  app.post("/sign-in", passport.authenticate('local-signin', {
    successRedirect: '/dashboard',
    
    failureRedirect: '/',

    failureFlash: true
   }));


  function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
      return next();
    res.redirect('/')
  }
}