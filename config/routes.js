const express = require("express");
const passport = require("passport");
const Router = express.Router();

// Import route grouper
require("../utils/express-group-router");

/* controllers -------------------------------------------------------------- */
// const users = require("../controllers/UsersController");
// const stats = require("../controllers/StatsController");
const auth = require("../controllers/AuthController");

/* -------------------------------------------------------------------------- *\
 *  Exposes routes
\* -------------------------------------------------------------------------- */

module.exports = function(app, passport) {
  /* auth middlewares ------------------------------------------------------- */
  const pauth = passport.authenticate.bind(passport);
  const jwtAuth = passport.authenticate("jwt", { session: false });
  const requireSignin = passport.authenticate("local", { session: false });
  const authMid = require("./middlewares/authorization");
  const statsMid = require("./middlewares/stats");
  const commonAuth = [statsMid, authMid];

  Router.group("/api/", Router => {});

  // /* Stats ---------------------------------------------------------------- */
  // Router.get("/stats", stats.curretStats);
  // Router.get("/stats/:id", stats.curretStatsUrl);
  // Router.get("/users/:userId/stats", stats.curretUserStats);

  // /* Users ---------------------------------------------------------------- */
  // Router.get("/urls/:id", commonAuth, users.getUrl);
  // Router.post("/users", auth.register);
  // Router.post("/users/:userId/urls", commonAuth, users.shortenUrl);
  // Router.delete("/user/:userId", users.delete);

  /* Auth ----------------------------------------------------------------- */
  Router.get("/user/reset/:token", auth.getUserWithResetToken);
  Router.post("/reset/:token", auth.resetPassword);
  Router.post("/forgot", auth.forgotPassword);
  Router.post("/login", requireSignin, auth.login);

  app.use(Router);
};
