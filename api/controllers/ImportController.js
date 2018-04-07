'use strict';

const formidable = require('formidable');
const log = require('../../server/logger');
const CSVImportService = require('../services/csv-import/CSVImportService');

module.exports = {
  import(req, res) {
    let fileInfo;
    const form = new formidable.IncomingForm();

    form.uploadDir = './tmp';
    form.keepExtensions = true;
    form.maxFileSize = 1000 * 1024 * 1024;

    form
      .on('file', function(field, file) {
        log.verbose(`File ${file.name} upload finished`);
        fileInfo = {name: file.name, path: file.path};
      })
      .on('end', function() {
        CSVImportService.registerJob(fileInfo);
        res.status(200).send('File upload done');
      });

    form.parse(req);
  },

  getJobs(req, res) {
    const jobs = CSVImportService.getJobs();

    return res.json(jobs);
  }
};
