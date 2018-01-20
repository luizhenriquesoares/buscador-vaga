const mongoose = require("mongoose");

module.exports = (req, res, next) => {
  const urlObject = Url.find({ _id: req.params.id }).then(res => {
    return res;
  });

  urlObject.then(
    data => {
      req.body.hits = data[0].hits + 1;
      let url = req.body;
      const _id = data[0]._id;
      Url.findOneAndUpdate({ _id }, url).then(
        result => {
          next();
        },
        err => {
          res.status(404);
        }
      );
    },
    err => {
      res.sendStatus(404).end("Not Found!");
      next();
    }
  );
  next();
};
