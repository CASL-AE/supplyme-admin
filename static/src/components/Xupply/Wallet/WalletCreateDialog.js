/* eslint camelcase: 0, no-underscore-dangle: 0, react/jsx-indent-props: 0, max-len: 0, react/forbid-prop-types: 0 */
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Stepper from '@material-ui/core/Stepper';
import StepButton from '@material-ui/core/StepButton';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Divider from '@material-ui/core/Divider';

import AutoCompleteLocations from '../../../components/Xupply/AutoCompletes/AutoCompleteLocations';

function renderBusinessType() {
    const array = [];
    array.push(<MenuItem key={'default'} value={'default'} disabled={true}>Business Type</MenuItem>);
    array.push(<MenuItem key={'llc'} value={'llc'}>Limited Liability Company</MenuItem>);
    array.push(<MenuItem key={'privateCorp'} value={'privateCorp'}>Private Corporation</MenuItem>);
    array.push(<MenuItem key={'publicCorp'} value={'publicCorp'}>Public Corporation</MenuItem>);
    array.push(<MenuItem key={'soleProp'} value={'soleProp'}>Sole Propriteriship</MenuItem>);
    array.push(<MenuItem key={'partnership'} value={'partnership'}>Partnership/LLP</MenuItem>);
    array.push(<MenuItem key={'taxExempt'} value={'taxExempt'}>Tax Exempt</MenuItem>);
    return array;
}

function renderIndustryType() {
    const array = [];
    array.push(<MenuItem key={'default'} value={'default'} disabled={true}>Industry Type</MenuItem>);
    array.push(<MenuItem key={'charity'} value={'charity'}>Charity/Tax Exempt</MenuItem>);
    array.push(<MenuItem key={'retail'} value={'retail'}>Retail/Physical Goods</MenuItem>);
    array.push(<MenuItem key={'software'} value={'software'}>Software</MenuItem>);
    array.push(<MenuItem key={'services'} value={'services'}>Services</MenuItem>);
    array.push(<MenuItem key={'other'} value={'other'}>Other</MenuItem>);
    return array;
}

import {
    createBraintreeCustomer,
} from '../../../services/account/actions';

