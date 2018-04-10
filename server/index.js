'use strict';

const routes = require('../config/routes');
const _port = require('../config/globals').port;
const log = require('./logger');

module.exports = {
  start({port = _port, env = process.env.NODE_ENV || 'development'}) {
    const express = require('express'),
      app = express(),
      server = require('http').createServer(app);

    const controllersMap = require('./controllersMapper');

    app.use(express.static('dist'));

    const httpRequestsHandler = require('./httpRequestsHandler');
    httpRequestsHandler.createHandlers(app, routes, controllersMap);

    return server.listen(port, () => {
      log.info('----------------------------------------------------------------');
      log.info('Server listening on port:' + server.address().port);
      log.info(`Log: ${log.transports.console.level}`);
      log.info(`ENV: ${env}`);
    });
  }
};
