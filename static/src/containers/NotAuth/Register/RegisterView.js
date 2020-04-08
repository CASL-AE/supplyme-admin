/* eslint camelcase: 0, no-underscore-dangle: 0, react/jsx-indent-props: 0, max-len: 0, react/forbid-prop-types: 0 */
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import LinearProgress from '@material-ui/core/LinearProgress';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Divider from '@material-ui/core/Divider';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import CircularProgress from '@material-ui/core/CircularProgress';

import AutoCompletePlaces from '../../../components/Xupply/AutoCompletes/AutoCompletePlaces';

import { registerAccount } from '../../../services/accountRegistration/actions';
import { registerEmployee } from '../../../services/employeeRegistration/actions';
import { toNewLocation } from '../../../services/location/model';
import { geocodeGooglePlace } from '../../../services/google/actions';
import { isMobileAndTablet } from '../../../utils/isMobileAndTablet';
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
        flexGrow: 1,
        background: 'linear-gradient(to right, #000000 0%, #79bac1 100%, #79bac1 100%, #79bac1 100%)',
        overflow: 'scroll',
    },
    appFrame: {
        zIndex: 1,
        height: '100vh',
        overflow: 'hidden',
        position: 'relative',
        display: 'flex',
        width: '100%',
    },
    content: {
        padding: isMobileAndTablet() ? 0 : theme.spacing(2),
        backgroundColor: theme.palette.primary.background,
        borderRadius: 8,
    },
    gridItemBoxInner: {
        padding: 30,
    },
    text: {
        marginBottom: 14,
    },
    textField: {
        width: 300,
        marginTop: 10,
    },
    registerButtonBox: {
        marginBottom: 20,
    },
    accountTypeButton: {
        color: '#fff',
        backgroundColor: theme.palette.primary.main,
        textTransform: 'none',
        fontSize: 14,
    },
    registerButton: {
        color: '#fff',
        backgroundColor: theme.palette.primary.main,
        textTransform: 'none',
        fontSize: 14,
        width: 300,
        marginTop: 10,
    },
    link: {
        cursor: 'pointer',
        color: '#1524D9',
    },
    loader: {
        color: theme.palette.primary.main,
        backgroundColor: theme.palette.primary.secondary,
    },
    divider: {
        display: 'flex',
        color: '#5c5c5c',
        fontSize: 15,
    },
    dividerLine: {
        margin: 'auto',
        content: "",
        borderTop: '10px solid #000000',
        // flex: 1,
        width: 40,
        transform: 'translateY(50%)',
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
            registerEmployee: bindActionCreators(registerEmployee, dispatch),
        },
    };
}

@connect(mapStateToProps, mapDispatchToProps)
class RegisterView extends Component {

    constructor(props) {
        super(props);
        this.state = {
            stepIndex: 0,
            loading: false,
            redirectRoute: '/',

            // Signup
            accountType: '',
            email: '',
            email_error_text: null,
            password: '',
            password_error_text: null,
            showEmail: false,
            disabled: true,

            // Employee
            activationCode: '',

            // Contact Info
            firstName: 'Denis',
            lastName: 'Angell',
            firstName_error_text: null,
            lastName_error_text: null,
            location: toNewLocation(),
            locationName_error_text: null,
            street1_error_text: null,
            locality_error_text: null,
            region_error_text: null,
            postalCode_error_text: null,
            locationDisabled: true,
            sugestedGeocode: {},
            invalidGeocode: false,
        };
    }

    componentDidMount() {
        const { actions, search } = this.props;
        const keys = getRegistrationSearch(search)
        if (keys.type === 'employee' && keys.code !== null) {
            this.setState({stepIndex: 2, activationCode: keys.code});
        }
    }

    componentWillReceiveProps(nextProps) {}

    shouldComponentUpdate(nextProps, nextState) {
        if (nextState === this.state) {
            return false;
        }
        return true;
    }

