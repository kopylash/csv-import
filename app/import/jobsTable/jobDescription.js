'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import {TableCell, TableRow} from 'material-ui/Table';
import {CircularProgress} from 'material-ui/Progress';
import CONSTANTS from '../../constants';
import ErrorCounter from './errorCounter';

const JobDescription = (props) => {
  return (
    <TableRow>
      <TableCell>{props.name}</TableCell>
      <TableCell>
        {props.status === CONSTANTS.jobStatus.PENDING || props.status === CONSTANTS.jobStatus.IN_PROGRESS
          ? <CircularProgress size={20}/>
          : props.status}
      </TableCell>
      <TableCell numeric>{props.progress}</TableCell>
      <TableCell numeric>
        <ErrorCounter errors={props.errors}/>
      </TableCell>
    </TableRow>
  );
};

JobDescription.propTypes = {
  name: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  progress: PropTypes.number.isRequired,
  errors: PropTypes.arrayOf(PropTypes.string).isRequired
};

export default JobDescription;
