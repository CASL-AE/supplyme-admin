/* eslint camelcase: 0, no-underscore-dangle: 0 */
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import clsx from 'clsx';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Drawer from '@material-ui/core/Drawer';
import Toolbar from '@material-ui/core/Toolbar';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ClearAllIcon from '@material-ui/icons/ClearAll';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';

import history from '../../../history';

import { logoutAndRedirect } from '../../../services/app/actions';
import { isMobileAndTablet } from '../../../utils/isMobileAndTablet';
import { dispatchNewRoute, parseLabel } from '../../../utils/misc';

import { version } from '../../../../package.json';

const drawerWidth = 240;

const styles = theme => ({
    root: {
        flexGrow: 1,
    },
    appFrame: {
        zIndex: 1,
        height: '100vh',
        overflow: 'hidden',
        position: 'relative',
        display: 'flex',
        width: '100%',
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
        backgroundColor: '#333333',
        // background: 'linear-gradient(to right, #000000 0%, #79bac1 100%, #79bac1 100%, #79bac1 100%)',
    },
    appBarShift: {
      marginLeft: drawerWidth,
      paddingLeft: 0,
      width: `calc(100% - ${drawerWidth}px)`,
      transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    toolbar: theme.mixins.toolbar,
    content: {
        flexGrow: 1,
        overflow: 'scroll',
        backgroundColor: '#202020',
        // background: 'linear-gradient(to right, #000000 0%, #79bac1 100%, #79bac1 100%, #79bac1 100%)',
        padding: isMobileAndTablet() ? 0 : theme.spacing(3),
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
    menuButton: {
      color: '#25fde2',
      marginRight: 18,
    },
    hide: {
      display: 'none',
    },
    signUpButton: {
        color: '#202020',
        fontWeight: 600,
        backgroundColor: theme.palette.primary.background,
        textTransform: 'none',
        fontSize: 14,
    },
    footer: {
        // background: 'linear-gradient(to right, #000000 0%, #79bac1 100%, #79bac1 100%, #79bac1 100%)',
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
        borderColor: theme.palette.primary.secondary,
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
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
      whiteSpace: 'nowrap',
    },
    drawerOpen: {
      backgroundColor: '#202020',
      color: theme.palette.primary.main,
      width: drawerWidth,
      borderColor: '#eeeeee54',
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    drawerClose: {
      backgroundColor: '#202020',
      color: theme.palette.primary.main,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      overflowX: 'hidden',
      width: theme.spacing(7) + 1,
      [theme.breakpoints.up('sm')]: {
        width: theme.spacing(9) + 1,
      },
    },
    icon: {
        color: theme.palette.primary.main,
    }
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
            showDrawer: true,
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
                        'orders',
                        'menuItems',
                        'requests',
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
        case 'requests':
            return `${baseDomain}/requests`;
        case 'create_request':
            return `${baseDomain}/requests/create/beta`;
        case 'search_requests':
            return `${baseDomain}/requests/search`;
        case 'orders':
            return `${baseDomain}/orders`;
        case 'menuItems':
            return `${baseDomain}/menuItems`;
        case 'create_menuItem':
            return `${baseDomain}/menuItems/create/beta`;
        case 'opportunities':
            return `${baseDomain}/opportunities`;
        }
        return baseDomain;
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

    handleDrawerClose = () => {
        this.setState({showDrawer: false});
    }

    handleDrawerOpen = () => {
        this.setState({showDrawer: true});
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
            baseDomain,
            showDrawer,
            showAccount,
        } = this.state;

        const MainAppBar = (
            <AppBar
                position="fixed"
                className={clsx(classes.appBar, {
                  [classes.appBarShift]: showDrawer,
                })}
                elevation={0}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={this.handleDrawerOpen}
                        edge="start"
                        className={clsx(classes.menuButton, {
                          [classes.hide]: showDrawer,
                        })}
                    >
                      <MenuIcon />
                    </IconButton>
                    {!showDrawer
                    ? (
                      <a><img alt="ae_logo" height="40px" width="auto" src="/src/containers/App/styles/img/logo-light-named.png" /></a>
                    ) : null}
                    <div className={classes.sectionDesktop}></div>
                    <div className={classes.root} />
                    <div className={classes.sectionDesktop}>
                    <IconButton
                      onClick={e => dispatchNewRoute(`${baseDomain}/locations`)}
                    >
                        <div style={{ paddingLeft: 10, fontWeight: 500, fontSize: 16, color: '#fff' }}>
                            Locations
                      </div>
                    </IconButton>
                    <IconButton
                      onClick={e => dispatchNewRoute(`${baseDomain}/employees`)}
                    >
                        <div style={{ paddingLeft: 10, fontWeight: 500, fontSize: 16, color: '#fff' }}>
                            Employees
                      </div>
                    </IconButton>
                    </div>
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
                    <Drawer
                      variant="permanent"
                      className={clsx(classes.drawer, {
                        [classes.drawerOpen]: showDrawer,
                        [classes.drawerClose]: !showDrawer,
                      })}
                      classes={{
                        paper: clsx({
                          [classes.drawerOpen]: showDrawer,
                          [classes.drawerClose]: !showDrawer,
                        }),
                      }}
                    >
                      <div className={classes.toolbar}>
                        <IconButton className={classes.icon} onClick={this.handleDrawerClose}>
                          {showDrawer ? <ChevronLeftIcon /> : null}
                          {showDrawer ? <img style={{paddingLeft: 20}} alt="ae_logo" height="40px" width="auto" src="/src/containers/App/styles/img/logo-light-named.png" /> : null}
                        </IconButton>
                      </div>
                      <Divider style={{backgroundColor: '#eeeeee54'}} />
                      <List>
                        {['requests'].map((text, index) => (
                          <ListItem onClick={e => this.dispatchNewRoute(e, this.parseURL(text))} button key={text}>
                            <ListItemIcon className={classes.icon}>{index % 2 === 0 ? <ClearAllIcon /> : <AddCircleOutlineIcon />}</ListItemIcon>
                            <ListItemText primary={text} />
                          </ListItem>
                        ))}
                      </List>
                      <Divider style={{backgroundColor: '#eeeeee54'}} />
                      <List>
                        {['orders'].map((text, index) => (
                          <ListItem onClick={e => this.dispatchNewRoute(e, this.parseURL(text))} button key={text}>
                            <ListItemIcon className={classes.icon}>{index % 2 === 0 ? <ClearAllIcon /> : <AddCircleOutlineIcon />}</ListItemIcon>
                            <ListItemText primary={text} />
                          </ListItem>
                        ))}
                      </List>
                      <Divider style={{backgroundColor: '#eeeeee54'}} />
                      <List>
                        {['menuItems'].map((text, index) => (
                          <ListItem onClick={e => this.dispatchNewRoute(e, this.parseURL(text))} button key={text}>
                            <ListItemIcon className={classes.icon}>{index % 2 === 0 ? <ClearAllIcon /> : <AddCircleOutlineIcon />}</ListItemIcon>
                            <ListItemText primary={text} />
                          </ListItem>
                        ))}
                      </List>
                    </Drawer>
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
