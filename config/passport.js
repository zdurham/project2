/*//////

Reference for notes: https://code.tutsplus.com/tutorials/using-passport-with-sequelize-and-mysql--cms-27537

*///////


const db = require('../models')
const bcrypt = require('bcrypt')


module.exports = (passport, user) => {
  user = db.User;
  let LocalStrategy = require('passport-local').Strategy

  passport.serializeUser(function(user, done) {
    done(null, user.id);
    });


// used to deserialize the user
  passport.deserializeUser(function(id, done) {
    db.User.findById(id).then(function(user) {
      if(user){
        done(null, user.get());
        }
      else{
        done(user.errors,null);
        }
    });
  });

  
  // Local sign-up
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
    }).then(user => {
      if (user) {
        return done(null, false, req.flash('signUpFailure', 'That email address is already taken'));
      }
      else {
        const userPassword = generateHash(password)
        
        const data = {
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          email: email,
          username: req.body.username,
          password: userPassword,
          about: req.body.about,
          userId: req.sessionID
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

  // Local sign-in
  passport.use('local-signin', new LocalStrategy(
    {
    // by default, local strategy uses uxsername and password, we will override with email
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true 
    // allows us to pass back the entire request to the callback
    },
      
    function(req, email, password, done) {
      err = validationResult(req).mapped()
      
      if (err) {
        if (err.email) {
          req.flash('badEmail', 'Please enter a valid email address')
        }
        if (err.password) {
          req.flash('badPass', 'Your password is required')
        }
      }

      var isValidPassword = function(userpass, password) {
        return bcrypt.compareSync(password, userpass);
        }
    
      db.User.findOne({
        where: {
          email: email
        }
      }).then(function(user) {
        
        if (!user) {
          return done(null, false, req.flash('emailErr', 'Email does not exist'));
        }
        if (!isValidPassword(user.password, password)) {
          return done(null, false, req.flash('passErr' , 'Incorrect password.'));
        }

        
        var userinfo = user.get()
        console.log(userinfo)
        return done(null, userinfo);

      }).catch(function(err) {
        console.log("Error:", err);
          return done(null, false, req.flash('err', 'Something went wrong with your sign-ing'));
      });
    }
   ));
}

