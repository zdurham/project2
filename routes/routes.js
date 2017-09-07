const db = require("../models")

module.exports = (app) => {
  app.get("/", (req, res) => {
    res.render("index2")
  })

  // Displays the sign up page
  app.get("/sign-up", (req, res) => {
    res.render("sign-up")
  })

  app.get("/welcome", (req, res) => {
    res.render("welcome")
  })

  // Post a user
  app.post("/api/users", (req, res) => {
    console.log(req.body)
    db.User.create({
      username: req.body.username,
      email: req.body.email,
      description: req.body.description
    }).then(dbUser => res.render('welcome'))
  })

  // Display all Users and their related comments and posts
  app.get("/api/users", (req, res) => {
    db.User.findAll({ include: db.Post, include: db.Comment}).then(dbUser => {
      res.json(dbUser)
    })
  })
}
