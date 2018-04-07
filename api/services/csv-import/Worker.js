'use strict';

const fs = require('fs');
const csv = require('csv');
const {Transform} = require('stream');
const log = require('../../../server/logger');
const ElasticStream = require('./ElasticStream');
const jobStatus = require('./JobStatus');

class Worker {
  constructor(id, queue) {
    this.id = id;
    this.busy = false;
    this.queue = queue;

    this.queue.on('job_added', () => this.checkQueue());
  }

  checkQueue() {
    if (!this.busy && !this.queue.isEmpty) {
      this.process(this.queue.next());
    }
  }

  process(job) {
    this.busy = true;
    job.status = jobStatus.IN_PROGRESS;

    log.verbose(`${this.id}: Processing file ${job.file.name} ...`);

    const input = fs.createReadStream(job.file.path);

    const parser = csv.parse({
      auto_parse: true,
      columns: ['id', 'name', 'age', 'address', 'team'],
      skip_lines_with_error: true,
      skip_empty_lines: true,
    });

    parser.on('skip', (error) => {
      log.error(`${this.id}: CSV parsing error.`, error.message);

      job.errors.push(error.message);
    });

    parser.on('error', (error) => {
      log.error(`${this.id}: CSV parsing error`, error.message);

      job.errors.push(error.message);
    });

    const objectToBulk = new Transform({
      readableObjectMode: true,
      writableObjectMode: true,

      transform(chunk, encoding, callback) {
        this.push([{index: {_index: 'contacts', _type: 'contact'}}, chunk]);
        callback();
      }
    });

    const pipeline = input.pipe(parser).pipe(objectToBulk).pipe(new ElasticStream());

    pipeline.on('progress', (count) => {
      log.verbose(`${this.id}: ${count} records stored`);

      job.progress = count;
    });

    pipeline.on('error', (error) => {
      log.error(`${this.id}: elasticsearch streaming error`, error);

      job.errors.push(error.message);
    });

    pipeline.on('finish', () => {
      log.verbose(`${this.id}: Finished processing ${job.file.name}`);

      job.status = jobStatus.DONE;

      this.busy = false;
      this.checkQueue();
    });
  }
}

module.exports = Worker;
