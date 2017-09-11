const db = require('../models')

module.exports = (app) => {
  app.get("/api/users", (req, res) => {
    db.User.findAll({ include: db.Post }).then(
      results => res.json(results)
    )
  })
}