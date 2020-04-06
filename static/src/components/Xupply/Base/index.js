/* eslint camelcase: 0, no-underscore-dangle: 0 */
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';

import history from '../../../history';

import { logoutAndRedirect } from '../../../services/app/actions';
import { isMobileAndTablet } from '../../../utils/isMobileAndTablet';
import { dispatchNewRoute, parseLabel } from '../../../utils/misc';

import { version } from '../../../../package.json';

const styles = theme => ({
    root: {
        flexGrow: 1,
        height: '100%',
        background: 'linear-gradient(to right, #000000 0%, #79bac1 100%, #79bac1 100%, #79bac1 100%)',
    },
    appFrame: {
        zIndex: 1,
        overflow: 'hidden',
        position: 'relative',
        display: 'flex',
        width: '100%',
    },
    appBar: {
        // zIndex: theme.zIndex.drawer + 1,
        paddingRight: 64,
        paddingLeft: 64,
        background: 'linear-gradient(to right, #000000 0%, #79bac1 100%, #79bac1 100%, #79bac1 100%)',
    },
    toolbar: theme.mixins.toolbar,
    content: {
        height: '100%',
        flexGrow: 1,
        background: 'linear-gradient(to right, #000000 0%, #79bac1 100%, #79bac1 100%, #79bac1 100%)',
    },
    sectionDesktop: {
        display: 'none',
        [theme.breakpoints.up('md')]: {
            display: 'flex',
        },
        sectionMobile: {
            display: 'flex',
            [theme.breakpoints.up('md')]: {
                display: 'none',
            },
        },
    },
    signUpButton: {
        color: '#202020',
        fontWeight: 600,
        backgroundColor: theme.palette.primary.background,
        textTransform: 'none',
        fontSize: 14,
    },
    footer: {
        background: 'linear-gradient(to right, #000000 0%, #79bac1 100%, #79bac1 100%, #79bac1 100%)',
        color: '#ffffff',
        fontSize: 12,
        lineHeight: 2,
        marginTop: 20,
        paddingBottom: 20,
        textAlign: 'center',
        position: 'fixed',
        bottom: 0,
        width: '100%'
    },
    footerMain: {
        textAlign: 'left',
    },
    footerBottom: {
        marginTop: '5.4rem',
        textAlign: 'center',
        fontSize: 14,
    },
    row: {
        margin: '0 auto',
    },
    listItem: {
        fontSize: 16,
        zIndex: 5,
        color: '#fff',
        paddingRight: 10,
    },
    selectedItem: {
        fontSize: 16,
        zIndex: 5,
        color: theme.palette.primary.secondary,
        paddingRight: 10,
        borderBottom: 2,
        borderStyle: 'solid',
        borderfColor: theme.palette.primary.secondary,
        // backgroundColor: theme.palette.primary.appBar,
    },
    accountBox: {
        position: 'fixed',
        top: 70,
        right: 20,
        background: '#fff',
        border: 1,
        width: 325,
        height: 'auto',
        borderRadius: 8,
        zIndex: 999999,
    },
    accountBoxHeading: {
        padding: 20,
        fontWeight: 'bold',
        color: '#fff',
        zIndex: 2,
    },
    img: {
        borderRadius: '50%',
        float: 'left',
    },
});

function mapStateToProps(state) {
    return {
        pathname: state.router.location.pathname,
        email: state.app.email,
        displayName: state.app.displayName,
        accountType: state.app.accountType,
        isAccountLoaded: state.accountData.account.isLoaded,
        isAuthenticated: state.app.isAuthenticated,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: {
            logoutAndRedirect: bindActionCreators(logoutAndRedirect, dispatch),
        },
    };
}

