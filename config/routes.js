module.exports = {
  'POST /import': {
    controller: 'ImportController',
    action: 'import'
  },

  'GET /jobs': {
    controller: 'ImportController',
    action: 'getJobs'
  }
};
