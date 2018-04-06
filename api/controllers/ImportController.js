'use strict';

const formidable = require('formidable');
const log = require('../../server/logger');

module.exports = {
  import(req, res) {
    const form = new formidable.IncomingForm();

    form.uploadDir = './tmp';
    form.keepExtensions = true;
    form.maxFileSize = 1000 * 1024 * 1024;

    form
      .on('file', function(field, file) {
        log.verbose(`File ${file.name} upload finished`);
      })
      .on('end', function() {
        res.status(200).send('File upload done');
      });

    form.parse(req);
  }
};
