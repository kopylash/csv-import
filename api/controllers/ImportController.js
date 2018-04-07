'use strict';

const formidable = require('formidable');
const log = require('../../server/logger');
const CSVImportService = require('../services/csv-import/CSVImportService');
const {removeFile} = require('../../server/utils');

module.exports = {
  import(req, res) {
    let fileInfo;
    const form = new formidable.IncomingForm();

    form.uploadDir = './tmp';
    form.keepExtensions = true;
    form.maxFileSize = 1000 * 1024 * 1024;

    form
      .on('fileBegin', (field, file) => {
        fileInfo = {name: file.name, path: file.path};
      })
      .on('file', (field, file) => {
        log.verbose(`File ${file.name} upload finished`);
      })
      .on('end', () => {
        CSVImportService.registerJob(fileInfo);

        res.status(200).send('File upload done');
      })
      .on('error', (error) => {
        log.error('File uploading error.', error);

        removeFile(fileInfo.path, () => {
          res.status(500).send('File uploading failed');
        });
      });

    form.parse(req);
  },

  getJobs(req, res) {
    const jobs = CSVImportService.getJobs();

    return res.json(jobs);
  }
};
