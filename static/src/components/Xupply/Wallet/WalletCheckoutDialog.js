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
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import Checkbox from '@material-ui/core/Checkbox';

import { formatNumbersWithCommas } from '../../../utils/misc';
import { toNewRequest } from '../../../services/request/model';

import WalletCreateDialog from './WalletCreateDialog';
import CheckoutTooltip from '../Misc/CheckoutTooltip';
import XupplyLoader from '../../../components/Xupply/Base/XupplyLoader';

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
    loginButton: {
        textAlign: 'center',
        color: '#fff',
        backgroundColor: theme.palette.primary.main,
        textTransform: 'none',
        height: 45,
        width: 140,
        fontSize: 14,
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
    loginDivider: {
        display: 'flex',
        color: '#5c5c5c',
        fontSize: 15,
        paddingTop: 10,
    },
    loginDividerB: {
        marginRight: 10,
        content: "",
        borderTop: '1px solid #d6d6d6',
        flex: 1,
        transform: 'translateY(50%)',
    },
    loginDividerA: {
        marginLeft: 10,
        content: "",
        borderTop: '1px solid #d6d6d6',
        flex: 1,
        transform: 'translateY(50%)',
    },
    checkbox: {
        margin: 0,
        padding: 0,
        paddingRight: 10,
        marginLeft: 10,
    },
});

function mapStateToProps(state) {
    return {
        merchantHash: state.app.merchantHash,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: {},
    };
}

function getSteps() {
  return ['Welcome To Driip', 'Create Mnemonic Phrase', 'Backup Key Pair'];
}

@connect(mapStateToProps, mapDispatchToProps)
class WalletCheckoutDialog extends Component {

    constructor(props) {
        super(props);
        this.state = {
            request: toNewRequest(),
            activeStep: 0,
            words: ['list', 'of', 'test', 'words', 'and', 'more', 'defined', 'nature', 'science'],
            mixedWords: [],
            open: false,
            needFinancing: false,
        };
    }

    componentDidMount() {
        this.setState({open: this.props.open, request: this.props.request});
    }

    componentWillReceiveProps(nextProps) {
        this.setState({open: nextProps.open, request: nextProps.request});
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (nextState === this.state) {
            return false;
        }
        return true;
    }

    handleNext = () => {
        const { activeStep } = this.state;
        this.setState({activeStep: activeStep + 1})
    };

    handleBack = () => {
        const { activeStep } = this.state;
        this.setState({activeStep: activeStep - 1})
    };

    handleReset = () => {
        const { activeStep } = this.state;
        this.setState({activeStep: 0})
    };

    handleSkipPayment = () => {
        this.setState({needFinancing: true})
    }

    handleChangePayment = () => {
        const { needFinancing } = this.state;
        this.setState({needFinancing: !needFinancing})
    }

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

