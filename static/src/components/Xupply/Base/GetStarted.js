/* eslint camelcase: 0, no-underscore-dangle: 0, react/jsx-indent-props: 0, max-len: 0, react/forbid-prop-types: 0 */
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';

import { dispatchNewRoute } from '../../../utils/misc';
import { isMobileAndTablet } from '../../../utils/isMobileAndTablet';

const styles = theme => ({
    root: {
        flexGrow: 1,
        background: theme.palette.primary.background,
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
        backgroundColor: theme.palette.primary.appBar,
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
        accountID: state.app.accountID,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: {},
    };
}

@connect(mapStateToProps, mapDispatchToProps)
class GetStarted extends Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {}

    componentWillReceiveProps(nextProps) {}

    shouldComponentUpdate(nextProps, nextState) {
        if (nextState === this.state) {
            return false;
        }
        return true;
    }

    dispatchNewRoute = (e, walletType) => {
        e.preventDefault();
        const { accountID } = this.props;
        const route = `/accounts/${accountID}/${walletType}`;
        dispatchNewRoute(route);
    }

    render() {
        const { classes } = this.props;
        const {} = this.state;

        const RetailerGetStartedContainer = (
          <div className={classes.gridItemBoxInner}>
              <div>
                  <h4 style={{ fontWeight: 300, fontSize: 20, textAlign: 'center', paddingBottom: 15 }}>{'Get started by adding a wallet.'}</h4>
                  <div className={classes.divider} >
                      <div className={classes.dividerLine} />
                  </div>
              </div>
              <div style={{display: 'flex', paddingTop: 60, justifyContent: 'center', flexDirection: isMobileAndTablet() ? 'column' : 'row'}}>
                  <Paper style={{margin: 10, width: 300}}>
                      <div style={{ margin: 'auto', textAlign: 'center', padding: 20 }}>
                          <img alt="player_signup" height="100px" width="100px" src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fcdn0.iconfinder.com%2Fdata%2Ficons%2Fhealthcare-medicine%2F512%2Fhospital_building-512.png&f=1&nofb=1" />
                          <p style={{ fontWeight: 600, fontSize: 16, textAlign: 'center', paddingTop: 10, margin: 0 }}>Add Inventory</p>
                          <Button
                              disableRipple
                              disableFocusRipple
                              variant="outlined"
                              style={{marginTop: 10}}
                              className={classes.accountTypeButton}
                              onClick={e => this.dispatchNewRoute(e, 'ilp-wallet')}
                          >
                              {'Add Menu Items'}
                          </Button>
                      </div>
                  </Paper>
                  <Paper style={{margin: 10, width: 300}}>
                      <div style={{ margin: 'auto', textAlign: 'center', padding: 20 }}>
                          <img alt="create_request" height="100px" width="100px" src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fcdn3.iconfinder.com%2Fdata%2Ficons%2Fcompany-business-assets%2F281%2Fcompany-asset-004-512.png&f=1&nofb=1" />
                          <p style={{ fontWeight: 600, fontSize: 16, textAlign: 'center', paddingTop: 10, margin: 0 }}>Create Request</p>
                          <Button
                              disableRipple
                              disableFocusRipple
                              variant="outlined"
                              style={{marginTop: 10}}
                              className={classes.accountTypeButton}
                              // onClick={e => this.dispatchNewRoute(e, 'xrp-wallet')}
                          >
                              {'Create Request'}
                          </Button>
                      </div>
                  </Paper>
              </div>
          </div>
        );

        return (
            <div className={classes.appFrame}>
                <Grid container justify="center" className={classes.root} spacing={2}>
                    <Grid item xs={isMobileAndTablet() ? 12 : 10}>
                        <Paper className={classes.content}>
                            {GetStartedContainer}
                        </Paper>
                    </Grid>
                </Grid>
            </div>
        );
    }
}

GetStarted.defaultProps = {
    search: '',
    registerAccount: f => f,
    registerEmployee: f => f,
};

GetStarted.propTypes = {
    search: PropTypes.string,
    registerAccount: PropTypes.func,
    registerEmployee: PropTypes.func,
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(GetStarted);
