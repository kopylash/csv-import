'use strict';

const log = require('../../server/logger');
const ElasticsearchService = require('../services/ElasticsearchService');

module.exports = {
  search(req, res) {
    const query = req.query.query;

    if (!req.query.query) {
      return res.status(400).send('Invalid query');
    }

    return ElasticsearchService.searchContactByName(query).then(contacts => {
      log.verbose(`Found ${contacts.length} contacts`);

      return res.json(contacts);
    });
  }
};
