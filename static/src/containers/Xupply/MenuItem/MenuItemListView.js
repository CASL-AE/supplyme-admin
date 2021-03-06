/* eslint camelcase: 0, no-underscore-dangle: 0 */
import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import LineStyleIcon from '@material-ui/icons/LineStyle';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';

import RetailerMenuItemResultsTable from '../../../components/Xupply/MenuItem/RetailerMenuItemResultsTable';
import ManuMenuItemResultsTable from '../../../components/Xupply/MenuItem/ManuMenuItemResultsTable';
import MenuItemCard from '../../../components/Xupply/MenuItem/MenuItemCard';
import EmptyResults from '../../../components/Xupply/Base/EmptyResults';

import { validateString, dispatchNewRoute, filterBy } from '../../../utils/misc';
import { fetchMenuItems } from '../../../services/menuItem/actions';
import { getMenuItemFromSnapshot } from '../../../services/menuItem/model';
import { isMobileAndTablet } from '../../../utils/isMobileAndTablet';

const styles = (theme) => ({
    root: {
        flexGrow: 1,
        padding: isMobileAndTablet() ? 0 : 30,
    },
    content: {
        paddingTop: 42,
        paddingBottom: 42,
        paddingLeft: 80,
        paddingRight: 80,
    },
    outerCell: {
        marginBottom: 80,
    },
    headerCell: {
        display: 'block',
    },
    firstButton: {
        marginTop: 28,
        color: '#ffffff',
        backgroundColor: theme.palette.primary.main,
        textTransform: 'none',
    },
    buttonLabel: {
        padding: 3,
    },
    fab: {
        position: 'absolute',
        bottom: theme.spacing(2),
        right: theme.spacing(2),
    },
});

function mapStateToProps(state) {
    return {
        router: state.router,
        idToken: state.app.idToken,
        employeeID: state.app.employeeID,
        accountID: state.app.accountID,
        accountType: state.app.accountType,
        menuItems: state.menuItemData.menuItems,
        receivedAt: state.menuItemData.receivedAt,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: {
            fetchMenuItems: bindActionCreators(fetchMenuItems, dispatch)
        },
    };
}

@connect(mapStateToProps, mapDispatchToProps)
class MenuItemListView extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            menuItem: {},
            showMenuItemDialog: false,
            menuItems: [],
            fMenuItems: [],
        };
    }

    componentDidMount() {
        console.log('MenuItems View Mounted');
        const { receivedAt, menuItems } = this.props;
        if (receivedAt === null) {
            this.loadCompData();
        } else {
            this.receiveMenuItems(menuItems);
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.receivedAt !== null && this.props.receivedAt === null) {
            this.receiveMenuItems(nextProps.menuItems);
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (nextState === this.state) {
            return false;
        }
        return true;
    }

    componentDidUpdate() {
        console.log('MenuItems View Updated');
    }

    componentWillUnmount() {
        console.log('MenuItems View UnMounted');
        const { actions } = this.props;
        // actions.unmountMenuItemListener();
        this.receiveMenuItems = undefined;
        this.loadCompData = undefined;
        this.render = undefined;
    }

    receiveMenuItems = (menuItems) => {
        console.warn('Received MenuItems');
        const fMenuItems = filterBy(menuItems);
        var newItems = [];
        for (var i = 0; i < fMenuItems.length; i++) {
            for (var q = 0; q < fMenuItems[i].quantities.length; q++) {
                var tempItem = getMenuItemFromSnapshot(fMenuItems[i]);
                tempItem.quantity = fMenuItems[i].quantities[q];
                tempItem.index = q;
                newItems.push(tempItem);
            }
        };
        this.setState({fMenuItems: newItems});
    }

    loadCompData = () => {
        const { actions, employeeID, accountID } = this.props;
        actions.fetchMenuItems(employeeID, accountID);
    }

    dispatchNewMenuItem = (e, menuItemID) => {
        e.preventDefault();
        const { accountID } = this.props;
        const route = `/accounts/${accountID}/menuItems/${menuItemID}`
        dispatchNewRoute(route);
    }

    renderMenuItemCard = (menuItem) => {
        return (
            <Grid item xs={isMobileAndTablet() ? 12 : 4}>
                <MenuItemCard menuItem={menuItem} />
            </Grid>
        )
    }

    render() {
        const { classes, accountID, accountType } = this.props;
        const {
            fMenuItems,
        } = this.state;

        console.warn(fMenuItems)

        return fMenuItems.length > 0
        ? (
            <section>
            <div className={classes.headerCell}>
                {accountID === process.env.SUPPLYME_ADMIN_KEY && (
                    <Fab
                        aria-label={'Beta'}
                        className={isMobileAndTablet() ? classes.fab : null}
                        color={'primary'}
                        onClick={e => dispatchNewRoute(`/accounts/${accountID}/menuItems/create`)}
                        style={{marginLeft: 20}}
                    >
                        <AddIcon />
                    </Fab>
                )}
                <Fab
                    aria-label={'Beta'}
                    className={isMobileAndTablet() ? classes.fab : null}
                    color={'primary'}
                    onClick={e => dispatchNewRoute(`/accounts/${accountID}/menuItems/create/beta`)}
                    style={{marginLeft: 20}}
                >
                    <CloudUploadIcon />
                </Fab>
            </div>
            <Grid container className={classes.root} spacing={3}>
                {accountType === 'retailer' && (<RetailerMenuItemResultsTable menuItems={fMenuItems} handleLink={this.dispatchNewMenuItem} />)}
                {accountType === 'manufacturer' && (<ManuMenuItemResultsTable menuItems={fMenuItems} handleLink={this.dispatchNewMenuItem} />)}
            </Grid>
            </section>
        ) : (
          <div className={classes.headerCell}>
                <EmptyResults
                    header={'Xupply Inventory'}
                    title={'Enter your inventory so that we can track your burn rate and automate your Xupply requests.'}
                    emptyType={'menuItems'}
                    handleLink={e => dispatchNewRoute(`/accounts/${accountID}/menuItems/create/beta`)}
                    startedLink={f=>f}
                    hiwLink={f=>f}
                    whatLink={f=>f}
                />
            </div>
        )
    }
}

MenuItemListView.defaultProps = {
    accountID: '',
    employeeID: '',
    fetchMenuItems: f => f,
};
MenuItemListView.propTypes = {
    accountID: PropTypes.string,
    employeeID: PropTypes.string,
    fetchMenuItems: PropTypes.func,
    classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(MenuItemListView);

// {rows.map(this.renderMenuItemCard, this)}

/* For Prod App */
// <Fab
//     aria-label={'Add'}
//     className={isMobileAndTablet() ? classes.fab : null}
//     color={'primary'}
//     onClick={e => dispatchNewRoute(`/accounts/${accountID}/menuItems/create`)}
// >
//   <AddIcon />
// </Fab>
