'use strict';

import React from 'react';
import Autosuggest from 'react-autosuggest';
import './autosuggest.css';

const getSuggestionValue = (suggestion) => {
  return suggestion.name;
};

class SearchSection extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      value: '',
      suggestions: []
    };

    this.onChange = this.onChange.bind(this);
    this.onSuggestionsFetchRequested = this.onSuggestionsFetchRequested.bind(this);
    this.onSuggestionsClearRequested = this.onSuggestionsClearRequested.bind(this);
    this.renderSuggestion = this.renderSuggestion.bind(this);
  }

  onChange(event, {newValue}) {
    this.setState({
      value: newValue
    });
  }

  searchContacts(input) {
    if (!input || input.length < 3) {
      return Promise.resolve([]);
    }

    return fetch(`http://localhost:8080/search?query=${input}`)
      .then(res => res.json())
      .catch(error => []);
  }

  onSuggestionsFetchRequested({value}) {
    this.searchContacts(value).then(suggestions => {
      this.setState({
        suggestions
      });
    });
  }

  onSuggestionsClearRequested() {
    this.setState({
      suggestions: []
    });
  }

  renderSuggestion(suggestion) {
    return (
      <span id={`result-${this.state.suggestions.indexOf(suggestion) + 1}`}>{suggestion.name}</span>
    );
  }

  render() {
    const inputProps = {
      placeholder: 'Type to search',
      value: this.state.value,
      onChange: this.onChange,
      id: 'searchField'
    };

    return (
      <div>
        <Autosuggest
          suggestions={this.state.suggestions}
          onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
          onSuggestionsClearRequested={this.onSuggestionsClearRequested}
          getSuggestionValue={getSuggestionValue}
          renderSuggestion={this.renderSuggestion}
          inputProps={inputProps}/>
      </div>
    );
  }
}

export default SearchSection;
