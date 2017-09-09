const db = require("../models")

module.exports = (app) => {

  // Renders the create-post template
  app.get("/create-post", (req, res) => {
    res.render('create-post')
  })

  // Puts posts into DB and links them to the user that is logged in
  app.post('/create-post', (req, res) => {
    db.Post.create({
      title: req.body.title,
      subject: req.body.subject,
      body: req.body.body,
      image: req.body.image ? req.body.image : null,
      UserId: req.user.id
    })
  })

  //---------------------------------------------
  // Api route below
  //---------------------------------------------

  // Gets posts in json format
  app.get("/api/posts", (req, res) => {
    db.Post.findAll({}).then((results) => {
      res.json(results);
    })
  })
}