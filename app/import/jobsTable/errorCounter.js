'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import IconButton from 'material-ui/IconButton';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';

const ErrorCounter = (props) => {
  return props.errors.length ? (
    <React.Fragment>
      <IconButton aria-label="Errors" onClick={() => alert(props.errors)}>
        <ErrorOutlineIcon/>
      </IconButton>
      {props.errors.length}
    </React.Fragment>
  ) : 0;
};

ErrorCounter.propTypes = {
  errors: PropTypes.arrayOf(PropTypes.string).isRequired
};

export default ErrorCounter;
