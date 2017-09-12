const db = require("../models")

module.exports = (app, passport) => {
  
  // Displaying sign up page
  app.get("/sign-up", (req, res) => {
    res.render("sign-up")
  })  

  // Logging out
  app.get("/logout", (req, res) => {
    req.session.destroy((err) => {
      res.redirect('/')
    })
  })

  // Displaying welcome after successful login
  app.get('/dashboard', isLoggedIn, (req, res) => {
    console.log('id', 'this is working')
      res.render('dashboard', {username: req.user.username})
    })

  // Registering user
  app.post("/sign-up", passport.authenticate('local-signup', {
   successRedirect: '/dashboard',
   
   failureRedirect: '/sign-up'
  }));

  // Returning user signs in
  app.post("/sign-in", passport.authenticate('local-signin', {
    successRedirect: '/dashboard',
    
    failureRedirect: '/sign-in'
   }));


  function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
      return next();
    res.redirect('/')
  }
}