    _handleKeyPress(e) {
        if (e.key === 'Enter') {
            if (!this.state.disabled) {
                this.createNewAccount(e);
            }
        }
    }

    toggleAccountType(e, value) {
        const next_state = this.state;
        next_state.accountType = value;
        next_state.stepIndex = 1;
        if (value === null) {
            next_state.stepIndex = 0;
        }
        this.setState(next_state, () => {});
    }

    handleContactChange(e, name) {
        const value = e.target.value;
        const next_state = this.state;
        next_state[name] = value;
        this.setState(next_state, () => {
              this.isLocationDisabled();
        });
    }

    handleLocationChange(e, parent, name) {
        const value = e.target.value;
        const next_state = this.state;
        if (parent !== null) {
            next_state.location[parent][name] = value;
        } else {
            next_state.location[name] = value;
        }
        this.setState(next_state, () => {
              this.isLocationDisabled();
        });
    }

    handleLocationSelected = (location) => {
        const { place_id, description } = location;
        const { main_text } = location.structured_formatting;
        const { idToken, accountID } = this.props;
        const next_state = this.state;
        next_state.location.name = description;
        next_state.location.placeID;
        this.setState(next_state, () => {});
    }

    isLocationDisabled = () => {
        let firstName_is_valid = false;
        let lastName_is_valid = false;
        let placeID_is_valid = false;
        let locationName_is_valid = false;
        let street1_is_valid = false;
        let locality_is_valid = false;
        let region_is_valid = false;
        let postal_is_valid = false;

        var locationDisabled = true;

        if (this.state.firstName === '') {
            this.setState({
                firstName_error_text: null,
            });
        } else if (validateVarChar(this.state.firstName)) {
            firstName_is_valid = true;
            this.setState({
                firstName_error_text: null,
            });
        } else {
            this.setState({
                firstName_error_text: 'Please fill out this field.',
            });
        }

        if (this.state.lastName === '') {
            this.setState({
                lastName_error_text: null,
            });
        } else if (validateVarChar(this.state.lastName)) {
            lastName_is_valid = true;
            this.setState({
                lastName_error_text: null,
            });
        } else {
            this.setState({
                lastName_error_text: 'Please fill out this field.',
            });
        }

        if (this.state.location.name === null) {
            this.setState({
                locationName_error_text: null,
            });
        } else if (validateVarChar(this.state.location.name)) {
            locationName_is_valid = true;
            this.setState({
                locationName_error_text: null,
            });
        } else {
            this.setState({
                locationName_error_text: 'Please fill out this field.',
            });
        }

        if (this.state.location.address.street1 === null) {
            this.setState({
                street1_error_text: null,
            });
        } else if (validateVarChar(this.state.location.address.street1)) {
            street1_is_valid = true;
            this.setState({
                street1_error_text: null,
            });
        } else {
            this.setState({
                street1_error_text: 'Please fill out this field.',
            });
        }

        if (this.state.location.address.locality === null) {
            this.setState({
                locality_error_text: null,
            });
        } else if (validateVarChar(this.state.location.address.locality)) {
            locality_is_valid = true;
            this.setState({
                locality_error_text: null,
            });
        } else {
            this.setState({
                locality_error_text: 'Please fill out this field.',
            });
        }

        if (this.state.location.address.region === null) {
            this.setState({
                region_error_text: null,
            });
        } else if (validateVarChar(this.state.location.address.region)) {
            region_is_valid = true;
            this.setState({
                region_error_text: null,
            });
        } else {
            this.setState({
                region_error_text: 'Please fill out this field.',
            });
        }

        if (this.state.location.address.region === null) {
            this.setState({
                region_error_text: null,
            });
        } else if (validateVarChar(this.state.location.address.region)) {
            region_is_valid = true;
            this.setState({
                region_error_text: null,
            });
        } else {
            this.setState({
                region_error_text: 'Please fill out this field.',
            });
        }

        if (this.state.location.address.postal === null) {
            this.setState({
                postal_error_text: null,
            });
        } else if (validateVarChar(this.state.location.address.postal)) {
            postal_is_valid = true;
            this.setState({
                postal_error_text: null,
            });
        } else {
            this.setState({
                postal_error_text: 'Please fill out this field.',
            });
        }

        if (this.state.location.address.placeID !== null) {
            placeID_is_valid = true;
        }

        console.log(firstName_is_valid)
        console.log(lastName_is_valid)
        console.log(placeID_is_valid)
        console.log(locationName_is_valid)
        console.log(street1_is_valid)
        console.log(locality_is_valid)
        console.log(region_is_valid)
        console.log(postal_is_valid)

        if (
          firstName_is_valid &&
          lastName_is_valid &&
          locationName_is_valid &&
          placeID_is_valid
        ) {
            locationDisabled = false;
        } else if (
          firstName_is_valid &&
          lastName_is_valid &&
          locationName_is_valid &&
          street1_is_valid &&
          locality_is_valid &&
          region_is_valid &&
          postal_is_valid
        ) {
            locationDisabled = false;
        }
        this.setState({locationDisabled: locationDisabled})
    }

