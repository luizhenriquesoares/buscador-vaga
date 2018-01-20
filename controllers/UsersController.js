const mongoose = require("mongoose");
const User = mongoose.model("User");
const Url = mongoose.model("Url");
const config = require("../utils/config");
const TinyURL = require("tinyurl");

exports.shortenUrl = (req, res) => {
  const userId = User.findById(req.params.userId).then(result => {
    return result._id;
  });

  userId.then(
    user => {
      const longUrl = req.body.url;
      let shortUrl = "";
      Url.findOne({ long_url: longUrl, user_id: user }, (err, doc) => {
        if (doc) {
          TinyURL.shorten(longUrl, shortUrl => {
            res.status(201).json({
              id: doc._id,
              hits: doc.hits,
              url: longUrl,
              shortUrl: shortUrl
            });
          });
        } else {
          TinyURL.shorten(longUrl, shortUrl => {
            const newUrl = new Url({
              long_url: longUrl,
              shortUrl: shortUrl,
              user_id: req.params.userId
            });

            newUrl.save(err => {
              if (err) {
                console.log(err);
              }
            });
            res.status(201).json({
              id: newUrl._id,
              hits: newUrl.hits,
              url: longUrl,
              shortUrl: shortUrl
            });
          });
        }
      });
    },
    err => {
      res.status(404).json({
        error: "User Not Found"
      });
    }
  );
};

exports.getUrl = (req, res) => {
  const urlID = req.params.id;

  Url.findOne({ _id: urlID }, (err, doc) => {
    if (doc) {
      return res.redirect("http://" + doc.long_url);
    } else {
      res.sendStatus(404).end("Not Found!");
    }
  });
};

/**
 * Apaga um Usuário
 * @param
 */
exports.delete = (req, res) => {
  User.remove({ _id: req.params.userId }).then(
    function(result) {
      res.sendStatus(200);
    },
    function(err) {
      res.sendStatus(500);
    }
  );
};
