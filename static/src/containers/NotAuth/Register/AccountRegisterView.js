/* eslint camelcase: 0, no-underscore-dangle: 0, react/jsx-indent-props: 0, max-len: 0, react/forbid-prop-types: 0 */
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import LinearProgress from '@material-ui/core/LinearProgress';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

import { registerAccount } from '../../../services/accountRegistration/actions';
import { toNewAccountCode } from '../../../services/account/model';
import {
  validateVarChar,
  validateEmail,
  dispatchNewRoute,
  getRegistrationSearch
} from '../../../utils/misc';

function renderAccountType() {
    const array = [];
    array.push(<MenuItem key={'retailer'} value={'retailer'}>Retailer</MenuItem>);
    array.push(<MenuItem key={'manufacturer'} value={'manufacturer'}>Manufacturer</MenuItem>);
    array.push(<MenuItem key={'financier'} value={'financier'}>Financier</MenuItem>);
    return array;
}

const styles = theme => ({
    root: {
        flex: 1,
        height: '100vh',
        backgroundColor: theme.palette.primary.background,
    },
    content: {
        paddingTop: 42,
        paddingBottom: 42,
        paddingLeft: 80,
        paddingRight: 80,
    },
    leftContent: {
        paddingTop: 60,
        float: 'left',
        width: '44%',
    },
    registerHeader: {
        // lineHeight: '40px',
        fontSize: 60,
    },
    registerSubHeader: {
        lineHeight: '30px',
        fontSize: 20,
    },
    rightContent: {
        float: 'right',
        width: '44%',
    },
    gridItem: {
      marginLeft: '3%',
      marginRight: '3%',
    },
    gridItemBox: {
      backgroundColor: theme.palette.primary.background,
      borderRadius: '1rem',
      boxShadow: '0 0.5rem 4rem 0.5rem rgba(0,0,0,0.08)',
    },
    gridItemBoxInner: {
      padding: '1.5rem',
    },
    text: {
        marginBottom: 14,
    },
    textField: {
        fontSize: 14,
    },
    registerButtonBox: {
        marginBottom: 20,
    },
    registerButton: {
        textAlign: 'center',
        width: '100%',
        color: '#fff',
        backgroundColor: theme.palette.primary.main,
        textTransform: 'none',
        height: 45,
        fontSize: 14,
    },
    link: {
        cursor: 'pointer',
        color: '#1524D9',
    },
    loader: {
        color: theme.palette.primary.main,
        backgroundColor: theme.palette.primary.secondary,
    },
});

function mapStateToProps(state) {
    return {
        search: state.router.location.search,
        idToken: state.app.idToken,
        accountID: state.app.accountID,
        accountCode: state.accountData.accountCode,
        isRegistered: state.app.isRegistered,
        isRegistering: state.app.isRegistering,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: {
            registerAccount: bindActionCreators(registerAccount, dispatch),
        },
    };
}

@connect(mapStateToProps, mapDispatchToProps)
class RegisterView extends Component {

    constructor(props) {
        super(props);
        this.state = {
            activationCode: toNewAccountCode(),
            accountCode: toNewAccountCode(),
            ownerName_error_text: null,
            accountName_error_text: null,
            activationCode_error_text: null,
            ownerEmail_error_text: null,
            password: '',
            password_error_text: null,
            forgotEmail: null,
            forgotEmail_error_text: null,
            redirectRoute: '/',
            loading: false,
        };
    }

    componentDidMount() {
        const { search } = this.props;
        const keys = getRegistrationSearch(search);
        const next_state = this.state;
        next_state.activationCode.activationCode = keys.code;
        this.setState(next_state, () => {});
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.accountCode.isLoaded && !this.props.accountCode.isLoaded) {
            this.setState({
                activationCode: nextProps.accountCode,
                stepIndex: 1,
            });
        }
        if (!nextProps.isRegistered && this.props.isRegistering) {
            this.setState({
                loading: false,
            });
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (nextState === this.state) {
            return false;
        }
        return true;
    }

