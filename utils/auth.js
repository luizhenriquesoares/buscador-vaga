const jwt = require('jwt-simple');

module.exports = { tokenForUser, isAdmin, canView };

function tokenForUser(user) {
  const timestamp = new Date().getTime();
  return jwt.encode({ sub: user._id, iat: timestamp }, process.env.SECRET_PASSPORT);
}

function isAdmin(perm) {
    return ["admin"].includes(perm);
}

function canView(perm) {
    return ["view", "consultor", "admin", "-"].includes(perm);
}