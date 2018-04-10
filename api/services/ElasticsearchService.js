'use strict';

const client = require('../../server/elasticConnector')();
const {defaultIndex, defaultType} = require('../../config/elasticsearch');

module.exports = {
  searchContactByName(name) {
    return client.search({
      index: defaultIndex,
      type: defaultType,
      body: {
        query: {
          match_phrase_prefix: {
            name: {
              query: name,
              slop: 6
            }
          }
        },
        size: 20
      }
    }).then(res => {
      return res.hits.hits.map(i => i._source);
    });
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
