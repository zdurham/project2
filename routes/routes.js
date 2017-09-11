const db = require("../models")

module.exports = (app) => {
  
  // Displays the front page
  app.get('/', (req, res) => {
    res.render("front")
  })

  

  // Display all Users and their related comments and posts
  app.get('/api/users', (req, res) => {
    db.User.findAll({ include: [{model: db.Post}, {model: db.Comment}]}).then(dbUser => {
      res.json(dbUser)
    })
  })

  // test page delete before merging
  app.get('/test', (req, res) =>{
      res.render("test")
      })
  app.get('/dashboard', (req, res)=>{
    res.render("dashboard")
  })

}

