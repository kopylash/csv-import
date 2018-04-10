'use strict';

import React from 'react';
import Autosuggest from 'react-autosuggest';
import './autosuggest.css';

import ContactCard from './contactCard';
import {searchContacts} from './actions';

const getSuggestionValue = (suggestion) => {
  return suggestion.name;
};

class SearchSection extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      value: '',
      suggestions: [],
      selected: null
    };

    this.onChange = this.onChange.bind(this);
    this.onSuggestionsFetchRequested = this.onSuggestionsFetchRequested.bind(this);
    this.onSuggestionsClearRequested = this.onSuggestionsClearRequested.bind(this);
    this.onSuggestionSelected = this.onSuggestionSelected.bind(this);
    this.renderSuggestion = this.renderSuggestion.bind(this);
  }

  onChange(event, {newValue}) {
    this.setState({
      value: newValue
    });
  }

  onSuggestionsFetchRequested({value}) {
    searchContacts(value).then(suggestions => {
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

  onSuggestionSelected(event, {suggestion}) {
    this.setState({
      selected: suggestion
    });
  }

  renderSuggestion(suggestion) {
    return (
      <span id={`result-${this.state.suggestions.indexOf(suggestion) + 1}`}>{suggestion.name}</span>
    );
  }

  render() {
    const inputProps = {
      placeholder: 'Type 3 letters to search',
      value: this.state.value,
      onChange: this.onChange,
      id: 'searchField'
    };

    return (
      <div className="autosuggest__wrapper">
        <Autosuggest
          suggestions={this.state.suggestions}
          onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
          onSuggestionsClearRequested={this.onSuggestionsClearRequested}
          onSuggestionSelected={this.onSuggestionSelected}
          getSuggestionValue={getSuggestionValue}
          renderSuggestion={this.renderSuggestion}
          inputProps={inputProps}
        />
        {this.state.selected && <ContactCard {...this.state.selected}/>}
      </div>
    );
  }
}

export default SearchSection;
