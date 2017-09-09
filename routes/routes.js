const db = require("../models")

module.exports = (app) => {
  app.get("/", (req, res) => {
    res.render("front")
  })

  // Display all Users and their related comments and posts
  app.get("/api/users", (req, res) => {
    db.User.findAll({ include: db.Post}).then(dbUser => {
      res.json(dbUser)
    })
  })
}
