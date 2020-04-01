import React from 'react';
import MaskedInput from 'react-text-mask';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  input: {
    margin: theme.spacing.unit,
  },
  helperText: {
      fontSize: 12,
      color: '#d22323',
  },
  textField: {
      width: 250,
  },
});

const TextMaskCustom = (props) => {
  const { inputRef, ...other } = props;

  return (
    <MaskedInput
      {...other}
      ref={inputRef}
      mask={['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
      placeholderChar={'\u2000'}
      showMask
    />
  );
}

TextMaskCustom.propTypes = {
  inputRef: PropTypes.func.isRequired,
};

class PhoneTextInput extends React.Component {
  state = {
      textmask: '(   )    -    ',
  };

  componentDidMount() {
      const { phoneNumber } = this.props;
      if (phoneNumber) {
          this.setState({
              textmask: phoneNumber,
          });
      }
  }

  componentWillReceiveProps(receiveProps) {
      const { phoneNumber } = receiveProps;
      if (phoneNumber) {
          this.setState({
              textmask: phoneNumber,
          });
      }
  }

  handleChange = () => event => {
    console.log(event)
    const { handleChange } = this.props;
    handleChange(event, 'phoneNumber')
    this.setState({
      textmask: event.target.value,
    });
  };

  handleFocus = (e) => {
      e.preventDefault();
      const { target } = e;
      const extensionStarts = target.value.lastIndexOf('.');
      target.focus();
      target.setSelectionRange(0, extensionStarts);
  }

  render() {
    const { classes, error_text } = this.props;
    const { textmask } = this.state;
    console.error('TEXT MASK: ' + textmask)
    return (
      <div className={classes.container}>
        <TextField
          placeholder="Ex. +1(949) 545-2522"
          margin="dense"
          variant="outlined"
          helperText={error_text}
          className={classes.textField}
          FormHelperTextProps={{ classes: { root: classes.helperText } }}
          autoComplete="tel"
          InputProps={{
            inputComponent: TextMaskCustom,
            value: textmask,
            onChange: this.handleChange(),
            onFocus: this.handleFocus,
          }}
        />
      </div>
    );
  }
}

PhoneTextInput.propTypes = {
  handleChange: PropTypes.func.isRequired,
  phoneNumber: PropTypes.string.isRequired,
  error_text: PropTypes.string.isRequired,
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(PhoneTextInput);
