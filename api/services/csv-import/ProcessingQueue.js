'use strict';

const EventEmitter = require('events');

class ProcessingQueue extends EventEmitter {
  constructor() {
    super();
    this.files = [];
  }

  isEmpty() {
    return !this.files.length;
  }

  /**
   * Adds info about file to the processing queue
   * @param fileInfo
   * @param fileInfo.name name of the original file
   * @param fileInfo.path path to the contents of the file
   */
  add(fileInfo) {
    this.files.push(fileInfo);
    this.emit('file_added');
  }

  next() {
    return this.files.shift();
  }
}

module.exports = ProcessingQueue;
