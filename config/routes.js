const express = require("express");
const passport = require("passport");
const Router = express.Router();

// Import route grouper
require("../utils/express-group-router");

/* controllers -------------------------------------------------------------- */
const authController = require("../controllers/auth.controller");
const githubController = require("../controllers/github.controller");
/* -------------------------------------------------------------------------- *\
 *  Exposes routes
\* -------------------------------------------------------------------------- */

module.exports = function(app, passport) {
  /* auth middlewares ------------------------------------------------------- */
  const auth = passport.authenticate.bind(passport);
  const jwtAuth = passport.authenticate("jwt", { session: false });
  const requireSignin = passport.authenticate("local", { session: false });
  const authMid = require("./middlewares/authorization");
  const commonAuth = authMid;

  Router.group("/api/", Router => {
    /* GitHub --------------------------------------------------------------- */
    Router.get(
      "/github/allUsers/:technology/:location",
      githubController.getDataGitHub
    );

    /* Auth ----------------------------------------------------------------- */
    Router.get("/user/reset/:token", authController.getUserWithResetToken);
    Router.post("/reset/:token", authController.resetPassword);
    Router.post("/forgot", authController.forgotPassword);
    Router.post("/login", requireSignin, authController.login);
  });

  app.use(Router);
};