const styles = theme => ({
  root: {
        width: '100%',
  },
  backButton: {
        marginRight: theme.spacing(1),
  },
  instructions: {
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
  },
  tributeBox: {
        paddingTop: 30,
        width: '80%',
        margin: 'auto',
        overflowX: 'auto',
    },
    tribute: {
        display: 'inline-flex',
        justifyContent: 'space-between',
    },
    tributeChild: {
        textAlign: 'center',
        padding: 10
    },
    name: {
        padding: 10,
        border: '1px solid #d6d6d6',
        fontSize: 14,
        fontWeight: 500,
        color: '#000'
    },
    locationField: {
        width: '70%',
    },
    helperText: {
        margin: 0,
        paddingTop: 10,
        fontSize: 12,
        color: '#d22323',
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
    continueButton: {
        textAlign: 'center',
        color: '#fff',
        backgroundColor: theme.palette.primary.main,
        textTransform: 'none',
        height: 45,
        width: '100%',
        fontSize: 14,
    },
});



function mapStateToProps(state) {
    return {};
}

function mapDispatchToProps(dispatch) {
    return {
        actions: {

        },
    };
}

function getSteps() {
  return ['Choose Wallet', 'Create Customer', 'Create Payment', 'Finish'];
}

@connect(mapStateToProps, mapDispatchToProps)
class WalletCreateDialog extends Component {

    constructor(props) {
        super(props);
        this.state = {
            activeStep: 0,
            completed: {},
            words: ['list', 'of', 'test', 'words', 'and', 'more', 'defined', 'nature', 'science'],
            mixedWords: [],
            isBusiness: false,
        };
    }

    componentDidMount() { }

    componentWillReceiveProps(nextProps) { }

    shouldComponentUpdate(nextProps, nextState) {
        if (nextState === this.state) {
            return false;
        }
        return true;
    }

    totalSteps = () => {
      const steps = getSteps();
      return steps.length;
    };

    completedSteps = () => {
      const { completed } = this.state;
      return Object.keys(completed).length;
    };

    isLastStep = () => {
      const { activeStep } = this.state;
      return activeStep === this.totalSteps() - 1;
    };

    allStepsCompleted = () => {
      return this.completedSteps() === this.totalSteps();
    };

    handleNext = () => {
      const { activeStep, completed,  } = this.state;
      console.log(steps)
      const steps = getSteps();
      const newActiveStep =
        this.isLastStep() && !this.allStepsCompleted()
          ? // It's the last step, but not all steps have been completed,
            // find the first step that has been completed
            steps.findIndex((step, i) => !(i in completed))
          : activeStep + 1;
      this.setState({activeStep: newActiveStep})
    };

    handleBack = () => {
      const { activeStep } = this.state;
      this.setState({activeStep: activeStep - 1})
    };

    handleStep = (step) => () => {
      this.setState({activeStep: step})
    };

    handleComplete = () => {
      const { completed, activeStep } = this.state;
      const newCompleted = completed;
      newCompleted[activeStep] = true;
      this.setState({completed: newCompleted})
      this.handleNext()
    };

    handleReset = () => {
      this.setState({activeStep: 0, completed: {}})
    };

    renderWord = (word) => {
        const { classes } = this.props;
        return (
            <div key={word} className={classes.tribute}>
                <div className={classes.tributeChild}>
                    <div className={classes.name}>{word}</div>
                </div>
            </div>
        )
    }

    /*

    Create Customer Functions

    */

    toggleBusiness = (e) => {
        const { isBusiness } = this.state;
        this.setState({isBusiness: !isBusiness})
    }

    getBusinessContent = () => {
        const { classes } = this.props;
        const businessTypes = renderBusinessType();
        const industryTypes = renderIndustryType();
        return (
              <section>
              <div style={{marginBottom: 25}}>
                  <div style={{paddingBottom: 5}}>
                      <p style={{ fontWeight: 600, fontSize: 16, textAlign: 'left', paddingTop: 10, paddingBottom: 10, margin: 0 }}>Business Details</p>
                      <Divider />
                  </div>
                  <div>
                      <TextField
                          label="Business Name"
                          variant="outlined"
                          margin="dense"
                          helperText={'Please fill out this field.'}
                          // value={request.package.pricePerUnit || ''}
                          style={{width: '100%'}}
                          onChange={e => this.handleChange(e, 'pricePerUnit')}
                          FormHelperTextProps={{ classes: { root: classes.helperText } }}
                      />
                  </div>
                  <div>
                      <FormControl style={{paddingRight: 20, width: '33%'}}>
                          <Select
                              // onChange={e => this.changeValue(e, 'activationCode', 'accountType')}
                              value={'default'}
                              variant="outlined"
                              margin="dense"
                              inputProps={{
                                  name: 'businessType',
                                  id: 'businessType',
                              }}
                          >
                              {businessTypes}
                          </Select>
                      </FormControl>
                      <FormControl style={{paddingRight: 20, width: '33%'}}>
                          <Select
                              // onChange={e => this.changeValue(e, 'activationCode', 'accountType')}
                              value={'default'}
                              variant="outlined"
                              margin="dense"
                              inputProps={{
                                  name: 'industryType',
                                  id: 'industryType',
                              }}
                          >
                              {industryTypes}
                          </Select>
                      </FormControl>
                      <TextField
                          placeholder="MM/DD/YYYY"
                          label="Start Date"
                          variant="outlined"
                          margin="dense"
                          helperText={'Please fill out this field.'}
                          // value={request.package.pricePerUnit || ''}
                          style={{width: '33%', margin: 0}}
                          onChange={e => this.handleChange(e, 'pricePerUnit')}
                          FormHelperTextProps={{ classes: { root: classes.helperText } }}
                      />
                  </div>
                  <div>
                      <TextField
                          label="Legal Name"
                          variant="outlined"
                          margin="dense"
                          helperText={'Please fill out this field.'}
                          // value={request.package.pricePerUnit || ''}
                          style={{width: '50%', paddingRight: 20}}
                          onChange={e => this.handleChange(e, 'pricePerUnit')}
                          FormHelperTextProps={{ classes: { root: classes.helperText } }}
                      />
                      <TextField
                          label="Tax ID"
                          variant="outlined"
                          margin="dense"
                          helperText={'Please use a valid TIN.'}
                          // value={request.package.pricePerUnit || ''}
                          style={{width: '50%'}}
                          onChange={e => this.handleChange(e, 'pricePerUnit')}
                          FormHelperTextProps={{ classes: { root: classes.helperText } }}
                      />
                  </div>
              </div>
              <div style={{marginBottom: 25}}>
                  <div style={{paddingBottom: 5}}>
                      <p style={{ fontWeight: 600, fontSize: 16, textAlign: 'left', paddingTop: 10, paddingBottom: 10, margin: 0 }}>Business Address</p>
                      <Divider />
                  </div>
                  <div>
                      <TextField
                          label="Street Address"
                          variant="outlined"
                          margin="dense"
                          // helperText={name_error_text}
                          // value={request.package.pricePerUnit || ''}
                          style={{paddingRight: 20, width: '67%'}}
                          onChange={e => this.handleChange(e, 'street1')}
                          // FormHelperTextProps={{ classes: { root: classes.helperText } }}
                      />
                      <TextField
                          label="Address 2 (Optional)"
                          variant="outlined"
                          margin="dense"
                          // helperText={name_error_text}
                          // value={request.package.pricePerUnit || ''}
                          style={{width: '33%'}}
                          onChange={e => this.handleChange(e, 'street2')}
                          // FormHelperTextProps={{ classes: { root: classes.helperText } }}
                      />
                  </div>
                  <div style={{paddingTop: 10}}>
                      <TextField
                          label="Locality"
                          variant="outlined"
                          margin="dense"
                          type="text"
                          // helperText={name_error_text}
                          // value={location.contactInfo.name}
                          style={{paddingRight: 20, width: '33%'}}
                          onChange={e => this.searchItems(e)}
                          // FormHelperTextProps={{ classes: { root: classes.helperText } }}
                      />
                      <TextField
                          label="Region"
                          variant="outlined"
                          margin="dense"
                          type="text"
                          // helperText={name_error_text}
                          // value={request.package.quantity || ''}
                          style={{paddingRight: 20, width: '33%'}}
                          onChange={e => this.handleChange(e, 'quantity')}
                          // FormHelperTextProps={{ classes: { root: classes.helperText } }}
                      />
                      <TextField
                          label="Zip Code"
                          variant="outlined"
                          margin="dense"
                          type="number"
                          // helperText={name_error_text}
                          // value={request.package.pricePerUnit || ''}
                          style={{width: '33%'}}
                          onChange={e => this.handleChange(e, 'pricePerUnit')}
                          // FormHelperTextProps={{ classes: { root: classes.helperText } }}
                      />
                  </div>
              </div>
              </section>
        );
    }

    // Personal Content
    getPersonalContent = () => {
        const { classes } = this.props;
        const { isBusiness } = this.state;
        return (
              <section>
              <div style={{marginBottom: 25}}>
                  <div style={{paddingBottom: 5}}>
                      <p style={{ fontWeight: 600, fontSize: 16, textAlign: 'left', paddingTop: 10, paddingBottom: 10, margin: 0 }}>Your Personal Information</p>
                      <Divider />
                  </div>
                  <div>
                      <TextField
                          placeholder="First Name"
                          label="First Name"
                          variant="outlined"
                          margin="dense"
                          type="text"
                          // helperText={name_error_text}
                          // value={location.contactInfo.name}
                          style={{paddingRight: 20, width: '50%'}}
                          // onChange={e => this.searchItems(e)}
                          // FormHelperTextProps={{ classes: { root: classes.helperText } }}
                      />
                      <TextField
                          placeholder="Last Name"
                          label="Last Name"
                          variant="outlined"
                          margin="dense"
                          type="text"
                          // helperText={name_error_text}
                          // value={location.contactInfo.name}
                          style={{width: '50%'}}
                          // onChange={e => this.searchItems(e)}
                          // FormHelperTextProps={{ classes: { root: classes.helperText } }}
                      />
                  </div>
                  {
                    isBusiness
                    ? (
                      <div>
                          <TextField
                              placeholder="Job Title"
                              label="Position"
                              variant="outlined"
                              margin="dense"
                              type="text"
                              // helperText={name_error_text}
                              // value={location.contactInfo.name}
                              style={{width: '100%'}}
                              // onChange={e => this.searchItems(e)}
                              // FormHelperTextProps={{ classes: { root: classes.helperText } }}
                          />
                      </div>
                    ) : null
                  }
                  <div>
                      <TextField
                          placeholder="(000)000-0000"
                          label="Personal Phone #"
                          variant="outlined"
                          margin="dense"
                          type="text"
                          // helperText={name_error_text}
                          // value={location.contactInfo.name}
                          style={{paddingRight: 20, width: '33%'}}
                          // onChange={e => this.searchItems(e)}
                          // FormHelperTextProps={{ classes: { root: classes.helperText } }}
                      />
                      <TextField
                          placeholder="Email Address"
                          label="Email Address"
                          variant="outlined"
                          margin="dense"
                          type="text"
                          // helperText={name_error_text}
                          // value={location.contactInfo.name}
                          style={{paddingRight: 20, width: '33%'}}
                          // onChange={e => this.searchItems(e)}
                          // FormHelperTextProps={{ classes: { root: classes.helperText } }}
                      />
                      <TextField
                          placeholder="MM/DD/YYYY"
                          label="Date of Birth"
                          variant="outlined"
                          margin="dense"
                          type="text"
                          // helperText={name_error_text}
                          // value={location.contactInfo.name}
                          style={{ width: '33%'}}
                          // onChange={e => this.searchItems(e)}
                          // FormHelperTextProps={{ classes: { root: classes.helperText } }}
                      />
                  </div>
                  <div>
                      {
                          isBusiness
                          ? (
                            <section>
                                <TextField
                                    placeholder="123-45-6789"
                                    label="Social Security Number"
                                    variant="outlined"
                                    margin="dense"
                                    type="text"
                                    // helperText={name_error_text}
                                    // value={location.contactInfo.name}
                                    style={{width: '100%'}}
                                    // onChange={e => this.searchItems(e)}
                                    // FormHelperTextProps={{ classes: { root: classes.helperText } }}
                                />
                                <p style={{ color: '#a7a7a7', fontSize: 12, textAlign: 'left', paddingTop: 10, margin: 0 }}>This information will help us verify the identity of the individual.</p>
                            </section>
                          ) : null
                      }

                      <div>
                          <TextField
                              placeholder="Street Address"
                              label="Street Address"
                              variant="outlined"
                              margin="dense"
                              // helperText={name_error_text}
                              // value={request.package.pricePerUnit || ''}
                              style={{paddingRight: 20, width: '67%'}}
                              onChange={e => this.handleChange(e, 'street1')}
                              // FormHelperTextProps={{ classes: { root: classes.helperText } }}
                          />
                          <TextField
                              placeholder="Address 2"
                              label="Address 2"
                              variant="outlined"
                              margin="dense"
                              // helperText={name_error_text}
                              // value={request.package.pricePerUnit || ''}
                              style={{width: '33%'}}
                              onChange={e => this.handleChange(e, 'street2')}
                              // FormHelperTextProps={{ classes: { root: classes.helperText } }}
                          />
                      </div>
                      <div style={{paddingTop: 10}}>
                          <TextField
                              placeholder="Locality"
                              label="Locality"
                              variant="outlined"
                              margin="dense"
                              type="text"
                              // helperText={name_error_text}
                              // value={location.contactInfo.name}
                              style={{paddingRight: 20, width: '33%'}}
                              onChange={e => this.searchItems(e)}
                              // FormHelperTextProps={{ classes: { root: classes.helperText } }}
                          />
                          <TextField
                              placeholder="Region"
                              label="Region"
                              variant="outlined"
                              margin="dense"
                              type="text"
                              // helperText={name_error_text}
                              // value={request.package.quantity || ''}
                              style={{paddingRight: 20, width: '33%'}}
                              onChange={e => this.handleChange(e, 'quantity')}
                              // FormHelperTextProps={{ classes: { root: classes.helperText } }}
                          />
                          <TextField
                              placeholder="Postal Code"
                              label="Postal Code"
                              variant="outlined"
                              margin="dense"
                              type="number"
                              // helperText={name_error_text}
                              // value={request.package.pricePerUnit || ''}
                              style={{width: '33%'}}
                              onChange={e => this.handleChange(e, 'pricePerUnit')}
                              // FormHelperTextProps={{ classes: { root: classes.helperText } }}
                          />
                      </div>
                  </div>
              </div>
              </section>
        );
    }

    getStepContent = (stepIndex) => {
        const { classes, handleSkipPayment } = this.props;
        const { isBusiness } = this.state;
        const businessTypes = renderBusinessType();
        const industryTypes = renderIndustryType();
        switch (stepIndex) {
          case 0:
            return (
              <div style={{textAlign: 'center'}}>
                  <h2>Global Payments Should Be Easy</h2>
                  <br />
                  <p style={{color: '#828282'}}>Too often, global payments are costly, unreliable and slow. Thats why we reccomened Ripple.</p>
                  <div style={{display: 'flex', paddingTop: 10}}>
                      <Paper onClick={this.handleNext} style={{margin: 10, width: 300, cursor: 'pointer'}}>
                          <div style={{ margin: 'auto', textAlign: 'center', padding: 20 }}>
                              <img alt="google_signup" height="50px" width="50px" src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fcdn2.iconfinder.com%2Fdata%2Ficons%2Fsocial-productivity-line-art-2%2F128%2Fcredit-card-256.png&f=1&nofb=1" />
                              <p style={{ fontWeight: 600, fontSize: 16, textAlign: 'center', paddingTop: 10, margin: 0 }}>Braintree</p>
                              <span style={{ fontSize: 13, color: '#b1b1b1de', textAlign: 'center' }}>Venmo & CC</span>
                          </div>
                      </Paper>
                      <Paper style={{margin: 10, width: 300, cursor: 'pointer'}}>
                          <div style={{ margin: 'auto', textAlign: 'center', padding: 20 }}>
                              <a onClick={e => this.isDisabled(e)} href="https://caslnpo.org"><img alt="google_signup" height="50px" width="50px" src="https://cdn4.iconfinder.com/data/icons/financial-soft/512/money_finance_cash_dollar_payment_bank_building_financial_center-512.png" /></a>
                              <p style={{ fontWeight: 600, fontSize: 16, textAlign: 'center', paddingTop: 10, margin: 0 }}>Dwolla</p>
                              <span style={{ fontSize: 13, color: '#b1b1b1de', textAlign: 'center' }}>ACH</span>
                          </div>
                      </Paper>
                      <Paper style={{ margin: 10, width: 300, cursor: 'pointer'}}>
                          <div style={{ margin: 'auto', textAlign: 'center', padding: 20 }}>
                              <a onClick={e => this.isDisabled(e)} href="https://caslnpo.org"><img alt="google_signup" height="50px" width="50px" src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fstatic.coinpaprika.com%2Fcoin%2Fxrp-xrp%2Flogo.png%3Frev%3D160485&f=1&nofb=1" /></a>
                              <p style={{ fontWeight: 600, fontSize: 16, textAlign: 'center', paddingTop: 10, margin: 0 }}>Ripple</p>
                              <span style={{ fontSize: 13, color: '#b1b1b1de', textAlign: 'center' }}>ILP/XRP</span>
                          </div>
                      </Paper>
                  </div>
                  <div style={{width: '50%', padding: 25, margin: 'auto'}}>
                      <Button
                          disableRipple
                          disableFocusRipple
                          onClick={e => handleSkipPayment(e)}
                          className={classes.continueButton}
                          variant="outlined"
                      >
                          {'Continue Without Payment'}
                      </Button>
                  </div>
              </div>
            );
          case 1:
            return (
                <div style={{textAlign: 'center'}}>
                    <h2>Create {'Braintree'} Customer</h2>
                    <div className={classes.gridItem}>
                        <div className={classes.gridItemBox}>
                            <div className={classes.gridItemBoxInner}>
                                <div>
                                    <div style={{ textAlign: 'center', paddingTop: 10}}>
                                        <FormControlLabel
                                            classes={{ label: classes.checkboxLabel }}
                                            control={
                                              <Checkbox
                                                checked={isBusiness}
                                                onChange={e => this.toggleBusiness(e)}
                                                color="primary"
                                                className={classes.checkbox}
                                              />
                                            }
                                            label="Business"
                                        />
                                        <FormControlLabel
                                            classes={{ label: classes.checkboxLabel }}
                                            control={
                                              <Checkbox
                                                checked={!isBusiness}
                                                onChange={e => this.toggleBusiness(e)}
                                                color="primary"
                                                className={classes.checkbox}
                                              />
                                            }
                                            label="Personal"
                                        />
                                    </div>
                                    {this.getPersonalContent()}
                                    {
                                      isBusiness
                                      ? this.getBusinessContent()
                                      : null
                                    }
                                    <div style={{width: '50%', margin: 'auto', marginTop: 10}}>
                                        <Button
                                            disableRipple
                                            disableFocusRipple
                                            // onClick={e => this.toggleWallet(e)}
                                            className={classes.continueButton}
                                            variant="outlined"
                                        >
                                            {'Agree & Continue'}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
          case 2:
            return (
              <div style={{textAlign: 'center'}}>
                  <h2>Backup Mnemonic Phrase & Password</h2>
                  <br />
                  <p style={{color: '#828282'}}>We recommend that you write down your mnemonic phrase and password down as a backup.</p>
                  <br />
                  <p style={{color: '#000000'}}>WE DO NOT KEEP A BACKUP.</p>
              </div>
            );
          default:
            return null;
        }
    }

    render() {
        const { classes } = this.props;
        const { activeStep, completed } = this.state;
        const steps = getSteps();
        return (
          <div>
          <Dialog
              open={true}
              maxWidth={1000}
              aria-labelledby="form-dialog-title"
          >
                <DialogContent>
                  <DialogContentText>
                    <Stepper nonLinear activeStep={activeStep}>
                      {steps.map((label, index) => (
                        <StepButton key={label} onClick={this.handleStep(index)} completed={completed[index]}>
                          {label}
                        </StepButton>
                      ))}
                    </Stepper>
                  </DialogContentText>
                  <div className={classes.root}>
                      <div>
                        {activeStep === steps.length ? (
                          <div>
                            <Typography className={classes.instructions}>All steps completed</Typography>
                            <Button onClick={this.handleReset}>Reset</Button>
                          </div>
                        ) : <Typography className={classes.instructions}>{this.getStepContent(activeStep)}</Typography> }
                      </div>
                    </div>
                </DialogContent>
                  {
                    activeStep !== steps.length && completed[activeStep]
                    ? (
                      <DialogActions>
                          <Button
                              disabled={activeStep === 0}
                              onClick={this.handleBack}
                              className={classes.backButton}
                              color="primary"
                          >
                            Back
                          </Button>
                          <Button
                              onClick={this.handleNext}
                              color="primary"
                          >
                            {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                          </Button>
                    </DialogActions>
                    ) : null}
          </Dialog>
          </div>
        );
    }
}

WalletCreateDialog.defaultProps = {};

WalletCreateDialog.propTypes = {
      open: PropTypes.bool.isRequired,
      handleSkipPayment: PropTypes.func.isRequired,
      classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(WalletCreateDialog);

// Mnemonic Phrase
// <div style={{textAlign: 'center'}}>
//     <h2>Create Wallet w/ Mnemonic Phrase</h2>
//     <br />
//     <p style={{color: '#828282'}}>Click the mnemonic phrase below in the correct order to create your wallet.</p>
//     <br />
//     <p style={{color: '#000000'}}>{words.map(w => (<span>{` ${w},`}</span>))}</p>
//     <div className={classes.tributeBox}>
//         {words.map(this.renderWord, this)}
//     </div>
// </div>

// <div style={{textAlign: 'center'}}>
//     <h2>Backup Mnemonic Phrase & Password</h2>
//     <br />
//     <p style={{color: '#828282'}}>We recommend that you write down your mnemonic phrase and password down as a backup.</p>
//     <br />
//     <p style={{color: '#000000'}}>WE DO NOT KEEP A BACKUP.</p>
// </div>
