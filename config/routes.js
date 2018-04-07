module.exports = {
  'POST /import': {
    controller: 'ImportController',
    action: 'import'
  },

  'GET /jobs': {
    controller: 'ImportController',
    action: 'getJobs'
  },

  'GET /search': {
    controller: 'SearchController',
    action: 'search'
  }
};
