const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt-nodejs");

const userSchema = new Schema({
  username: {
    type: String,
    lowercase: true,
    maxlength: [40, "Username muito grande"],
    minlength: [2, "Username muito pequeno"],
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  email: {
    type: String
  },
  password: {
    type: String,
    minlength: [3, "seu password Ã© muito curto"],
    required: true
  },
  isSuper: {
    type: Boolean,
    default: true
  }
});

// On Save Hook, encrypt password
// Before saving a model, run this function
userSchema.pre("save", function(next) {
  // get access to the user model
  const user = this;

  // generate a salt then run callback
  bcrypt.genSalt(10, function(err, salt) {
    if (err) {
      return next(err);
    }

    // hash (encrypt) our password using the salt
    bcrypt.hash(user.password, salt, null, function(err, hash) {
      if (err) {
        return next(err);
      }

      // overwrite plain text password with encrypted password
      user.password = hash;
      next();
    });
  });
});

userSchema.methods.comparePassword = function(candidatePassword, callback) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) {
      return callback(err);
    }

    callback(null, isMatch);
  });
};

const User = mongoose.model("User", userSchema);

module.exports = User;
