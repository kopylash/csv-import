'use strict';

const fs = require('fs');
const csv = require('csv');
const {Transform} = require('stream');
const pump = require('pump');
const {removeFile} = require('../../../server/utils');
const {defaultIndex, defaultType} = require('../../../config/elasticsearch');
const log = require('../../../server/logger');
const jobStatus = require('./JobStatus');
const ElasticStream = require('./streams/ElasticStream');
const ValidationStream = require('./streams/ValidationStream');

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

    const validator = new ValidationStream();
    validator.on('skip', (errors) => {
      const messages = errors.map(e => e.message);

      log.error(`${this.id}: Validation error.`, messages.join('\n'));

      job.errors.push(messages);
    });

    const objectToBulk = new Transform({
      readableObjectMode: true,
      writableObjectMode: true,

      transform(chunk, encoding, callback) {
        this.push([{index: {_index: defaultIndex, _type: defaultType}}, chunk]);
        callback();
      }
    });

    const pipeline = pump(input, parser, validator, objectToBulk, new ElasticStream(), (error) => {
      if (error) {
        job.status = jobStatus.ERROR;
      } else {
        job.status = jobStatus.DONE;
      }

      log.verbose(`${this.id}: Finished processing ${job.file.name}`);

      setImmediate(removeFile, job.file.path);
      this.busy = false;
      this.checkQueue();
    });

    pipeline.on('progress', (count) => {
      log.verbose(`${this.id}: ${count} records stored`);

      job.progress = count;
    });

    pipeline.on('error', (error) => {
      log.error(`${this.id}: elasticsearch streaming error`, error);

      job.errors.push(error.message);
    });
  }
}

module.exports = Worker;
