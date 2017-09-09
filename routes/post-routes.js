const db = require("../models")

module.exports = (app) => {

  app.get("/create-post", (req, res) => {
    res.render('create-post')
  })

  app.get("/api/posts", (req, res) => {
    db.Post.findAll({}).then((results) => {
      res.json(results);
    })
  })

  app.post('/create-post', (req, res) => {
    db.Post.create({
      title: req.body.title,
      subject: req.body.subject,
      body: req.body.body,
      image: req.body.image ? req.body.image : null,
      UserId: req.user.id
    })
  })
}