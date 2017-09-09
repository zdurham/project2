const db = require("../models")

module.exports = (app) => {
  app.get("/", (req, res) => {
    res.render("main")
  })

  // Display all Users and their related comments and posts
  app.get("/api/users", (req, res) => {
    db.User.findAll({ include: db.Post, include: db.Comment}).then(dbUser => {
      res.json(dbUser)
    })
  })
}