    handleLocationFinished = () => {
        const next_state = this.state;
        const { address } = this.state.location;
        const description = address.placeID ? next_state.location.name : `${address.street1} ${address.locality}, ${address.region} ${address.postal}`;
        geocodeGooglePlace(null, null, description).then((result) => {
            if (
              address.street1 !== result.street1 ||
              address.locality !== result.locality ||
              address.region !== result.region ||
              address.postal !== result.postal
            ) {
              this.setState({invalidGeocode: true, sugestedGeocode: result});
              return;
            }
            next_state.location.address = result;
            next_state.stepIndex = next_state.stepIndex + 1;
            this.setState(next_state, () => {});
        })
    };

    setSuggestedGeocode = () => {
        const next_state = this.state;
        next_state.location.address = next_state.sugestedGeocode;
        next_state.invalidGeocode = false;
        next_state.stepIndex = next_state.stepIndex + 1;
        this.setState(next_state, () => {});
    }

    rejectSuggestedGeocode = () => {
        const next_state = this.state;
        next_state.invalidGeocode = false;
        this.setState(next_state, () => {});
    }

    changeValue(e, name) {
        const value = e.target.value;
        const next_state = this.state;
        next_state[name] = value;
        this.setState(next_state, () => {
            this.isSignupDisabled();
        });
    }

