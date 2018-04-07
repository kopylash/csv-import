'use strict';

const EventEmitter = require('events');
const jobStatus = require('./JobStatus');

class ProcessingQueue extends EventEmitter {
  constructor() {
    super();
    this.jobs = [];
  }

  get isEmpty() {
    return !this.jobs.find(j => j.status === jobStatus.PENDING);
  }

  /**
   * Adds a job to the queue to process given file
   * @param fileInfo
   * @param fileInfo.name name of the original file
   * @param fileInfo.path path to the contents of the file
   */
  add(fileInfo) {
    this.jobs.push({
      id: Date.now(),
      status: jobStatus.PENDING,
      file: fileInfo,
      progress: 0,
      errors: []
    });

    this.emit('job_added');
  }

  /**
   * Gets next pending job from the queue
   * @return {Object}
   */
  next() {
    return this.jobs.find(j => j.status === jobStatus.PENDING);
  }
}

module.exports = ProcessingQueue;
