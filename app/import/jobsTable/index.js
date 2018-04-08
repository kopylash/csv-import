'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import {withStyles} from 'material-ui/styles';
import Table, {TableBody, TableCell, TableHead, TableRow} from 'material-ui/Table';

import JobDescription from './jobDescription';

const JobsTable = (props) => {
  return (
    <Table className={props.classes.table}>
      <TableHead>
        <TableRow>
          <TableCell>File</TableCell>
          <TableCell>Status</TableCell>
          <TableCell numeric>Progress</TableCell>
          <TableCell numeric>Errors</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {props.jobs.map(j => (
          <JobDescription
            key={j.id}
            name={j.file.name}
            status={j.status}
            progress={j.progress}
            errors={j.errors}
          />
        ))}
      </TableBody>
    </Table>
  );
};

JobsTable.propTypes = {
  jobs: PropTypes.array.isRequired,
  classes: PropTypes.object.isRequired
};

const styles = (theme) => ({
  table: {
    minWidth: 500,
    marginTop: theme.spacing.unit * 2,
    overflowX: 'auto'
  },
});

export default withStyles(styles)(JobsTable);