    isDisabled = (e) => {
        e.preventDefault();
        let ownerName_is_valid = false;
        let email_is_valid = false;
        let password_is_valid = false;
        let activationCode_is_valid = false;

        if (this.state.activationCode.ownerName === null || this.state.activationCode.ownerName === '') {
            this.setState({
                ownerName_error_text: null,
            });
        } else if (validateVarChar(this.state.activationCode.ownerName)) {
            ownerName_is_valid = true;
            this.setState({
                ownerName_error_text: null,
            });

        } else {
            this.setState({
                ownerName_error_text: 'Sorry, this is not a valid name',
            });
        }

        if (this.state.activationCode.email === null) {
            this.setState({
                ownerEmail_error_text: null,
            });
        } else if (validateEmail(this.state.activationCode.email)) {
            email_is_valid = true;
            this.setState({
                ownerEmail_error_text: null,
            });
        } else {
            this.setState({
                ownerEmail_error_text: 'Sorry, this is not a valid email',
            });
        }

        // Is '' because state comes from class, not inheireted object
        if (this.state.password === '') {
            this.setState({
                password_error_text: null,
            });
        } else if (this.state.password.length >= 6) {
            password_is_valid = true;
            this.setState({
                password_error_text: null,
            });
        } else {
            this.setState({
                password_error_text: 'Your password must be at least 6 characters',
            });
        }

        if (this.state.activationCode.activationCode === null) {
            this.setState({
                activationCode_error_text: null,
            });
        } else if (this.state.activationCode.activationCode.length <= 20) {
            activationCode_is_valid = true;
            this.setState({
                activationCode_error_text: null,
            });
        } else {
            this.setState({
                activationCode_error_text: 'Your code must be less than 20 characters',
            });
        }

        console.log(ownerName_is_valid)
        console.log(email_is_valid)

        if (
          ownerName_is_valid &&
          email_is_valid &&
          password_is_valid &&
          activationCode_is_valid
        ) {
            this.createNewAccount();
        }
    }

    changeValue(e, parent, name) {
        const value = e.target.value;
        const next_state = this.state;
        if (parent) {
            next_state[parent][name] = value;
        } else {
            next_state[name] = value;
        }
        this.setState(next_state, () => {});
    }

    _handleKeyPress(e) {
        if (e.key === 'Enter') {
            if (!this.state.disabled) {
                this.createNewAccount(e);
            }
        }
    }

    createNewAccount() {
        const { actions, idToken, accountID }= this.props;
        const { activationCode, password, redirectRoute }= this.state;
        this.setState({
            loading: true,
        });
        actions.registerAccount(
            activationCode,
            password,
            redirectRoute,
        );
    }

    copyCodeToClipboard = () => {
        console.log('here')
        const textField = document.createElement('textarea');
        textField.innerText = 'rw2ciyaNshpHe7bCHo4bRWq6pqqynnWKQg';
        document.body.appendChild(textField);
        textField.select();
        document.execCommand('copy');
        textField.remove();
    }

