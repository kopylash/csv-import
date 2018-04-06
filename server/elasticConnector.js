'use strict';

const elasticsearch = require('elasticsearch');
const config = require('../config/elasticsearch');
const log = require('./logger');

module.exports = () => {
  const client = elasticsearch.Client({
    host: config.url,
    log: ['error', 'info']
  });

  client.ping({
    requestTimeout: 30000,
  }, function(error) {
    if (error) {
      log.error('Elasticsearch cluster is down!');
    } else {
      log.verbose('Elasticsearch is up');
    }
  });

  return client;
};
