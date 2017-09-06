const db = require("../models")

module.exports = function(app) {
  app.get("/", function(req, res) {
    res.render("index")
  })

  // Displays the sign up page
  app.get("/sign-up", function(req, res) {
    res.render("sign-up")
  })

  // Display all Users and their related comments and posts
  app.get("/api/users", (req, res) => {
    db.User.findAll({ include: db.Post, include: db.Comment}).then(dbUser => {
      res.json(dbUser)
    })
  })
}
