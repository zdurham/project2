const db = require("../models")

module.exports = (app) => {

  // Get all posts with comments
  app.get("/api/posts", (req, res) => {
    db.Post.findAll({include: db.Comment}).then((result) => {
      res.json(results);
    })
  })

  // Add a post
  app.post("/api/posts", (req, res) => {
    db.Post.create({
      title: req.body.title,
      subject: req.body.subject,
      body: req.body.body,
      image: req.body.image
    })
  }).then(result => res.json(result))

}