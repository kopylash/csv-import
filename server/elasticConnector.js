'use strict';

const elasticsearch = require('elasticsearch');
const config = require('../config/elasticsearch');
const log = require('./logger');

const onConnect = (client) => {
  client.ping({
    requestTimeout: 30000,
  }, function(error) {
    if (error) {
      log.error('Elasticsearch cluster is down! Retrying in 5s');
      return setTimeout(() => onConnect(client), 5000);
    } else {
      log.info('Elasticsearch is up. Recreating default index...');

      return recreateDefaultIndex(client);
    }
  });
};

const recreateDefaultIndex = (client) => {
  return client.indices.delete({
    index: config.defaultIndex,
    ignoreUnavailable: true
  }).then(() => {
    log.verbose('Deleted default index');

    return client.indices.create({
      index: config.defaultIndex,
      body: {
        settings: {
          index: {
            'number_of_shards': 3,
            'number_of_replicas': 0
          }
        }
      }
    }).then(() => {
      log.verbose('Created default index');
    });
  }).catch(error => {
    log.error('Failed to recreate default index.', error);
  });
};

module.exports = () => {
  const client = elasticsearch.Client({
    host: config.url,
    log: ['error', 'info']
  });

  onConnect(client);

  return client;
};
