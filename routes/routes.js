const db = require("../models")

module.exports = (app) => {
  
  // Displays the front page
  // app.get('/', (req, res) => {
  //   if (req.user) {
  //     res.render('front', {user: req.user})
  //   }
  //   else {
  //     res.render('front')
  //   }
  // })

  

  // Display all Users and their related comments and posts
  app.get('/api/users', (req, res) => {
    db.User.findAll({ include: [{model: db.Post}, {model: db.Comment}]}).then(dbUser => {
      res.json(dbUser)
    })
  })
       app.get("/test", (req, res) => {
      res.render("test")
  });
    app.get('/profile', (req, res)=>{
    res.render("dashboard")
  });
}

