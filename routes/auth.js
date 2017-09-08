const db = require("../models")

module.exports = (app, passport) => {
  
  // Displaying sign up page
  app.get("/sign-up", (req, res) => {
    res.render("sign-up")
  })  

  // Displaying sign-in page
  app.get("/sign-in", (req, res) => {
    res.render("sign-in")
  })


  // Displaying welcome
  app.get('/welcome', isLoggedIn, (req, res) => {
    console.log('id', req.session.userId)
      res.render("welcome")
  }) 

  // Registering user
  app.post("/sign-up", passport.authenticate('local-signup', {
   successRedirect: '/welcome',
   
   failureRedirect: '/sign-up'
  }));

  // Returning user signs in
  app.post("/sign-in", passport.authenticate('local-signin', {
    successRedirect: '/welcome',
    
    failureRedirect: '/sign-up'
   }));


  function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
      return next();
    res.redirect('/sign-in')
  }
}