'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import CONSTANTS from '../constants';

class ImportForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      uploading: false
    };

    this.form = React.createRef();
    this.uploadField = React.createRef();

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  resetForm() {
    this.setState({
      uploading: false
    });
    this.form.current.reset();
  }

  handleSubmit(event) {
    event.preventDefault();

    const file = this.uploadField.current.files[0];

    if (!file) {
      return;
    }

    this.setState({
      uploading: true
    });

    const form = new FormData();
    form.append('import', file);

    const xhr = new XMLHttpRequest();
    xhr.open('post', `${CONSTANTS.apiURL}/import`, true);

    xhr.onerror = (error) => {
      console.error(error);

      this.resetForm();
      alert('File uploading error. Try again.');
    };

    xhr.onload = () => {
      this.resetForm();
      this.props.onImport();
    };

    xhr.send(form);
  }

  render() {
    return (
      <form id="importForm" encType="multipart/form-data" method="post" onSubmit={this.handleSubmit} ref={this.form}>
        <input id="uploadField" type="file" name="import" accept=".csv" ref={this.uploadField}/>
        <input id="uploadButton" type="submit" value="Upload" disabled={this.state.uploading}/>
      </form>
    );
  }
}

ImportForm.propTypes = {
  onImport: PropTypes.func.isRequired
};

export default ImportForm;
