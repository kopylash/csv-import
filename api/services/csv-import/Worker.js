'use strict';

const fs = require('fs');
const csv = require('csv');
const {Transform} = require('stream');
const log = require('../../../server/logger');
const ElasticStream = require('./ElasticStream');

class Worker {
  constructor(id, queue) {
    this.id = id;
    this.busy = false;
    this.queue = queue;

    this.queue.on('file_added', () => this.checkQueue());
  }

  checkQueue() {
    if (!this.busy && !this.queue.isEmpty()) {
      this.process(this.queue.next());
    }
  }

  process(fileInfo) {
    this.busy = true;

    log.verbose(`${this.id}: Processing file ${fileInfo.name} ...`);

    const objectToBulk = new Transform({
      readableObjectMode: true,
      writableObjectMode: true,

      transform(chunk, encoding, callback) {
        this.push([{index: {_index: 'contacts', _type: 'contact'}}, chunk]);
        callback();
      }
    });
    const input = fs.createReadStream(fileInfo.path);

    const parser = csv.parse({auto_parse: true, columns: ['id', 'name', 'age', 'address', 'team']});
    parser.on('error', (error) => {
      log.error('CSV parsing error', error.message);
    });

    const pipeline = input.pipe(parser).pipe(objectToBulk).pipe(new ElasticStream());

    pipeline.on('progress', (count) => {
      log.verbose(`${this.id}: ${count} records stored`);
    });

    pipeline.on('error', (error) => {
      log.error(`${this.id}: elasticsearch streaming error`, error);
    });

    pipeline.on('finish', () => {
      log.verbose(`Finished processing ${fileInfo.name}`);
      this.busy = false;
      // update job status
      this.checkQueue();
    });
  }
}

module.exports = Worker;