@connect(mapStateToProps, mapDispatchToProps)
class Base extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isMobileAndTablet: isMobileAndTablet(),
            baseDomain: '/accounts/',
            breadcrumb: 'account',
            listItems: [],
            showAccount: false,
        };
    }

    componentDidMount() {
        this.getBreadcrumb();
    }

    componentWillReceiveProps(nextProps) {}

    componentWillUnmount() { }

    getBreadcrumb(props = this.props) {
        const { pathname, accountType } = this.props;
        if (pathname) {
            const vars = pathname.split('/');
            let locationName = [];
            for (let i = 0; i < vars.length; i++) {
                if (vars[i] !== '' && vars[i] !== '/' && vars[i].charAt(0) !== '-') {
                    locationName.push(vars[i]);
                }
            }
            var listItems = [];
            switch (accountType) {
                case 'retailer':
                    listItems = [
                        'requests',
                    ]
                    break;
                case 'manufacturer':
                    listItems = [
                        'requests',
                        'orders',
                        'menuItems',
                    ]
                    break;
                case 'financier':
                    listItems = [
                        'opportunities',
                    ]
                    break;
                default:
                    listItems = [
                        'locations',
                        'requests',
                        'orders',
                        'menuItems',
                        'employees',
                    ]
                    break;
            }
            this.setState({
                listItems: listItems,
                breadcrumb: locationName[2],
                childBreadcrumb: locationName[3],
                baseDomain: `/accounts/${locationName[1]}`,
            });
        }
    }

    // REFACTOR FOR PROD
    parseURL = (item) => {
        const { baseDomain } = this.state;
        switch (item) {
        case 'locations':
            return `${baseDomain}/locations`;
        case 'requests':
            return `${baseDomain}/requests`;
        case 'orders':
            return `${baseDomain}/orders`;
        case 'menuItems':
            return `${baseDomain}/menuItems`;
        case 'employees':
            return `${baseDomain}/employees`;
        case 'opportunities':
            return `${baseDomain}/opportunities`;
        default:
            return `unknown`;
        }
    }

    // REFACTOR FOR PROD
    renderListItems = (item) => {
        const { classes } = this.props;
        const { breadcrumb } = this.state;
        const route = this.parseURL(item);
        return (
            <IconButton
                key={item}
                disableRipple
                disableFocusRipple
                className={breadcrumb === `${item}` ? classes.selectedItem : classes.listItem}
                onClick={e => this.dispatchNewRoute(e, route)}
            >
                {parseLabel(item)}
            </IconButton>
        );
    }

    dispatchNewRoute(e, route) {
        e.preventDefault();
        history.push(route);
    }

    logout(e) {
        e.preventDefault();
        this.props.actions.logoutAndRedirect('userID', '/login');
        this.setState({
            showAlert: false,
            showAccount: false,
        });
    }

    toggleAccount(showAccount) {
        this.setState({showAccount});
    }

    render() {
        const {
            classes,
            pathname,
            isAuthenticated,
            displayName,
            accountType,
            email,
        } = this.props;
        const {
            listItems,
            isMobileAndTablet,
            showAccount,
        } = this.state;

        const MainAppBar = (
            <AppBar
                position="fixed"
                className={classes.appBar}
                elevation={0}
            >
                <Toolbar>
                    <a href="https://caslnpo.org"><img alt="ae_logo" height="40px" width="auto" src="/src/containers/App/styles/img/logo-light-named.png" /></a>
                    <div className={classes.sectionDesktop}>
                    {
                      isAuthenticated ?
                      (
                        listItems.length > 0
                        ? listItems.map(this.renderListItems, this)
                        : null
                      ) : (
                        <section>
                        <IconButton
                          onClick={e => dispatchNewRoute('/valor')}
                        >
                            <div style={{ paddingLeft: 10, fontWeight: 500, fontSize: 16, color: '#fff' }}>
                                The Wall
                          </div>
                        </IconButton>
                        <IconButton
                          onClick={e => dispatchNewRoute('/map')}
                        >
                            <div style={{ paddingLeft: 10, fontWeight: 500, fontSize: 16, color: '#fff' }}>
                                Map
                          </div>
                        </IconButton>
                        </section>
                      )
                    }
                    </div>
                    <div className={classes.root} />
                    <div className={classes.sectionDesktop}>
                        <IconButton
                            onClick={e => this.toggleAccount(!showAccount)}
                        >
                            <div style={{ fontSize: 14, color: '#fff' }}>
                                <i class="fa fa-globe"></i>
                                <span style={{ marginLeft: 8 }}>EN</span>
                            </div>
                        </IconButton>
                    </div>
                    <div className={classes.sectionDesktop}>
                        <IconButton
                            onClick={isAuthenticated ? e => this.logout(e) : e => dispatchNewRoute('/login')}
                        >
                            <div style={{ fontSize: 14, color: '#fff' }}>
                                <i class="fa fa-user"></i>
                                <span style={{ marginLeft: 8 }}>{!isAuthenticated ? 'Log In' : 'Log Out'}</span>
                            </div>
                        </IconButton>
                    </div>
                    {
                      !isAuthenticated ?
                      (
                        <div className={classes.sectionDesktop}>
                            <Button
                                variant="contained"
                                disableRipple
                                disableFocusRipple
                                className={classes.signUpButton}
                                onClick={e => dispatchNewRoute('/register')}
                            >
                                {'Sign up'}
                            </Button>
                        </div>
                      ) : null
                    }
                </Toolbar>
            </AppBar>
        );

        const Account = (
            <Paper className={classes.accountBox} style={{ overflow: 'auto' }}>
                <div className={classes.accountBoxHeading}>
                    <div style={{ display: 'block' }}>
                        <img style={{ display: 'inline-block', position: 'relative' }} alt="image" height="60" width="60" className={classes.img} src={'/src/containers/App/styles/img/temp_anon.jpg'} />
                        <div style={{ display: 'inline-block' }}>
                            <div style={{ paddingLeft: 10, color: '#000000', fontSize: '1.0em' }}><strong><em>{displayName}</em></strong></div>
                            <div style={{ paddingLeft: 10, color: 'gray', fontSize: '1.0em' }}><em>{email}</em></div>
                            <div style={{ paddingLeft: 10, color: '#82a4bc', fontSize: '1.0em' }}><a onClick={e => this.dispatchNewRoute('/privacy')}><strong><em>{accountType}</em></strong></a></div>
                            <div style={{ paddingLeft: 10, color: '#82a4bc', fontSize: '1.0em' }}><strong><em><span>{version}</span></em></strong></div>
                        </div>
                    </div>
                </div>
                <div className={classes.accountBoxHeading}>
                    <div style={{ textAlign: 'center' }}>
                        <Button onClick={e => this.logout(e)}>
                          Sign Out
                        </Button>
                    </div>
                </div>
            </Paper>
        );

        return (
            <div className={classes.root}>
                <div className={classes.appFrame}>
                    {MainAppBar}
                    {showAccount && isAuthenticated ? Account : null}
                    <div className={classes.content}>
                        <div className={classes.toolbar} />
                        {this.props.children}
                    </div>
                </div>
            </div>
        );
    }
}

Base.defaultProps = {
    displayName: '',
    email: '',
};
Base.propTypes = {
    pathname: PropTypes.string,
    displayName: PropTypes.string,
    email: PropTypes.string,
    logoutAndRedirect: PropTypes.func,
    classes: PropTypes.object.isRequired,
    children: PropTypes.object.isRequired,
};

export default withStyles(styles)(Base);
// <div className={classes.footer}>
//     <span>©2020 Clean Alternative. Sustainable. Life. 501(c)(3) All rights reserved.</span>
// </div>
