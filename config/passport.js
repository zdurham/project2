/*//////

Reference for notes: https://code.tutsplus.com/tutorials/using-passport-with-sequelize-and-mysql--cms-27537

*///////

const bcrypt = require('bcrypt')
const db = require('../models')



module.exports = (passport, user) => {
  let User = user;
  let LocalStrategy = require('passport-local').Strategy

  passport.use('local-signup', new LocalStrategy({
   usernameField: 'email',
   passwordField: 'password',
   passReqToCallback: true 
  },

  (req, email, password, done) => {
    const generateHash = (password) => {
      return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null)
    }

    db.User.findOne({
      where: {
        email: email
      }
    })



  }

  



));
}

