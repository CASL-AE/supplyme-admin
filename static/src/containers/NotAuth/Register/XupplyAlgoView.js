/* eslint camelcase: 0, no-underscore-dangle: 0, react/jsx-indent-props: 0, max-len: 0, react/forbid-prop-types: 0 */
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import CircularProgress from '@material-ui/core/CircularProgress';

import { isMobileAndTablet } from '../../../utils/isMobileAndTablet';

function mapStateToProps(state) {
    return {};
}

function mapDispatchToProps(dispatch) {
    return {
        actions: {},
    };
}

const styles = theme => ({
    root: {
        flexGrow: 1,
        background: 'linear-gradient(to right, #000000 0%, #79bac1 100%, #79bac1 100%, #79bac1 100%)',
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
        padding: theme.spacing(2),
        backgroundColor: theme.palette.primary.background,
        borderRadius: 8,
    },
    gridItemBoxInner: {
        padding: isMobileAndTablet() ? 15 : 30,
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
    textField: {
        width: 300,
        marginTop: 10,
    },
    registerButton: {
        color: '#fff',
        backgroundColor: theme.palette.primary.main,
        textTransform: 'none',
        fontSize: 14,
        width: 300,
        marginTop: 10,
    },
});

@connect(mapStateToProps, mapDispatchToProps)
class LoginView extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: true,
        };
    }

    componentDidMount() {}

    componentWillReceiveProps(nextProps) {}

    shouldComponentUpdate(nextProps, nextState) {
        if (nextState === this.state) {
            return false;
        }
        return true;
    }

    render() {
        const { classes } = this.props;
        const {
            loading,
        } = this.state;

        return (
            <div className={classes.appFrame}>
                <Grid container alignItems="center" justify="center" className={classes.root} spacing={2}>
                    <Grid item xs={isMobileAndTablet() ? 12 : 8}>
                        <Paper className={classes.content}>
                            <div className={classes.gridItemBoxInner}>
                                <div style={{ cursor: 'pointer', margin: 'auto', textAlign: 'center' }}>
                                      <img alt="ae_logo" height="40px" width="auto" src="/src/containers/App/styles/img/logo-named.png" />
                                </div>
                                <div style={{ textAlign: 'center', paddingTop: 20 }}>
                                    {loading
                                      ? (<CircularProgress style={{marginBottom: 15}} color="inherit" />)
                                      : null}
                                    <h4 style={{ fontWeight: 300, fontSize: 20, paddingBottom: 15 }}>{loading ? `Creating your ${'Request'}...` : 'Please login in to your account'}</h4>
                                    <div className={classes.divider} >
                                        <div className={classes.dividerLine} />
                                    </div>
                                </div>
                            </div>
                        </Paper>
                    </Grid>
                </Grid>
            </div>
        );
    }
}

LoginView.defaultProps = {};

LoginView.propTypes = {};

export default withStyles(styles)(LoginView);