    getStepContent = (stepIndex) => {
        const { classes } = this.props;
        const { words } = this.state;
        switch (stepIndex) {
          case 0:
            return (
              <div style={{textAlign: 'center'}}>
                  <h2>Global Payments Should Be Easy</h2>
                  <br />
                  <p style={{color: '#828282'}}>Too often, global payments are costly, unreliable and slow. The underlying systems are fragmented and complex.</p>
                  <p>Driip offers a platform to hold all your financial data in one place. Invoices, Bills, Payroll, Reports, Taxes on all the Ripple Blockchain, all in one app.</p>
              </div>
            );
          case 1:
            return (
                <div style={{textAlign: 'center'}}>
                    <h2>Create Wallet w/ Mnemonic Phrase</h2>
                    <br />
                    <p style={{color: '#828282'}}>Click the mnemonic phrase below in the correct order to create your wallet.</p>
                    <br />
                    <p style={{color: '#000000'}}>{words.map(w => (<span>{` ${w},`}</span>))}</p>
                    <div className={classes.tributeBox}>
                        {words.map(this.renderWord, this)}
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

    renderLineItem = (menuItem) => {
        const { stockPerItem } = this.state.request;
        const quantity = Object.entries(stockPerItem).map((q) => {if (menuItem.itemID === q[0]) { return q[1].quantity}})
        const pricePerUnit = Object.entries(stockPerItem).map((q) => {if (menuItem.itemID === q[0]) { return q[1].pricePerUnit}})
        return (
          <section style={{margin: 0}}>
              <Divider style={{margin: 10}} />
              <div style={{padding: 10, display: 'flex-inline'}}>
                  <p style={{margin: 0, padding: 0}} >{menuItem.itemName}<span style={{float: 'right'}}>{`$ ${formatNumbersWithCommas(quantity * pricePerUnit)}`} USD</span></p>
                  <span>Quantity <span style={{fontSize: 12, color: 'gray', float: 'right'}}>{quantity}</span></span>
                  <br />
                  <span>Price Per Unit<span style={{fontSize: 12, color: 'gray', float: 'right'}}>{`$ ${formatNumbersWithCommas(pricePerUnit)}`} USD</span></span>
              </div>
          </section>
        );
    }

    render() {
        const { classes, loading, handleClose, merchantHash, handleSubmit } = this.props;
        const { activeStep, open, request, needFinancing } = this.state;
        const steps = getSteps();
        console.warn(merchantHash);
        console.warn(open);
        console.warn(request);
        return (
          <div>
          {open && !needFinancing
            ? (<WalletCreateDialog handleSkipPayment={this.handleSkipPayment}/>)
            : (
              <Dialog
                  open={open}
                  // onClose={handleClose}
                  aria-labelledby="form-dialog-title"
              >
                    <DialogContent style={{padding: 15}}>
                      <div style={{width: 500, padding: 10}}>
                          <img alt="ae_logo" height="40px" width="auto" src="/src/containers/App/styles/img/logo-named.png" />
                          <CheckoutTooltip
                            arrow
                            title={
                              <React.Fragment>
                                  {request.items.map(this.renderLineItem, this)}
                                  <Divider style={{margin: 10}} />
                                  <div style={{padding: 10, display: 'flex-inline'}}>
                                      <p style={{margin: 0, padding: 0, paddingTop: 5}} >Merchant <span style={{float: 'right'}}>{`$ ${formatNumbersWithCommas(request.totals.serviceCharges)}`} USD</span></p>
                                      <p style={{margin: 0, padding: 0}} >Tax <span style={{float: 'right'}}>{`$ ${formatNumbersWithCommas(request.totals.tax)}`} USD</span></p>
                                  </div>
                                  <Divider style={{margin: 10}} />
                                  <div style={{padding: 10, display: 'flex-inline'}}>
                                      <p style={{margin: 0, padding: 0, color: 'black', fontWeight: 600}} >Total <span style={{float: 'right', color: 'black', fontWeight: 600}}>{`$ ${formatNumbersWithCommas(request.totals.due)}`} USD</span></p>
                                  </div>
                              </React.Fragment>
                            }
                          >
                              <section style={{float: 'right', margin: 0}}>
                                  <ShoppingCartIcon />
                                  <span style={{ fontSize: 16, fontWeight: 600, color: '#000' }}>{`$ ${formatNumbersWithCommas(request.totals.due)}`}</span>
                              </section>
                          </CheckoutTooltip>
                      </div>
                      <Divider />
                      <div style={{width: 500, display: 'inline-flex', padding: 10}}>
                          <div style={{ padding: 15, textAlign: 'left', margin: 'auto', width: '50%' }}>
                              <h5 style={{color: '#a7a7a7', fontWeight: 600}}>Ship To</h5>
                              <p style={{marginBottom: 0, fontWeight: 600, paddingTop: 10, color: '#000'}}>{request.location.contactInfo.name}</p>
                              <span style={{color: '#828282'}}>{`${request.location.address.street1} ${request.location.address.street1}`}</span>
                              < br/>
                              <span style={{color: '#828282'}}>{`${request.location.address.locality}, ${request.location.address.region} ${request.location.address.postal}`}</span>
                          </div>
                          <div style={{ padding: 15, textAlign: 'right', margin: 'auto', width: '50%' }}>
                                <p onClick={e => handleClose(e)} style={{cursor: 'pointer', color: 'blue'}}>{'Change'}</p>
                          </div>
                      </div>
                      <Divider />
                      {
                        needFinancing
                        ? (
                          <div style={{width: 500, display: 'inline-flex', padding: 10}}>
                              <div style={{ padding: 15, textAlign: 'left', margin: 0, width: '50%' }}>
                                  <h5 style={{color: '#a7a7a7', fontWeight: 600}}>Seeking Financing</h5>
                                  <p style={{marginBottom: 0, fontWeight: 600, paddingTop: 10, color: '#000'}}>Through Xupply</p>
                              </div>
                              <div style={{ padding: 15, textAlign: 'right', margin: 'auto', width: '50%' }}>
                                    <p onClick={e => this.handleChangePayment(e)} style={{cursor: 'pointer', color: 'blue'}}>{'Manage'}</p>
                                    <span style={{fontSize: 14, fontWeight: 400}}>{`$ ${formatNumbersWithCommas(request.totals.due)}`}</span>
                                    <br />
                                    <span style={{fontSize: 12, color: '#393999'}}>{'USD'}</span>
                              </div>
                          </div>
                        ) : (
                          <div style={{width: 500, display: 'inline-flex', padding: 10}}>
                              <div style={{ padding: 15, textAlign: 'left', margin: 0, width: '50%' }}>
                                  <h5 style={{color: '#a7a7a7', fontWeight: 600}}>Pay With</h5>
                                  <p style={{marginBottom: 0, fontWeight: 600, paddingTop: 10, color: '#000'}}>XRP Account</p>
                                  <span style={{color: '#828282'}}>rige848ht8340ht2830r3802</span>
                              </div>
                              <div style={{ padding: 15, textAlign: 'right', margin: 'auto', width: '50%' }}>
                                    <p style={{cursor: 'pointer', color: 'blue'}}>{'Manage'}</p>
                                    <span style={{fontSize: 14, fontWeight: 400}}>{'124.39'}</span>
                                    <br />
                                    <span style={{fontSize: 12, color: '#393999'}}>{'USD'}</span>
                              </div>
                          </div>
                        )
                      }
                      {
                        !needFinancing
                        ? (
                          <p style={{paddingLeft: 25, paddingRight: 25, color: 'blue'}}>{'+ Add new payment'}</p>
                        ) : null
                      }

                      {
                        loading
                        ? (<XupplyLoader open={loading} />)
                        : (
                          <section>
                          <Checkbox
                            // checked={filter.isDIY}
                            // onChange={e => this.handleFilter(e, 'isDIY')}
                            color="primary"
                            className={classes.checkbox}
                          />
                          <div style={{ fontSize: 12, paddingLeft: 25, paddingRight: 25, marginBottom: 5 }}>
                              <Checkbox
                                // checked={filter.isDIY}
                                // onChange={e => this.handleFilter(e, 'isDIY')}
                                color="primary"
                                className={classes.checkbox}
                              />
                              {'I understand and acknowledge the Liability & Open-Sourced Policy.'}
                          </div>

                          <div style={{ fontSize: 12, paddingLeft: 25, paddingRight: 25, marginBottom: 5 }}>
                              <Checkbox
                                // checked={filter.isDIY}
                                // onChange={e => this.handleFilter(e, 'isDIY')}
                                color="primary"
                                className={classes.checkbox}
                              />
                              {'I understand and acknowledge the Terms & Conditions. '}
                          </div>
                          <div style={{paddingLeft: 25, paddingRight: 25, paddingBottom: 25}}>
                              <Button
                                  disableRipple
                                  disableFocusRipple
                                  onClick={e => handleSubmit(e)}
                                  className={classes.continueButton}
                                  variant="outlined"
                              >
                                  {'Agree & Finish'}
                              </Button>
                          </div>
                          </section>
                        )
                      }
                      <Divider />
                      <div style={{width: 500, display: 'inline-flex', padding: 10}}>
                          <div style={{ padding: 15, textAlign: 'left', margin: 'auto', width: '70%' }}>
                              <p onClick={e => handleClose(e)} style={{marginBottom: 0, fontSize: 14, paddingTop: 0, color: '#393939', cursor: 'pointer'}}>Cancel and return</p>
                              <div style={{paddingTop: 10}}>
                              <span style={{fontSize: 12, paddingRight: 15, color: '#828282'}}>Policies</span>
                              <span style={{fontSize: 12, paddingRight: 15, color: '#828282'}}>Terms</span>
                              <span style={{fontSize: 12, paddingRight: 15, color: '#828282'}}>Privacy</span>
                              </div>
                          </div>
                          <div style={{ padding: 15, textAlign: 'right', margin: 'auto', width: '30%' }}>
                                <p></p>
                                <div style={{paddingTop: 10}}>
                                <span style={{fontSize: 12, color: '#393999'}}>&copy; 2020</span>
                                </div>
                          </div>
                      </div>
                    </DialogContent>

              </Dialog>
            )
          }
          </div>
        );
    }
}

WalletCheckoutDialog.defaultProps = {};

WalletCheckoutDialog.propTypes = {
    merchantHash: PropTypes.string.isRequired,
    open: PropTypes.bool.isRequired,
    loading: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(WalletCheckoutDialog);

// <IconButton disabled={true} style={{float: 'right'}}>
//     <div style={{ margin: 0 }}>
//         <ShoppingCartIcon />
//     </div>
// </IconButton>

// <div>
//   {activeStep === steps.length ? (
//     <div>
//       <Typography className={classes.instructions}>All steps completed</Typography>
//       <Button onClick={this.handleReset}>Reset</Button>
//     </div>
//   ) : <Typography className={classes.instructions}>{this.getStepContent(activeStep)}</Typography> }
// </div>
