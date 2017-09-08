/*//////

Reference for notes: https://code.tutsplus.com/tutorials/using-passport-with-sequelize-and-mysql--cms-27537

*///////

const bcrypt = require('bcrypt')


module.exports = (passport, user) => {
  let User = user;
  let LocalStrategy = require('passport-local').Strategy

  passport.serializeUser(function(user, done) {
    done(null, user.id);
    });


// used to deserialize the user
passport.deserializeUser(function(id, done) {
  User.findById(id).then(function(user) {
    if(user){
      done(null, user.get());
      }
    else{
      done(user.errors,null);
      }
  });
});

  

  passport.use('local-signup', new LocalStrategy({
   usernameField: 'username',
   passwordField: 'password',
   emailField: 'email',
   descriptionField: 'description',
   passReqToCallback: true 
  },

  (req, email, password, done) => {
    const generateHash = (password) => {
      return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null)
    }

    db.User.findOne({
      where: {
        username: username
      }
    }).then(user => {
      if (user) {
        return done(null, false, {
          message: 'That email is already taken'
        });
      }
      else {
        const userPassword = generateHash(password)
        
        const data = {
          username: username,
          password: userPassword,
          email: req.body.email,
          description: req.body.description
        };

        db.User.create(data).then(function(newUser, created) {
          if (!newUser) {
            return done(null, false);
          }

          if (newUser) {
            return done(null, newUser)
          }
        });
      };
    });
  }
  
));
}