    render() {
        const { classes } = this.props;
        const {
          activationCode,
          ownerName_error_text,
          ownerEmail_error_text,
          activationCode_error_text,
          password_error_text,
          loading,
        } = this.state;

        const accountTypes = renderAccountType();

        console.log(activationCode);
        console.log(ownerName_error_text);
        console.log(ownerEmail_error_text);
        console.log(activationCode_error_text);
        console.log(password_error_text);

        const RightContent = (
          <div className={classes.rightContent}>
              <div className={classes.gridItem}>
                  <div className={classes.gridItemBox}>
                      <div className={classes.gridItemBoxInner}>
                          <h2 style={{lineHeight: '24px', fontWeight: 400, fontSize: 30, textAlign: 'center', paddingBottom: 15}}>{'Register a new Account'}</h2>
                          <div style={{margin: 10}}>
                          {
                              loading ?
                              (<LinearProgress className={classes.loader} />)
                              : null
                          }
                          </div>
                          <div className={classes.text}>
                              <TextField
                                  placeholder="Manager Name"
                                  label="Manager Name"
                                  type="text"
                                  fullWidth
                                  variant="outlined"
                                  autoComplete=""
                                  className={classes.textField}
                                  value={activationCode.ownerName || ''}
                                  helpertext={ownerName_error_text}
                                  onChange={e => this.changeValue(e, 'activationCode', 'ownerName')}
                              />
                          </div>
                          <div className={classes.text}>
                              <TextField
                                  placeholder="Ex. example@test.com"
                                  label="Manager Email"
                                  type="email"
                                  fullWidth
                                  variant="outlined"
                                  value={activationCode.email || ''}
                                  autoComplete="email"
                                  className={classes.textField}
                                  helpertext={ownerEmail_error_text}
                                  onChange={e => this.changeValue(e, 'activationCode', 'email')}
                              />
                          </div>
                          <div style={{paddingBottom: 20}} className={classes.textCell}>
                              <Select
                                  fullWidth
                                  onChange={e => this.changeValue(e, 'activationCode', 'accountType')}
                                  value={activationCode.accountType}
                                  variant="outlined"
                                  inputProps={{
                                      name: 'accountType',
                                      id: 'accountType',
                                  }}
                              >
                                  {accountTypes}
                              </Select>
                          </div>
                          <span style={{fontWeight: 600, paddingTop: 20}}>How was the drive from Instambul?</span>
                          <div style={{paddingTop: 10}} className={classes.text}>
                              <TextField
                                  placeholder="Ex. PxrP2LtHJoO87RAW87HX"
                                  label="Countersign"
                                  type="text"
                                  fullWidth
                                  value={activationCode.activationCode || ''}
                                  variant="outlined"
                                  className={classes.textField}
                                  helpertext={activationCode_error_text}
                                  onChange={e => this.changeValue(e, 'activationCode', 'activationCode')}
                              />
                          </div>
                          <div style={{paddingTop: 20}} className={classes.text}>
                              <TextField
                                  placeholder="Password"
                                  label="Password"
                                  type="password"
                                  fullWidth
                                  value={this.state.password}
                                  variant="outlined"
                                  autoComplete="current-password"
                                  className={classes.textField}
                                  helpertext={password_error_text}
                                  onChange={e => this.changeValue(e, null, 'password')}
                              />
                          </div>
                          <div style={{marginBottom: 35}}/>
                          <div className={classes.registerButtonBox}>
                              <Button
                                  disableRipple
                                  disableFocusRipple
                                  onClick={e => this.isDisabled(e)}
                                  className={classes.registerButton}
                                  variant="outlined"
                              >
                                  {'Register Account'}
                              </Button>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
        );

        const AccountRegister = (
            <div className={classes.content}>
                <div className={classes.leftContent}>
                    <div className={classes.gridItem}>
                        <div className={classes.registerHeader}>
                            Xupply
                        </div>
                        <p className={classes.registerSubHeader}>Please fill out the following information to register a new account in Xupply.</p>
                        <p className={classes.registerSubHeader}>If you would like to donate, please send <span style={{fontWeight: 600}}>XRP</span> to <div onClick={(e) => this.copyCodeToClipboard(e)} style={{cursor: 'pointer', fontWeight: 600}}>rw2ciyaNshpHe7bCHo4bRWq6pqqynnWKQg</div></p>
                    </div>
                </div>
                {RightContent}
            </div>
        );
        return (
            <div className={classes.root}>
                <div style={{paddingTop: 66}} onKeyPress={e => this._handleKeyPress(e)}>
                {AccountRegister}
                </div>
            </div>
        );
    }
}

RegisterView.defaultProps = {
    search: '',
    registerAccount: f => f,
};

RegisterView.propTypes = {
    search: PropTypes.string,
    registerAccount: PropTypes.func,
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(RegisterView);
