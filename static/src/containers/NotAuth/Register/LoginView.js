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
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import CircularProgress from '@material-ui/core/CircularProgress';

import { loginEmployee, forgotPassword } from '../../../services/app/actions';
import { isMobileAndTablet } from '../../../utils/isMobileAndTablet';
import { validateEmail, dispatchNewRoute, getRegistrationSearch } from '../../../utils/misc';

function mapStateToProps(state) {
    return {
        search: state.router.location.search,
        statusText: state.app.statusText,
        isAuthenticating: state.app.isAuthenticating,
        isAuthenticated: state.app.isAuthenticated,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: {
            loginEmployee: bindActionCreators(loginEmployee, dispatch),
            // forgotPassword: bindActionCreators(forgotPassword, dispatch),
        },
    };
}

const styles = theme => ({
    root: {
        flexGrow: 1,
        background: theme.palette.primary.background,
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
        backgroundColor: theme.palette.primary.appBar,
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
            email: '',
            password: '',
            email_error_text: null,
            password_error_text: null,
            disabled: true,
            forgotDisabled: true,
            showDialog: false,
            redirectRoute: '/',
            loading: false,
            showEmail: false,
        };
    }

    componentDidMount() {
        const { search } = this.props;
        const keys = getRegistrationSearch(search);
        const next_state = this.state;
        if (search !== '') {
            let next = search;
            if (next !== '?_sc=true') {
                next = next.split('?next=').pop(-1);
                next_state.redirectRoute = next;
            }
        }
        const demo = keys.demo;
        switch(demo) {
          case 'retailer':
              next_state.email = 'hcp@test.com';
              next_state.password ='123456';
              break;
          case 'manufacturer':
              next_state.email = 'manu@test.com';
              next_state.password ='123456';
              break;
          case 'financier':
              next_state.email = 'fin@test.com';
              next_state.password ='123456';
              break;
          default:
              break;
        }
        console.warn(next_state);
        // this.setState(next_state, () => {});
    }

    componentWillReceiveProps(nextProps) {
        if (!nextProps.isAuthenticated && this.props.isAuthenticating) {
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

    isDisabled() {
        let email_is_valid = false;
        let password_is_valid = false;

        if (this.state.email === '') {
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

        if (this.state.password === '' || !this.state.password) {
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

        if (email_is_valid && password_is_valid) {
            this.setState({
                disabled: false,
            });
        }
    }

    toggleForgotPassword = (showDialog) => {
        this.setState({
            showDialog: showDialog,
        });
    }

    changeValue(e, type) {
        const value = e.target.value;
        const next_state = {};
        next_state[type] = value;
        this.setState(next_state, () => {
            this.isDisabled();
        });
    }

    _handleKeyPress(e) {
        if (e.key === 'Enter') {
            if (!this.state.disabled) {
                this.login(e);
            }
        }
    }

    login(e) {
        e.preventDefault();
        this.setState({ loading: true });
        this.props.actions.loginEmployee(this.state.email, this.state.password, this.state.redirectRoute);
    }

    changeForgotPasswordValue(e, type) {
        const value = e.target.value;
        const next_state = {};
        next_state[type] = value;
        this.setState(next_state, () => {
            this.isForgotPasswordDisabled();
        });
    }

    isForgotPasswordDisabled() {
        let email_is_valid = false;

        if (this.state.email === '') {
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
        if (email_is_valid) {
            this.setState({
                forgotDisabled: false,
            });
        }

    }

    forgotPasswordPressed = (e) => {
        const { actions } = this.props;
        const { email } = this.state;
        e.preventDefault();
        actions.forgotPassword(email)
    }

    emailSignup = () => {
        this.setState({showEmail: true})
    }

    dispatchNewRoute = (e) => {
        e.preventDefault();
        dispatchNewRoute('/register');
    }

    render() {
        const { classes } = this.props;
        const {
            email,
            email_error_text,
            password,
            password_error_text,
            disabled,
            showDialog,
            loading,
            showEmail,
        } = this.state;

        const ForgotComponent = (
            <div className={classes.forgotPasswordLabel} onClick={e => this.toggleForgotPassword(!showDialog)}>Forgot</div>
        )

        const LoginAccountContainer = (
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
                        value={email}
                        variant="outlined"
                        autoComplete="username email"
                        className={classes.textField}
                        helpertext={email_error_text}
                        onChange={e => this.changeValue(e, 'email')}
                    />
                    < br/>
                    <TextField
                        placeholder="Password"
                        label="Password"
                        type="password"
                        value={password}
                        variant="outlined"
                        autoComplete="current-password"
                        className={classes.textField}
                        helpertext={password_error_text}
                        onChange={e => this.changeValue(e, 'password')}
                        InputProps={{
                            endAdornment: ForgotComponent,
                        }}
                    />
                    < br/>
                    <Button
                        disableRipple
                        disableFocusRipple
                        disabled={disabled}
                        onClick={e => this.login(e)}
                        className={classes.registerButton}
                        variant="outlined"
                    >
                        {'Login'}
                    </Button>
                </div>
              ) : (
                <div>
                    <a style={{cursor: 'pointer'}} onClick={e => this.emailSignup(e)}><img alt="google_signup" height="48px" width="300px" src="/src/containers/App/styles/img/email.png" /></a>
                </div>
              )
            }
            </div>
            <div style={{ margin: 'auto', width: '50%' }}>
                <p onClick={e => this.dispatchNewRoute(e, '/register')} style={{ fontSize: 14, textAlign: 'center', paddingTop: 20, cursor: 'pointer', color: 'blue'}}>Don't have an account?</p>
            </div>
            </section>
        );

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
                                    <h4 style={{ fontWeight: 300, fontSize: 20, paddingBottom: 15 }}>{loading ? 'Logging into your account...' : 'Please login in to your account'}</h4>
                                    <div className={classes.divider} >
                                        <div className={classes.dividerLine} />
                                    </div>
                                </div>
                                {!loading ? LoginAccountContainer : null}
                            </div>
                        </Paper>
                    </Grid>
                </Grid>
            </div>
        );
    }
}

LoginView.defaultProps = {
    search: '',
    loginEmployee: f => f,
    forgotPassword: f => f,
};

LoginView.propTypes = {
    search: PropTypes.string,
    loginEmployee: PropTypes.func,
    forgotPassword: PropTypes.func,
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(LoginView);

// <Dialog
//     open={showDialog}
//     onClose={e => this.toggleForgotPassword(false)}
//     aria-labelledby="form-dialog-title"
// >
//     <DialogTitle id="form-dialog-title">Reset Password</DialogTitle>
//     <DialogContent>
//         <DialogContentText>
//                 Please enter your email address to reset your password.
//         </DialogContentText>
//         <label className={classes.inputLabel}>Email</label>
//         <div className={classes.text}>
//             <TextField
//                 type="email"
//                 variant="outlined"
//                 fullWidth={true}
//                 helpertext={this.state.email_error_text}
//                 onChange={e => this.changeForgotPasswordValue(e, 'email')}
//             />
//         </div>
//         <DialogActions>
//             <Button onClick={this.forgotPasswordPressed} color="primary" disabled={this.state.forgotDisabled}>
//                   Send Reset Link
//             </Button>
//         </DialogActions>
//     </DialogContent>
// </Dialog>
