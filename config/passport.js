/*//////

Reference for notes: https://code.tutsplus.com/tutorials/using-passport-with-sequelize-and-mysql--cms-27537

*///////


const db = require('../models')
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
   usernameField: 'email',
   passwordField: 'password',
   passReqToCallback: true 
  },

  (req, email, password, done) => {
    console.log('password:', password)
    console.log('email:', email)
    console.log('firstName: ', req.body.firstName)
    console.log('lastName: ', req.body.lastName)
    console.log('about', req.body.about)
    console.log('username:', req.body.username)
    const generateHash = (password) => {
      return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null)
    }

    db.User.findOne({
      where: {
        email: email
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
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          email: email,
          username: req.body.username,
          password: userPassword,
          about: req.body.about
        };

        db.User.create(data).then(function(newUser, created) {
          if (!newUser) {
            return done(null, false);
          }

          if (newUser) {
            req.session.userId = newUser._id 
            return done(null, newUser)
          }
        });
      };
    });
  }
  
  ));
  passport.use('local-signin', new LocalStrategy(
    {
    // by default, local strategy uses uxsername and password, we will override with email
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true 
    // allows us to pass back the entire request to the callback
    },
      
    function(req, email, password, done) {
    
      var User = user;
    
      var isValidPassword = function(userpass, password) {
        return bCrypt.compareSync(password, userpass);
        }
    
        User.findOne({
          where: {
            email: email
          }
        }).then(function(user) {
          if (!user) {
            return done(null, false, {
              message: 'Email does not exist'
            });
          }
          if (!isValidPassword(user.password, password)) {
            return done(null, false, {
              message: 'Incorrect password.'
            });
          }  
          var userinfo = user.get();
          return done(null, userinfo);
  
        }).catch(function(err) {
          console.log("Error:", err);
            return done(null, false, {
              message: 'Something went wrong with your Signin'
            });
        });
    }
   ));
}

