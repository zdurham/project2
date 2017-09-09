const db = require("../models")

module.exports = (app) => {
  
  // Displays the front page
  app.get('/', (req, res) => {
    res.render("front")
  })

  app.get('/post-list', (req, res) => {
    db.Post.findAll().then(dbPost => {
      res.render('post-list', {posts: dbPost})
    })    
  })

  // Display all Users and their related comments and posts
  app.get('/api/users', (req, res) => {
    db.User.findAll({ include: [{model: db.Post}, {model: db.Comment}]}).then(dbUser => {
      res.json(dbUser)
    })
  })
}
