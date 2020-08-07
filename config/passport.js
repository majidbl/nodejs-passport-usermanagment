const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

// Load User model
const User = require('../model');

module.exports = function(passport) {
  passport.use(new LocalStrategy({ usernameField: 'username' },
     (username, password, done) => {
         User.findOne({where:{username:username}}).then(user => 
         {
           if(!user){
           return done(null, false)
         }
         if (user.password !== password) {
           return done(null, false);
         }
         return done(null, user);
      })
       
     }
 ));
 
 passport.serializeUser(function(user, done){
        done(null, user.id);
    });
  passport.deserializeUser(function(id, done){
    User.findByPk(id).then(function(user) {
 
        if (user) { 
            done(null, user.get());
        } else {
            done(user.errors, null);
        }
    });
}); 
};