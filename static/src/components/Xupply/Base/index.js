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
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Link from '@material-ui/core/Link';
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
import Collapse from '@material-ui/core/Collapse';
import ShopTwoIcon from '@material-ui/icons/ShopTwo';
import LocalOfferIcon from '@material-ui/icons/LocalOffer';
import MenuBookIcon from '@material-ui/icons/MenuBook';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import DashboardIcon from '@material-ui/icons/Dashboard';
import LockIcon from '@material-ui/icons/Lock';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import SupervisedUserCircleIcon from '@material-ui/icons/SupervisedUserCircle';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';

import history from '../../../history';

import { logoutAndRedirect } from '../../../services/app/actions';
import { isMobileAndTablet } from '../../../utils/isMobileAndTablet';
import { dispatchNewRoute, parseLabel, validateVarChar } from '../../../utils/misc';

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
        backgroundColor: theme.palette.primary.appBar,
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
        backgroundColor: theme.palette.primary.background,
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
      backgroundColor: theme.palette.primary.appBar,
      color: theme.palette.primary.main,
      width: drawerWidth,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    drawerClose: {
      backgroundColor: theme.palette.primary.appBar,
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
        // color: theme.palette.primary.main,
    },
    breadCont: {
        marginBottom: 15,
        display: 'inline-block'
    },
    breadLink: {
        // color: '#eee !important',
        cursor: 'pointer',
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
            locationNames: [],
            showDrawer: true,
            showAccount: false,
            showManage: true,
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
            let locationNames = [];
            for (let i = 0; i < vars.length; i++) {
                if (vars[i] !== '' && vars[i] !== '/' && vars[i].charAt(0) !== '-') {
                    locationNames.push(vars[i]);
                }
            }
            var listItems = [];
            switch (accountType) {
                case 'retailer':
                    listItems = [
                        'dashboard',
                        'requests',
                        'menuItems',
                        'manage',
                    ]
                    break;
                case 'manufacturer':
                    listItems = [
                        'dashboard',
                        'orders',
                        'menuItems',
                        'requests',
                        'manage',
                    ]
                    break;
                case 'financier':
                    listItems = [
                        'dashboard',
                        'opportunities',
                        'manage',
                    ]
                    break;
                default:
                    listItems = [
                        'requests',
                        'orders',
                        'menuItems',
                        'manage',
                    ]
                    break;
            }
            console.log(listItems)
            console.log(locationNames)
            this.setState({
                listItems: listItems,
                breadcrumb: locationNames[2],
                breadcrumbChild: locationNames[3],
                locationNames,
                baseDomain: `/accounts/${locationNames[1]}`,
            });
        }
    }

    // REFACTOR FOR PROD
    parseURL = (item) => {
        const { baseDomain } = this.state;
        switch (item) {
        case 'dashboard':
            return `${baseDomain}/dashboard`;
        case 'requests':
            return `${baseDomain}/requests`;
        case 'orders':
            return `${baseDomain}/orders`;
        case 'menuItems':
            return `${baseDomain}/menuItems`;
        case 'opportunities':
            return `${baseDomain}/opportunities`;
        case 'locations':
            return `${baseDomain}/locations`;
        case 'employees':
            return `${baseDomain}/employees`;
        }
        return baseDomain;
    }

    // REFACTOR FOR PROD
    parseLinkIcon = (item) => {
        switch (item) {
        case 'dashboard':
            return <DashboardIcon />;
        case 'requests':
            return <LocalOfferIcon />;
        case 'orders':
            return <ShopTwoIcon />;
        case 'menuItems':
            return <MenuBookIcon />;
        case 'opportunities':
            return <AttachMoneyIcon />;
        case 'manage':
            return <LockIcon />;
        case 'locations':
            return <LocationOnIcon />;
        case 'employees':
            return <SupervisedUserCircleIcon />;
        }
        return <AttachMoneyIcon />;
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

    toggleListItem = () => {
        const { showManage } = this.state;
        this.setState({showManage: !showManage});
    }

    renderBreadcrumb = (currentBC) => {
        const {
            classes,
        } = this.props;
        const {
            breadcrumb,
            breadcrumbChild,
            baseDomain,
        } = this.state;
        switch (currentBC) {
          case 'accounts':
            return (
                <Link key={currentBC} className={classes.breadLink} onClick={e => this.dispatchNewRoute(e, `${baseDomain}/dashboard`)}>
                    Dashboard
                </Link>
            );
            break;
          case 'requests':
            return (
              <Link key={currentBC} className={classes.breadLink} onClick={e => this.dispatchNewRoute(e, `${baseDomain}/${breadcrumb}`)}>
                  Requests
              </Link>
            )
            break;
          case 'orders':
            return (
              <Link key={currentBC} className={classes.breadLink} onClick={e => this.dispatchNewRoute(e, `${baseDomain}/${breadcrumb}`)}>
                  Orders
              </Link>
            )
            break;
          case 'opportunities':
            return (
              <Link key={currentBC} className={classes.breadLink} onClick={e => this.dispatchNewRoute(e, `${baseDomain}/${breadcrumb}`)}>
                  opportunities
              </Link>
            )
            break;
          case 'menuItems':
            return (
              <Link key={currentBC} className={classes.breadLink} onClick={e => this.dispatchNewRoute(e, `${baseDomain}/${breadcrumb}`)}>
                  Menu Items
              </Link>
            )
            break;
          case 'locations':
            return (
              <Link key={currentBC} className={classes.breadLink} onClick={e => this.dispatchNewRoute(e, `${baseDomain}/${breadcrumb}`)}>
                  Locations
              </Link>
            )
            break;
          case 'employees':
            return (
              <Link key={currentBC} className={classes.breadLink} onClick={e => this.dispatchNewRoute(e, `${baseDomain}/${breadcrumb}`)}>
                  Employees
              </Link>
            )
            break;
          case 'create':
            return (
                <Link key={currentBC} className={classes.breadLink} onClick={e => this.dispatchNewRoute(e, `${baseDomain}/${breadcrumb}/create`)}>
                    Create
                </Link>
            );
            break;
          default:
            if (breadcrumbChild === currentBC) {
                return (
                    <Link key={currentBC} className={classes.breadLink} onClick={e => this.dispatchNewRoute(e, `${baseDomain}/${breadcrumb}/${breadcrumbChild}`)}>
                        Details
                    </Link>
                );
            }
            break;
        }
    }

    renderListItem = (item) => {
        const { classes } = this.props;
        const { showManage } = this.state;
        if (item === 'manage') {
            return (
                <section>
                    <Divider style={{backgroundColor: '#dadada'}} />
                    <List>
                        <ListItem onClick={e => this.toggleListItem(e)} button key={item}>
                          <ListItemText primary={item} />
                          {showManage ? <ExpandLess /> : <ExpandMore />}
                        </ListItem>
                        <Collapse in={showManage} timeout="auto" unmountOnExit>
                          <List component="div" disablePadding>
                            <ListItem button key={'locations'} onClick={e => this.dispatchNewRoute(e, this.parseURL('locations'))}>
                              <ListItemIcon>
                                <ListItemIcon className={classes.icon}>{this.parseLinkIcon('locations')}</ListItemIcon>
                              </ListItemIcon>
                              <ListItemText primary={'locations'} />
                            </ListItem>
                            <ListItem button key={'employees'} onClick={e => this.dispatchNewRoute(e, this.parseURL('employees'))}>
                              <ListItemIcon>
                                <ListItemIcon className={classes.icon}>{this.parseLinkIcon('employees')}</ListItemIcon>
                              </ListItemIcon>
                              <ListItemText primary={'employees'} />
                            </ListItem>
                          </List>
                        </Collapse>
                    </List>
                </section>
            );
        }
        return (
            <section>
                <Divider style={{backgroundColor: '#dadada'}} />
                <List>
                    <ListItem onClick={e => this.dispatchNewRoute(e, this.parseURL(item))} button key={item}>
                      <ListItemIcon className={classes.icon}>{this.parseLinkIcon(item)}</ListItemIcon>
                      <ListItemText primary={item} />
                    </ListItem>
                </List>
            </section>
        );
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
            locationNames,
            breadcrumb,
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
                      <a><img alt="ae_logo" height="40px" width="auto" src="/src/containers/App/styles/img/logo-named.png" /></a>
                    ) : null}
                    <div className={classes.sectionDesktop} />
                    <div className={classes.root} />
                    <div className={classes.sectionDesktop}>
                        <IconButton
                            style={{backgroundColor: '#fff' }}
                            onClick={e => this.toggleAccount(!showAccount)}
                        >
                            <div style={{ fontSize: 14 }}>
                                <i class="fa fa-globe"></i>
                                <span style={{ marginLeft: 8 }}>EN</span>
                            </div>
                        </IconButton>
                    </div>
                    <div className={classes.sectionDesktop}>
                        <IconButton
                            style={{backgroundColor: '#fff' }}
                            onClick={isAuthenticated ? e => this.logout(e) : e => dispatchNewRoute('/login')}
                        >
                            <div style={{ fontSize: 14 }}>
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
                      elevation={5}
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
                          {showDrawer ? <img style={{paddingLeft: 20}} alt="ae_logo" height="40px" width="auto" src="/src/containers/App/styles/img/logo-named.png" /> : null}
                        </IconButton>
                      </div>
                      {listItems.map(this.renderListItem, this)}
                    </Drawer>
                    {showAccount && isAuthenticated ? Account : null}
                    <div className={classes.content}>
                        <div className={classes.toolbar} />
                        <div className={classes.breadCont}>
                        <Typography color="primary" style={{fontSize: 24}}>{breadcrumb}</Typography>
                        <Breadcrumbs aria-label="breadcrumb">
                            {locationNames.map(this.renderBreadcrumb, this)}
                        </Breadcrumbs>
                        </div>
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
