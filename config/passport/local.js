const mongoose = require('mongoose');
const LocalStrategy = require('passport-local').Strategy;
const User = mongoose.model('User');

module.exports = new LocalStrategy(function(username, password, done) {
 
  User.findOne({ username }, function(err, user) {
    if (err) { return done(err); }
    if (!user) { return done(null, false); }
 
    user.comparePassword(password, function(err, isMatch) {
      if (err) { return done(err); }
      if (!isMatch) { return done(null, false); }
      
      return done(null, user);
    });
  });
  
});