const mongoose = require("mongoose");
const User = mongoose.model("User");
const crypto = require("crypto");
const { tokenForUser } = require("../utils/auth");

exports.login = (req, res) => {
  res.send({
    token: tokenForUser(req.user)
  });
};

exports.forgotPassword = (req, res, next) => {
  const buf = crypto.randomBytes(20);
  const token = buf.toString("hex");

  User.findOne({
    email: req.body.email
  }).then(
    (user, err) => {
      user.resetPasswordToken = token;
      user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

      user.save(() => {
        console.log(
          "resetPassword Salvo com sucesso" + " " + user.resetPasswordToken
        );
      });
    },
    err => {
      res.json("usuário não encontrado");
    }
  );
};
exports.getUserWithResetToken = (req, res) => {
  User.findOne(
    {
      resetPasswordToken: req.params.token,
      resetPasswordExpires: {
        $gt: Date.now()
      }
    },
    (err, user) => {
      if (!user) {
        res.status(404).json("usuário não encontrado!");
      }
      res.json(user);
    }
  );
};

exports.resetPassword = (req, res) => {
  User.findOne(
    {
      resetPasswordToken: req.params.token,
      resetPasswordExpires: {
        $gt: Date.now()
      }
    },
    (err, user) => {
      user.password = req.body.password;
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      if (!user) {
        res.json("usuário não existe");
      }
      user.save();
    }
  );
};

exports.register = (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const email = req.body.email;

  if (!username || !password) {
    return res.status(422).send({
      error: "You must provide username and password"
    });
  }
  // See if a user with the given username exists
  User.findOne(
    {
      username: username
    },
    function(err, existingUser) {
      if (err) {
        return next(err);
      }

      // If a user with username does exist, return an error
      if (existingUser) {
        return res.status(409).send({
          error: "username is in use"
        });
      }

      // If a user with username does NOT exist, create and save user record
      const user = new User({
        username: username,
        password: password,
        email: email
      });

      user.save(function(err) {
        if (err) {
          return next(err);
        }

        res.status(201).send({
          success: "Created User",
          id: user.username
        });

        // Repond to request indicating the user was created
        // res.json({token: tokenForUser(user)});
      });
    }
  );
};
