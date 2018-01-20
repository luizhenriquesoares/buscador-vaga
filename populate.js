/* -------------------------------------------------------------------------- *\
 * Population of initial data for the project
\* -------------------------------------------------------------------------- */

const mongoose = require("mongoose");
const join = require("path").join;
const fs = require("fs");
const dotenv = require("dotenv");
const q = require("q");
dotenv.load({ path: ".env" });

/* Loads the models --------------------------------------------------------- */

const models = join(__dirname, "models");
fs
  .readdirSync(models)
  .filter(file => ~file.search(/^[^\.].*\.js$/))
  .forEach(file => require(join(models, file)));

/* Exec --------------------------------------------------------------------- */

connect()
  .on("error", console.log)
  .on("disconnected", connect)
  .once("open", initData);

/* execution functions ------------------------------------------------------ */

/**
 * Function that connects to mongoose and returns the connection object
 */
function connect() {
  mongoose.Promise = global.Promise;
  return mongoose.connect(process.env.MONGODB_URI).connection;
}

/**
 * Function that executes the data insertion - called after connection
 */
function initData() {
  const User = mongoose.model("User");
  const Url = mongoose.model("Url");
  const Counters = mongoose.model("counters");

  let clearPromises = [User.remove({}), Url.remove({}), Counters.remove({})];

  let insertPromises = [
    /* User ------ */
    getSavePromise(User, {
      _id: "5a16dc054ea69f308c1c4cb9",
      email: "test@gmail.com",
      password: "root",
      username: "test"
    }),

    /* Url -------- */
    getSavePromise(Counters, { _id: "url_count", seq: 0 })
  ];

  console.log(`Executing ${clearPromises.length} remove queries`);

  q
    .all(clearPromises)
    .then(result => {
      console.log(
        `Old data removed. Executing ${insertPromises.length} insert queries`
      );

      q
        .all(insertPromises)
        .then(() => {
          console.log("Data successfully inserted");
          process.exit();
        })
        .catch(errorHandler);
    })
    .catch(errorHandler);

  console.log("Now waiting...");
}

/**
 * Gets the `save` promise to save `data` into the `Clazz` schema
 * @param {mongoose.Schema} Clazz
 * @param {Object} data
 */
function getSavePromise(Clazz, data) {
  let doc = new Clazz(data);
  return doc.save();
}

/**
 * Handles mongoose errors on promises
 * @param {MongooseError} err
 */
function errorHandler(err) {
  consol.log("Error, exiting");
  console.log(err);
  process.exit();
}
