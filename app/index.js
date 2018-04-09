'use strict';

import React from 'react';
import ReactDOM from 'react-dom';

import ImportSection from './import';
import SearchSection from './search';

const App = () => (
  <React.Fragment>
    <ImportSection/>
    <SearchSection/>
  </React.Fragment>
);

ReactDOM.render(<App/>, document.getElementById('content'));
