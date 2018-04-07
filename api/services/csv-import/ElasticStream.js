'use strict';

const {Writable} = require('stream');
const ElasticsearchService = require('../ElasticsearchService');

const BULK_PAYLOAD_THRESHOLD = 15000;

class ElasticStream extends Writable {
  constructor(options) {
    super(Object.assign({}, options, {objectMode: true, highWaterMark: 1000}));
    this.bulkPayload = [];
    this.count = 0;
  }

  _write(chunk, encoding, callback) {
    this.bulkPayload.push(chunk[0], chunk[1]);
    this.count++;

    if (this.bulkPayload.length === BULK_PAYLOAD_THRESHOLD * 2) {
      return ElasticsearchService.bulkInsert(this.bulkPayload).then(() => {
        this.emit('progress', this.count);

        this.bulkPayload = [];

        callback();
      }).catch(error => callback(error));
    } else {
      callback();
    }
  }

  _final(callback) {
    if (this.bulkPayload.length > 0) {
      return ElasticsearchService.bulkInsert(this.bulkPayload).then(() => {
        this.emit('progress', this.count);

        this.bulkPayload = [];
        this.count = 0;

        callback();
      }).catch(error => callback(error));
    } else {
      callback();
    }
  }
}

module.exports = ElasticStream;
