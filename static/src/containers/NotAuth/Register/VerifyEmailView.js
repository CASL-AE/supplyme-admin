/* eslint camelcase: 0, no-underscore-dangle: 0, react/jsx-indent-props: 0, max-len: 0, react/forbid-prop-types: 0 */
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';

import { toNewEmployee } from '../../../services/employee/model';
import { toNewLocation } from '../../../services/location/model';

const styles = theme => ({
    root: {
        flex: 1,
        height: '100%',
        background: 'linear-gradient(to right, #000000 0%, #79bac1 100%, #79bac1 100%, #79bac1 100%)',
    },
    content: {
        paddingTop: 42,
        paddingBottom: 42,
        paddingLeft: 80,
        paddingRight: 80,
    },
    innerContent: {
        margin: 'auto',
        display: 'flex-inline',
        width: '90%',
    },
    gridItem: {
      marginLeft: '3%',
      marginRight: '3%',
    },
    gridItemBox: {
      backgroundColor: theme.palette.primary.background,
      borderRadius: 8,
      boxShadow: '0 0.5rem 4rem 0.5rem rgba(0,0,0,0.08)',
    },
    gridItemBoxInner: {
      padding: 80,
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
    return {
        accountID: state.app.accountID,
        accountType: state.app.accountType,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: {},
    };
}

@connect(mapStateToProps, mapDispatchToProps)
class VerifyEmailView extends Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {}

    componentWillReceiveProps(nextProps) {
        this.loadComponent(nextProps);
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (nextState === this.state) {
            return false;
        }
        return true;
    }

    render() {
        const { classes } = this.props;
        const {} = this.state;

        const FinishContainer = (
          <div className={classes.innerContent}>
              <div className={classes.gridItem}>
                  <div className={classes.gridItemBox}>
                      <div className={classes.gridItemBoxInner}>
                          <div style={{ cursor: 'pointer', margin: 'auto', textAlign: 'center' }}>
                              <img alt="ae_logo" height="40px" width="auto" src="/src/containers/App/styles/img/logo-named.png" />
                          </div>
                          <div style={{ textAlign: 'center', paddingTop: 20 }}>
                              <h4 style={{ fontWeight: 300, fontSize: 20, paddingBottom: 15 }}>{'Please verify your email.'}</h4>
                              <div className={classes.divider} >
                                  <div className={classes.dividerLine} />
                              </div>
                          </div>
                          <div style={{paddingTop: 20, width: '30%', margin: 'auto'}}>
                              <Button
                                  disableRipple
                                  disableFocusRipple
                                  // onClick={e => this.isDisabled(e)}
                                  className={classes.continueButton}
                                  variant="outlined"
                              >
                                  {'Verify'}
                              </Button>
                              <p style={{ cursor: 'pointer', fontSize: 14, textAlign: 'center', marginBottom: 5, marginTop: 15 }}>{'Resend Confirmation Email.'}</p>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
        );

        return (
            <div className={classes.root}>
                <div style={{paddingTop: 66}} onKeyPress={e => this._handleKeyPress(e)}>
                    <div className={classes.content}>
                        {FinishContainer}
                    </div>
                </div>
            </div>
        );
    }
}

VerifyEmailView.defaultProps = {
    registerAccount: f => f,
};

VerifyEmailView.propTypes = {
    registerAccount: PropTypes.func,
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(VerifyEmailView);
