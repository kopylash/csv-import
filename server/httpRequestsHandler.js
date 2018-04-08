'use strict';

const path = require('path');
const asyncMiddleware = require('./utils').asyncMiddleware;
const log = require('./logger');

module.exports = {
  createHandlers(app, routes, controllers) {
    app.use((req, res, next) => {
      log.verbose(`HTTP Request :: Method: ${req.method}, Url: ${req.url}`);
      next();
    });

    // CORS support
    app.use((req, res, next) => {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
      next();
    });

    Object.keys(routes).forEach(routePath => {
      let handleRoute = _getParsedRoute(routes[routePath], routePath);

      if (_isRouteValidated(app, handleRoute, controllers)) {
        log.info(`Routes :: Route: "${routePath}" is loaded`);

        _mapRouteAndApplyMiddleware(app, handleRoute, controllers[handleRoute.controller][handleRoute.action]);
      } else {
        process.exit(1); //eslint-disable-line
      }
    });

    app.use((error, req, res) => {
      log.error(error);
      res.status(500).send(error.message);
    });
  }
};

function _getParsedRoute(route, routePath) {
  let splitRoute = routePath.split(' ', 2);

  return {
    url: splitRoute[1],
    method: splitRoute[0].toLowerCase(),
    action: route.action,
    controller: path.normalize(route.controller)
  };
}

function _isRouteValidated(app, route, controllers) {
  if (!controllers.hasOwnProperty(route.controller)) {
    log.error(`Routes :: Controller: "${route.controller}" undefined`);
    return false;
  }

  if (!controllers[route.controller].hasOwnProperty(route.action)) {
    log.error(`Routes :: Action: "${route.action}" in Controller: "${route.controller}" undefined`);
    return false;
  }

  if (!app.hasOwnProperty(route.method)) {
    log.error(`Routes :: Http method: "${route.method}" undefined`);
    return false;
  }

  return true;
}

function _mapRouteAndApplyMiddleware(app, route, controllerAction) {
  app[route.method](route.url, asyncMiddleware(controllerAction));
}
