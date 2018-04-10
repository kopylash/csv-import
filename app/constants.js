'use strict';

export default {
  apiURL: API_URL || 'http://localhost:8080',

  jobsCheckingInterval: 3000,

  jobStatus: {
    PENDING: 'pending',
    IN_PROGRESS: 'in progress',
    DONE: 'done',
    ERROR: 'error'
  }
};
