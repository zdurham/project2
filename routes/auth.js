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


  // Displaying
  app.get('/dashboard', (req, res, next) => {
    if (req.isAuthenticated())
      return next();
    res.redirect('/sign-in')
  })

  // Registering user
  app.post("/sign-up", passport.authenticate('local-signup', {
   successRedirect: '/dashboard',
   
   failureRedirect: '/sign-up'
  }));
}