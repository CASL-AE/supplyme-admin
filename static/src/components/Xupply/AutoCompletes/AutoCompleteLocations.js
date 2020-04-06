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
import IconButton from '@material-ui/core/IconButton';
import HomeIcon from '@material-ui/icons/Home';

import { fetchLocations } from '../../../services/location/actions';
import { validateString } from '../../../utils/misc';

function renderInputComponent(inputProps) {
    const {
        classes, inputRef = () => { }, ref, ...other
    } = inputProps;

    return (
        <TextField
            fullWidth
            InputProps={{
                inputRef: (node) => {
                    ref(node);
                    inputRef(node);
                },
                classes: {
                    input: classes.input,
                },
            }}
            {...other}
        />
    );
}

function renderSuggestion(suggestion, { query, isHighlighted }) {
    const matches = match(`${suggestion.name}`, query);
    const parts = parse(`${suggestion.name}`, matches);

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
    const inputValue = deburr(value.trim()).toLowerCase();
    const inputLength = inputValue.length;
    let count = 0;

    return inputLength === 0
        ? []
        : suggestions.filter((suggestion) => {
            const keep =
                count < 5 && `${suggestion.name}`.slice(0, inputLength).toLowerCase() === inputValue;

            if (keep) {
                count += 1;
            }
            return keep;
        });
}

function getSuggestionValue(suggestion) {
    return `${suggestion.name}`;
}

const styles = theme => ({
    container: {
        position: 'relative',
        width: '100%',
    },
    suggestionsContainerOpen: {
        position: 'absolute',
        zIndex: 99999,
        marginTop: theme.spacing(1),
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
        height: theme.spacing(2),
    },
    iconButton: {
        color: '#999999',
    },
});

function mapStateToProps(state) {
    return {
        employeeID: state.app.employeeID,
        accountID: state.app.accountID,
        locations: state.locationData.locations,
        receivedAt: state.locationData.receivedAt,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: {
            fetchLocations: bindActionCreators(fetchLocations, dispatch),
        },
    };
}

@connect(mapStateToProps, mapDispatchToProps)
class AutoCompleteLocations extends React.Component {
    state = {
        name: '',
        suggestions: [],
    };

    componentDidMount() {
        this.handleSuggestionsFetchRequested();
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.receivedAt && !this.props.receivedAt) {
            this.handleSuggestionsFetchRequested();
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (nextState === this.state) {
            return false;
        }
        return true;
    }

    handleSuggestionsFetchRequested = (event) => {
        this.setState({
            suggestions: getSuggestions(this.props.locations, this.state.name),
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
        const next_state = {};
        next_state.name = response.suggestionValue;
        this.setState(next_state, () => { });
        this.props.onFinishedSelecting(data);
    };

    handleChange = (event, { newValue, method }) => {
        console.log('Handle Change');
        console.log(method);
        const { actions, employeeID, accountID } = this.props;
        if (method !== 'click') {
            const next_state = {};
            next_state.name = newValue;
            this.setState(next_state, () => { });
            if (this.timeout) clearTimeout(this.timeout);
            this.timeout = setTimeout(() => {
                console.log(`Location: ${newValue}`);
                this.handleSuggestionsFetchRequested();
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
            <div>
                <Autosuggest
                    autoComplete=""
                    {...autosuggestProps}
                    inputProps={{
                        classes,
                        placeholder: 'Search Locations',
                        label: 'Location Name',
                        value: this.state.name,
                        onChange: this.handleChange,
                        onKeyPress: this.onSuggestionSelected,
                        variant: 'outlined',
                        margin: 'dense',
                        onFocus: this.handleFocus,
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
            </div>
        );
    }
}

AutoCompleteLocations.defaultProps = {
    employeeID: '',
    accountID: '',
    locations: [],
    searchLocations: f => f,
};
AutoCompleteLocations.propTypes = {
    employeeID: PropTypes.string,
    accountID: PropTypes.string,
    locations: PropTypes.array,
    searchLocations: PropTypes.func,
    name: PropTypes.string.isRequired,
    onFinishedSelecting: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(AutoCompleteLocations);
