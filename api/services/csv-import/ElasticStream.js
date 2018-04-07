'use strict';

const {Writable} = require('stream');
const ElasticsearchService = require('../ElasticsearchService');

const BULK_PAYLOAD_THRESHOLD = 10000;

class ElasticStream extends Writable {
  constructor(options) {
    super(Object.assign({}, options, {objectMode: true, highWaterMark: 1000}));
    this.bulkPayload = [];
    this.count = 0;
  }

  _write(chunk, encoding, callback) {
    if (this.bulkPayload.length === BULK_PAYLOAD_THRESHOLD * 2) {
      return ElasticsearchService.bulkInsert(this.bulkPayload).then(() => {
        this.count += BULK_PAYLOAD_THRESHOLD;
        this.bulkPayload = [];

        this.emit('progress', this.count);

        callback();
      }).catch(error => callback(error));
    } else {
      this.bulkPayload.push(chunk[0]);
      this.bulkPayload.push(chunk[1]);

      callback();
    }
  }

  _final(callback) {
    return ElasticsearchService.bulkInsert(this.bulkPayload).then(() => {
      this.count += this.bulkPayload.length / 2;
      this.bulkPayload = [];

      this.emit('progress', this.count);
      this.count = 0;

      callback();
    }).catch(error => callback(error));
  }
}

module.exports = ElasticStream;
