const db = require("../models")

module.exports = (app) => {

  // Displays comments as JSON files. This gets all posts
  app.get("/api/comments", (req, res) => {
    db.Comment.findAll({include: db.User}).then(results => res.json(results))
  })

  
}