'use strict';

import React from 'react';
import CONSTANTS from '../constants';

import ImportForm from './form';
import JobsTable from './jobsTable';
import {checkJobsStatus} from './actions';

class ImportSection extends React.Component {
  constructor(props) {
    super(props);

    this.jobCheckTimer = null;

    this.state = {
      jobs: []
    };

    this.checkJobsStatus = this.checkJobsStatus.bind(this);
  }

  componentDidMount() {
    this.checkJobsStatus();

    this.jobCheckTimer = setInterval(this.checkJobsStatus, CONSTANTS.jobsCheckingInterval);
  }

  componentWillUnmount() {
    clearInterval(this.jobCheckTimer);
  }

  checkJobsStatus() {
    checkJobsStatus().then(jobs => {
      this.setState({jobs});
    });
  }

  render() {
    return (
      <div style={styles.wrapper}>
        <ImportForm onImport={this.checkJobsStatus}/>
        <JobsTable jobs={this.state.jobs}/>
      </div>
    );
  }
}

export default ImportSection;

const styles = {
  wrapper: {
    width: 960,
    margin: '0 auto'
  }
};
