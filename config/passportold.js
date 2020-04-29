const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

// Load User model
const User = require('../model');

module.exports = function(passport) {
  passport.use(new LocalStrategy(
     (username, password, done) => {
         if(username === 'admin' && password === 'admin') {
             return done(null, {username: 'admin'});
         } else {
             return done(null, false);
         }
      }
 ));
 
 passport.serializeUser((user, done) => {
        done(null, user.username);
    });
  passport.deserializeUser((username, done) => {
    done(null, {username: username});
}); 
};