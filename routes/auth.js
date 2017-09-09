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

  // Logging out
  app.get("/logout", (req, res) => {
    req.session.destroy((err) => {
      res.redirect('/')
    })
  })

  // Displaying welcome after successful login
  app.get('/welcome', isLoggedIn, (req, res) => {
    console.log('id', req.session.id)
    db.User.findOne({
      where: {
        userId: req.session.id
      } 
    }).then(dbUser => {
      console.log(dbUser)
      res.render('welcome', {username: dbUser.username})
    })
  })

  // Registering user
  app.post("/sign-up", passport.authenticate('local-signup', {
   successRedirect: '/welcome',
   
   failureRedirect: '/sign-up'
  }));

  // Returning user signs in
  app.post("/sign-in", passport.authenticate('local-signin', {
    successRedirect: '/welcome',
    
    failureRedirect: '/sign-in'
   }));


  function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
      return next();
    res.redirect('/sign-in')
  }
}