'use strict';

const client = require('../../server/elasticConnector')();

module.exports = {
  searchByName(name) {

  },

  bulkInsert(bulkPayload) {
    return client.bulk({body: bulkPayload});
  },

  createIndex(index) {
    return client.indices.create({
      index,
      body: {
        settings: {
          index: {
            'number_of_shards': 3,
            'number_of_replicas': 0
          }
        }
      }
    });
  },

  deleteIndex(index) {
    return client.indices.delete({
      index,
      ignoreUnavailable: true
    });
  }
};
