const db = require("../models")

module.exports = (app) => {

  // Posting a comment
  app.post("/posts/:postid/comment", (req, res) => {
    db.Comment.create({
      body: req.body.comment,
      UserId: req.user.id,
      PostId: req.params.postid
    }).then(result => {
      res.redirect(`/posts/${req.params.postid}`)
    })
  })

  // Displays comments as JSON files. This gets all comments
  app.get("/api/comments", (req, res) => {
    db.Comment.findAll({include: db.User}).then(results => res.json(results))
  })
}