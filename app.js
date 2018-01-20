/* dependencies-------------------------------------------------------------- */
const fs = require("fs");
const express = require("express");
const chalk = require("chalk");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const passport = require("passport");
const join = require("path").join;

/* ENV ---------------------------------------------------------------------- */
dotenv.load({ path: ".env" });
const port = process.env.PORT || 3000;

/* Models init -------------------------------------------------------------- */
const models = join(__dirname, "models");

fs
  .readdirSync(models)
  .filter(file => ~file.search(/^[^\.].*\.js$/))
  .forEach(file => require(join(models, file)));

/* app config --------------------------------------------------------------- */
const app = express();

require("./config/passport")(passport);
require("./config/express")(app, passport);
require("./config/routes")(app, passport);

/* bootstrap ---------------------------------------------------------------- */
module.exports = app;

connect()
  .on("error", console.log)
  .on("disconnected", connect)
  .once("open", listen);

function connect() {
  var options = { server: { socketOptions: { keepAlive: 1 } } };
  mongoose.Promise = global.Promise;
  return mongoose.connect(
    process.env.MONGODB_URI || process.env.MONGOLAB_URI,
    options
  ).connection;
}

function listen() {
  app.listen(port, () => {
    console.log(
      "%s Express server listening on port %d in %s mode.",
      chalk.green("✓"),
      port,
      app.get("env")
    );
  });
}
