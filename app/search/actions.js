'use strict';

import CONSTANTS from '../constants';

export const searchContacts = (input) => {
  if (!input || input.length < 3) {
    return Promise.resolve([]);
  }

  return fetch(`${CONSTANTS.apiURL}/search?query=${input}`)
    .then(res => res.json())
    .then(json => json.results)
    .catch(error => {
      console.error(error);

      throw new Error('Search error happened. Try again later');
    });
};
