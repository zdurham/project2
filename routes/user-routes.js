const db = require('../models')

module.exports = (app) => {

  app.get('/api/users', (req, res) => {
    // To conver the date into something meaningful  
    db.User.findAll({
      include: [{model: db.Post}, {model: db.Comment}, {model: db.Payment}, {model: db.Earning}, {model: db.Cause}]
    }).then(user => res.json(user))
  })
}