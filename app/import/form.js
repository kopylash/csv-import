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

  handleSubmit(event) {
    event.preventDefault();

    this.setState({
      uploading: true
    });

    const form = new FormData();
    const file = this.uploadField.current.files[0];
    form.append('import', file);

    const xhr = new XMLHttpRequest();
    xhr.open('post', `${CONSTANTS.apiURL}/import`, true);

    // xhr.upload.onprogress = function(event) {
    //   if (event.lengthComputable) {
    //     console.info(((event.loaded / event.total) * 100).toFixed(1));
    //   }
    // };

    xhr.onerror = (error) => {
      console.error(error);
    };

    xhr.onload = () => {
      this.setState({
        uploading: false
      });
      this.props.onImport();
      this.form.current.reset();
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