    isSignupDisabled = () => {
        let email_is_valid = false;
        let password_is_valid = false;
        let accountType_is_valid = false;

        if (this.state.email === null) {
            this.setState({
                email_error_text: null,
            });
        } else if (validateEmail(this.state.email)) {
            email_is_valid = true;
            this.setState({
                email_error_text: null,
            });
        } else {
            this.setState({
                email_error_text: 'Sorry, this is not a valid email',
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

        if (this.state.accountType !== null) {
            accountType_is_valid = true;
        }

        console.log(email_is_valid)
        console.log(password_is_valid)
        console.log(accountType_is_valid)

        if (
          email_is_valid &&
          password_is_valid &&
          accountType_is_valid
        ) {
            this.setState({disabled: false})
        }
    }

    createNewAccount() {
        const { actions }= this.props;
        const {
          accountType,
          email,
          firstName,
          lastName,
          location,
          password,
          redirectRoute
        } = this.state;

        this.setState({
            loading: true,
            disabled: true,
        });

        actions.registerAccount(
            accountType,
            email,
            firstName,
            lastName,
            location,
            password,
            redirectRoute,
        );
    }

    createNewEmployee = (e) => {
        const { actions }= this.props;
        const {
          activationCode,
          email,
          firstName,
          lastName,
          location,
          password,
          redirectRoute
        } = this.state;

        this.setState({
            loading: true,
            disabled: true,
        });

        actions.registerEmployee(
            activationCode,
            email,
            firstName,
            lastName,
            location,
            password,
            redirectRoute,
        );
    }

    emailSignup = () => {
        this.setState({showEmail: true})
    }

    renderAccountTypeLogo = (accountType) => {
        switch (accountType) {
              case 'retailer':
                  return (
                      <img
                          alt="google_signup"
                          height="100px"
                          width="100px"
                          src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fcdn0.iconfinder.com%2Fdata%2Ficons%2Fhealthcare-medicine%2F512%2Fhospital_building-512.png&f=1&nofb=1"
                      />
                  );
              case 'manufacturer':
                  return (
                      <img
                          alt="google_signup"
                          height="100px"
                          width="100px"
                          src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fcdn3.iconfinder.com%2Fdata%2Ficons%2Fcompany-business-assets%2F281%2Fcompany-asset-004-512.png&f=1&nofb=1"
                      />
                  );
              case 'financier':
                  return (
                      <img
                          alt="google_signup"
                          height="100px"
                          width="100px"
                          src="https://cdn4.iconfinder.com/data/icons/financial-soft/512/money_finance_cash_dollar_payment_bank_building_financial_center-512.png"
                      />
                  );
        }
    }

    /*

    Contact Info

    */

    handleNext = () => {
        const { stepIndex } = this.state;
        this.setState({stepIndex: stepIndex + 1})
    };

    handleBack = () => {
        const { stepIndex } = this.state;
        this.setState({stepIndex: stepIndex - 1})
    };

    isContinueDisabled = () => {
        let email_is_valid = false;
        let password_is_valid = false;
        let accountType_is_valid = false;

        if (this.state.email === null) {
            this.setState({
                email_error_text: null,
            });
        } else if (validateEmail(this.state.email)) {
            email_is_valid = true;
            this.setState({
                email_error_text: null,
            });
        } else {
            this.setState({
                email_error_text: 'Sorry, this is not a valid email',
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

        if (this.state.accountType !== null) {
            accountType_is_valid = true;
        }

        console.log(email_is_valid)
        console.log(password_is_valid)
        console.log(accountType_is_valid)

        if (
          email_is_valid &&
          password_is_valid &&
          accountType_is_valid
        ) {
            this.setState({disabled: false})
        }
    }

    render() {
        const { classes } = this.props;
        const {
          stepIndex,
          email,
          email_error_text,
          password,
          password_error_text,
          activationCode,
          accountType,
          firstName,
          firstName_error_text,
          lastName,
          lastName_error_text,
          location,
          locationName_error_text,
          street1_error_text,
          locality_error_text,
          region_error_text,
          postal_error_text,
          loading,
          showEmail,
          disabled,
          locationDisabled,
          sugestedGeocode,
          invalidGeocode,
        } = this.state;

        const accountTypes = renderAccountType();

        console.warn(location)

        const CreateAccountContainer = (
            <section style={{margin: 0, padding: 0}}>
            <div style={{ margin: 'auto', textAlign: 'center', paddingTop: 40 }}>
                <a style={{cursor: 'pointer'}} onClick={e => this.isDisabled(e)}><img alt="google_signup" height="48px" width="300px" src="/src/containers/App/styles/img/google.png" /></a>
            </div>
            <div style={{ margin: 'auto', textAlign: 'center', paddingTop: 10 }}>
            {
              showEmail
              ? (
                <div>
                    <TextField
                        placeholder="Email Address"
                        label="Email Address"
                        type="email"
                        fullWidth
                        variant="outlined"
                        value={email || ''}
                        autoComplete="email"
                        className={classes.textField}
                        helpertext={email_error_text}
                        onChange={e => this.changeValue(e, 'email')}
                    />
                    < br/>
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
                        onChange={e => this.changeValue(e, 'password')}
                    />
                    < br/>
                    <Button
                        disableRipple
                        disableFocusRipple
                        disabled={disabled}
                        onClick={activationCode ? e => this.createNewEmployee(e) : e => this.createNewAccount(e)}
                        className={classes.registerButton}
                        variant="outlined"
                    >
                        {activationCode ? 'Register Employee' : 'Register Account'}
                    </Button>
                </div>
              ) : (
                <div>
                    <a style={{cursor: 'pointer'}} onClick={e => this.emailSignup(e)}><img alt="google_signup" height="48px" width="300px" src="/src/containers/App/styles/img/email.png" /></a>
                </div>
              )
            }
            </div>

            <div style={{ margin: 'auto', width: isMobileAndTablet() ? '100%' : '50%'}}>
                <p style={{ fontSize: 14, textAlign: 'center', paddingTop: 20 }}>By creating an account, you confirm that you accept the<a style={{color: 'blue'}} href=""> terms and conditions.</a></p>
            </div>
            </section>
        )

        const SignupContainer = (
          <div className={classes.gridItemBoxInner}>
              <div style={{ cursor: 'pointer', margin: 'auto', textAlign: 'center' }}>
                  <a onClick={e => this.handleBack(e)}>{this.renderAccountTypeLogo(accountType)}</a>
              </div>
              <div style={{ textAlign: 'center', paddingTop: 20 }}>
                  {loading
                    ? (<CircularProgress style={{marginBottom: 15}} color="inherit" />)
                    : null}
                  {
                    activationCode
                    ? (
                        <h4 style={{ fontWeight: 300, fontSize: 20, paddingBottom: 15 }}>{!loading ? `Please sign in to create your ${accountType} employee` : 'Creating your employee...'}</h4>
                    ) : (
                        <h4 style={{ fontWeight: 300, fontSize: 20, paddingBottom: 15 }}>{!loading ? `Please sign in to create your ${accountType} account` : 'Creating your account...'}</h4>
                    )
                  }
                  <div className={classes.divider} >
                      <div className={classes.dividerLine} />
                  </div>
              </div>
              {!loading ? CreateAccountContainer : null}
          </div>
        );

        const GetStartedContainer = (
          <div className={classes.gridItemBoxInner}>
              <div>
                  <h4 style={{ fontWeight: 300, fontSize: 20, textAlign: 'center', paddingBottom: 15 }}>{'Let us help you get started?'}</h4>
                  <div className={classes.divider} >
                      <div className={classes.dividerLine} />
                  </div>
              </div>
              <div style={{display: 'flex', paddingTop: 60, justifyContent: 'center', flexDirection: isMobileAndTablet() ? 'column' : 'row'}}>
                  <Paper style={{margin: 10, width: 300}}>
                      <div style={{ margin: 'auto', textAlign: 'center', padding: 20 }}>
                          <img alt="retailer_signup" height="100px" width="100px" src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fcdn0.iconfinder.com%2Fdata%2Ficons%2Fhealthcare-medicine%2F512%2Fhospital_building-512.png&f=1&nofb=1" />
                          <p style={{ fontWeight: 600, fontSize: 16, textAlign: 'center', paddingTop: 10, margin: 0 }}>I'm a Retailer</p>
                          <span style={{ fontSize: 13, color: '#b1b1b1de', textAlign: 'center' }}>I need supplies NOW!</span>
                          <Button
                              disableRipple
                              disableFocusRipple
                              variant="outlined"
                              style={{marginTop: 10}}
                              className={classes.accountTypeButton}
                              onClick={e => this.toggleAccountType(e, 'retailer')}
                          >
                              {'Start Receiving PPE'}
                          </Button>
                      </div>
                  </Paper>
                  <Paper style={{margin: 10, width: 300}}>
                      <div style={{ margin: 'auto', textAlign: 'center', padding: 20 }}>
                          <img alt="manufacturer_signup" height="100px" width="100px" src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fcdn3.iconfinder.com%2Fdata%2Ficons%2Fcompany-business-assets%2F281%2Fcompany-asset-004-512.png&f=1&nofb=1" />
                          <p style={{ fontWeight: 600, fontSize: 16, textAlign: 'center', paddingTop: 10, margin: 0 }}>I'm a Manufacturer</p>
                          <span style={{ fontSize: 13, color: '#b1b1b1de', textAlign: 'center' }}>I have products or supplies!</span>
                          <Button
                              disableRipple
                              disableFocusRipple
                              variant="outlined"
                              style={{marginTop: 10}}
                              className={classes.accountTypeButton}
                              onClick={e => this.toggleAccountType(e, 'manufacturer')}
                          >
                              {'Start Supplying PPE'}
                          </Button>
                      </div>
                  </Paper>
                  <Paper style={{margin: 10, width: 300}}>
                      <div style={{ margin: 'auto', textAlign: 'center', padding: 20 }}>
                          <img alt="financier_signup" height="100px" width="100px" src="https://cdn4.iconfinder.com/data/icons/financial-soft/512/money_finance_cash_dollar_payment_bank_building_financial_center-512.png" />
                          <p style={{ fontWeight: 600, fontSize: 16, textAlign: 'center', paddingTop: 10, margin: 0 }}>I'm a Financier</p>
                          <span style={{ fontSize: 13, color: '#b1b1b1de', textAlign: 'center' }}>I have have too much money..</span>
                          <Button
                              disableRipple
                              disableFocusRipple
                              variant="outlined"
                              style={{marginTop: 10}}
                              className={classes.accountTypeButton}
                              onClick={e => this.toggleAccountType(e, 'financier')}
                          >
                              {'Start Giving Now'}
                          </Button>
                      </div>
                  </Paper>
              </div>
          </div>
        );

        const ContactInfoContainer = (
          <div className={classes.gridItemBoxInner}>
              <div style={{ cursor: 'pointer', margin: 'auto', textAlign: 'center' }}>
                  <a onClick={e => this.handleBack(e)}>{this.renderAccountTypeLogo(accountType)}</a>
              </div>
              <div style={{ textAlign: 'center', paddingTop: 20 }}>
                  <h4 style={{ fontWeight: 300, fontSize: 20, paddingBottom: 15 }}>{'Please update your contact information.'}</h4>
                  <div className={classes.divider} >
                      <div className={classes.dividerLine} />
                  </div>
              </div>
              <div style={{paddingTop: 20, width: isMobileAndTablet() ? '100%' : '50%', margin: 'auto'}}>
                  <TextField
                      placeholder="First Name"
                      label="First Name"
                      variant="outlined"
                      margin="dense"
                      type="text"
                      helperText={firstName_error_text}
                      value={firstName || ''}
                      style={{paddingRight: 20, width: '50%'}}
                      onChange={e => this.handleContactChange(e, 'firstName')}
                      FormHelperTextProps={{ classes: { root: classes.helperText } }}
                  />
                  <TextField
                      placeholder="Last Name"
                      label="Last Name"
                      variant="outlined"
                      margin="dense"
                      type="text"
                      helperText={lastName_error_text}
                      value={lastName || ''}
                      style={{width: '50%'}}
                      onChange={e => this.handleContactChange(e, 'lastName')}
                      FormHelperTextProps={{ classes: { root: classes.helperText } }}
                  />
                  <div style={{paddingBottom: 5}}>
                      <p style={{ fontWeight: 600, fontSize: 16, textAlign: 'left', paddingTop: 10, paddingBottom: 10, margin: 0 }}>Location Address</p>
                      <Divider />
                  </div>
                  <div>
                      <TextField
                          placeholder="Location Name"
                          label="Location Name"
                          variant="outlined"
                          margin="dense"
                          helperText={locationName_error_text}
                          value={location.name || ''}
                          style={{width: '100%'}}
                          onChange={e => this.handleLocationChange(e, null, 'name')}
                          FormHelperTextProps={{ classes: { root: classes.helperText } }}
                      />
                      <AutoCompletePlaces name={location.name} onFinishedSelecting={this.handleLocationSelected}/>
                      <TextField
                          placeholder="Street Address"
                          label="Street Address"
                          variant="outlined"
                          margin="dense"
                          helperText={street1_error_text}
                          value={location.address.street1 || ''}
                          style={{paddingRight: 20, width: '67%'}}
                          onChange={e => this.handleLocationChange(e, 'address', 'street1')}
                          FormHelperTextProps={{ classes: { root: classes.helperText } }}
                      />
                      <TextField
                          placeholder="Address 2"
                          label="Address 2"
                          variant="outlined"
                          margin="dense"
                          value={location.address.street2 || ''}
                          style={{width: '33%'}}
                          onChange={e => this.handleLocationChange(e, 'address', 'street2')}
                      />
                  </div>
                  <div style={{paddingTop: 10}}>
                      <TextField
                          placeholder="Locality"
                          label="Locality"
                          variant="outlined"
                          margin="dense"
                          type="text"
                          helperText={locality_error_text}
                          value={location.address.locality || ''}
                          style={{paddingRight: 20, width: '33%'}}
                          onChange={e => this.handleLocationChange(e, 'address', 'locality')}
                          FormHelperTextProps={{ classes: { root: classes.helperText } }}
                      />
                      <TextField
                          placeholder="Region"
                          label="Region"
                          variant="outlined"
                          margin="dense"
                          type="text"
                          helperText={region_error_text}
                          value={location.address.region || ''}
                          style={{paddingRight: 20, width: '33%'}}
                          onChange={e => this.handleLocationChange(e, 'address', 'region')}
                          FormHelperTextProps={{ classes: { root: classes.helperText } }}
                      />
                      <TextField
                          placeholder="Zip Code"
                          label="Zip Code"
                          variant="outlined"
                          margin="dense"
                          type="number"
                          helperText={postal_error_text}
                          value={location.address.postal || ''}
                          style={{float: 'right', width: '33%'}}
                          onChange={e => this.handleLocationChange(e, 'address', 'postal')}
                          FormHelperTextProps={{ classes: { root: classes.helperText } }}
                      />
                  </div>
              </div>
              <div style={{paddingTop: 25, textAlign: 'center'}}>
                  <Button
                      disableRipple
                      disableFocusRipple
                      disabled={locationDisabled}
                      onClick={e => this.handleLocationFinished(e)}
                      className={classes.registerButton}
                      variant="outlined"
                  >
                      {'Continue'}
                  </Button>
              </div>
          </div>
        );

        return (
            <div className={classes.appFrame}>
                <Grid container alignItems="center" justify="center" className={classes.root} spacing={2}>
                    <Grid item xs={isMobileAndTablet() ? 12 : 8}>
                        <Paper className={classes.content}>
                            {stepIndex === 0 && GetStartedContainer}
                            {stepIndex === 1 && ContactInfoContainer}
                            {stepIndex === 2 && SignupContainer}
                        </Paper>
                    </Grid>
                </Grid>
                <Dialog
                    open={invalidGeocode}
                    // onClose={e => this.toggleSuggestedGeo(false)}
                    aria-labelledby="form-dialog-title"
                >
                    <DialogTitle id="form-dialog-title">Geocoded Address</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                                The address you entered was could not be geocoded. This is required for the application to operate. Is the address below the correct address?
                        </DialogContentText>
                        <label className={classes.inputLabel}>{`${sugestedGeocode.street1} ${sugestedGeocode.locality}, ${sugestedGeocode.region} ${sugestedGeocode.postal}`}</label>
                        <DialogActions>
                            <Button onClick={this.rejectSuggestedGeocode} color="primary">
                                  NO
                            </Button>
                            <Button onClick={this.setSuggestedGeocode} color="primary">
                                  YES
                            </Button>
                        </DialogActions>
                    </DialogContent>
                </Dialog>
            </div>
        );
    }
}

RegisterView.defaultProps = {
    search: '',
    registerAccount: f => f,
    registerEmployee: f => f,
};

RegisterView.propTypes = {
    search: PropTypes.string,
    registerAccount: PropTypes.func,
    registerEmployee: PropTypes.func,
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(RegisterView);
