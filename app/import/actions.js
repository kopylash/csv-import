'use strict';

import CONSTANTS from '../constants';

export const checkJobsStatus = () => {
  return fetch(`${CONSTANTS.apiURL}/jobs`).then(res => res.json());
};
