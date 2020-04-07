import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import deburr from 'lodash/deburr';
import Autosuggest from 'react-autosuggest';
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';

import { searchGoogleHospitals } from '../../../services/google/actions';

function renderInputComponent(inputProps) {
    const {
        classes, inputRef = () => {}, ref, ...other
    } = inputProps;

    return (
        <TextField
          fullWidth
          InputProps={{
                inputRef: (node) => {
                    ref(node);
                    inputRef(node);
                },
            }}
          {...other}
        />
    );
}

function renderSuggestion(suggestion, { query, isHighlighted }) {
    const matches = match(suggestion.description, query);
    const parts = parse(suggestion.description, matches);

    return (
        <MenuItem selected={isHighlighted} component="div">
            <div>
                {parts.map((part, index) => (part.highlight ? (
                    <span key={String(index)} style={{ fontWeight: 500 }}>
                        {part.text}
                    </span>
                ) : (
                    <strong key={String(index)} style={{ fontWeight: 300 }}>
                        {part.text}
                    </strong>
                )))}
            </div>
        </MenuItem>
    );
}

function getSuggestions(suggestions, value) {
    // return suggestions;
    const inputValue = value.toLowerCase();
    const inputLength = inputValue.length;
    let count = 0;

    return inputLength === 0
        ? []
        : suggestions.filter((suggestion) => {
            const keep = count < 5 && suggestion.description.slice(0, inputLength).toLowerCase() === inputValue;
            if (keep) {
                count += 1;
            }
            return keep;
        });
}

function getSuggestionValue(suggestion) {
    return suggestion.description;
}

const styles = theme => ({
    textFieldLarge: {},
    container: {
        position: 'relative',
        overflow: 'visable',
    },
    suggestionsContainerOpen: {
        position: 'absolute',
        zIndex: 999,
        marginTop: theme.spacing.unit,
        left: 0,
        right: 0,
        maxHeight: 250,
        overflow: 'visable',
    },
    suggestion: {
        display: 'block',
    },
    suggestionsList: {
        margin: 0,
        padding: 0,
        listStyleType: 'none',
    },
    divider: {
        height: theme.spacing.unit * 2,
    },
});

function mapStateToProps(state) {
    return {
        places: state.googleData.google.placeData,
        isPlacesLoaded: state.googleData.google.isPlacesLoaded,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: {
            searchGoogleHospitals: bindActionCreators(searchGoogleHospitals, dispatch),
        },
    };
}

@connect(mapStateToProps, mapDispatchToProps)
class AutoCompleteHospitals extends React.Component {
  state = {
      place: '',
      suggestions: [],
  };

  componentDidMount() {
      const { receivedAt } = this.props;
      console.log('here')
      if (receivedAt) {
          console.log('here')
          this.handleSuggestionsFetchRequest();
      }
  }

  componentWillReceiveProps(nextProps) {
      console.log('componentWillReceiveProps')
      if (nextProps.isPlacesLoaded && !this.props.isPlacesLoaded) {
          console.log('receivedAt')
          this.handleSuggestionsFetchRequest(nextProps);
      }
      // if (nextProps.place && !this.props.description) {
      //     this.setState({
      //         place: nextProps.place,
      //     });
      // }
  }

  shouldComponentUpdate(nextProps, nextState) {
      if (nextState === this.state) {
          return false;
      }
      return true;
  }

  handleSuggestionsFetchRequest(props = this.props) {
      this.setState({
          suggestions: getSuggestions(props.places, this.state.place),
      });
  };

  handleSuggestionsFetchRequested = (event) => {
      this.setState({
          suggestions: getSuggestions(this.props.places, this.state.place),
      });
  };

  handleSuggestionsClearRequested = () => {
      this.setState({
          suggestions: [],
      });
  };

  handleSuggestionsSelectRequested = (event, response) => {
      console.log('Handle Selected');
      const data = response.suggestion;
      console.warn(response.suggestion);
      const next_state = {};
      next_state.place = data.description;
      this.setState(next_state, () => {});
      this.props.onFinishedSelecting(data);
  };

  handleChange = (event, { newValue, method }) => {
    console.log('Handle Change');
      console.log(method);
      const { actions } = this.props;
      if (method !== 'click') {
          const next_state = {};
          next_state.place = newValue;
          this.setState(next_state, () => {});
          if (this.timeout) clearTimeout(this.timeout);
          this.timeout = setTimeout(() => {
              console.log(`Account: ${newValue}`);
              const newCapQuery = newValue.charAt(0).toUpperCase() + newValue.slice(1);
              actions.searchGoogleHospitals(newCapQuery);
          }, 300);
      }
  };

  handleFocus = (e) => {
      e.preventDefault();
      const { target } = e;
      const extensionStarts = target.value.lastIndexOf('.');
      target.focus();
      target.setSelectionRange(0, extensionStarts);
  };

  render() {
      const { classes } = this.props;

      const autosuggestProps = {
          renderInputComponent,
          suggestions: this.state.suggestions,
          onSuggestionsFetchRequested: this.handleSuggestionsFetchRequested,
          onSuggestionsClearRequested: this.handleSuggestionsClearRequested,
          onSuggestionSelected: this.handleSuggestionsSelectRequested,
          getSuggestionValue,
          renderSuggestion,
      };

      return (
        <Autosuggest
          {...autosuggestProps}
          inputProps={{
                className: classes.textFieldLarge,
                label: 'Search Google Places',
                placeholder: 'Search Google Places',
                margin: 'dense',
                value: this.state.place,
                onChange: this.handleChange,
                onFocus: this.handleFocus,
                variant: 'outlined',
            }}
          theme={{
                container: classes.container,
                suggestionsContainerOpen: classes.suggestionsContainerOpen,
                suggestionsList: classes.suggestionsList,
                suggestion: classes.suggestion,
            }}
          renderSuggestionsContainer={options => (
                <Paper {...options.containerProps} square>
                  {options.children}
              </Paper>
            )}
        />
      );
  }
}

AutoCompleteHospitals.defaultProps = {
    employeeID: '',
    accountID: '',
    places: [],
    searchGoogleHospitals: f => f,
};
AutoCompleteHospitals.propTypes = {
    employeeID: PropTypes.string,
    accountID: PropTypes.string,
    places: PropTypes.array,
    searchGoogleHospitals: PropTypes.func,
    place: PropTypes.string.isRequired,
    onFinishedSelecting: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(AutoCompleteHospitals);
