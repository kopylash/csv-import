'use strict';

const ProcessingQueue = require('./ProcessingQueue');
const Worker = require('./Worker');

const processingQueue = new ProcessingQueue();
const workerPool = [new Worker('1', processingQueue), new Worker('2', processingQueue)]; // eslint-disable-line no-unused-vars

module.exports = {
  registerJob(fileInfo) {
    processingQueue.add(fileInfo);
  },

  getJobs() {
    return processingQueue.jobs;
  }
};
