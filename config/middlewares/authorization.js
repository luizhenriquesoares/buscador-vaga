const { canView, isAdmin } = require("../../utils/auth");

module.exports = (req, res, next) => {
  // simulando o usuário é admin, em uma implementação real, o request de usuário, é atribuido no login
  // assim o middleware pode fazer as validações;
  const isSuper = true;

  if (isSuper) {
    next();
    return;
  }

  if (_getRule(req)(req.user, req)) {
    next();
    return;
  }

  res.sendStatus(403).end("forbidden");
};

const authRules = {
  USER: {
    ALL: (user, req) => {
      return true;
    },
    GET: (user, req) => {
      return true;
    },
    PUT: (user, req) => {
      return user._id.toString() === req.params.userID;
    }
  }
};

/* Funções auxiliares --------------------------------------------------------*/

function _getRule(req) {
  let path = req.route.path;
  let rule = _defaultAction;
  let method = req.method;
  try {
    const pieces = path
      .toUpperCase()
      .split("/")
      .slice(1);
    const entity = pieces[0],
      action = _getAction(pieces[1], method);
    if (
      authRules[entity] !== undefined &&
      authRules[entity][action] !== undefined
    )
      rule = authRules[entity][action];
  } catch (err) {
    console.log("Erro crítico capturando regra de acesso:");
    console.log(err);
  }
  return rule;
}

function _defaultAction(user, req) {
  console.log(
    `AUTHORIZATION: endpoint ${req.route.path} being denied by defaultAction`
  );
  return false;
}

function _getAction(routePiece, method) {
  return routePiece === undefined ||
    routePiece === "" ||
    routePiece.startsWith(":")
    ? method
    : routePiece;
}
