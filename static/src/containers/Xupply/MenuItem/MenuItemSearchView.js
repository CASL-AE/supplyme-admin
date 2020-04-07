/* eslint camelcase: 0, no-underscore-dangle: 0 */
import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import RemoveCircleOutlineIcon from '@material-ui/icons/RemoveCircleOutline';

import PublicMenuItemResultsTable from '../../../components/Xupply/MenuItem/PublicMenuItemResultsTable';

import { validateString, dispatchNewRoute, filterBy } from '../../../utils/misc';

const styles = (theme) => ({
    root: {
        flex: 1,
        height: '100%'
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
        marginBottom: 40,
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
    block: {
        marginBottom: 40,
    },
    detailList: {
        // borderTop: '1px solid #e6e6e6',
        paddingTop: 15,
        display: 'block',
    },
    detailListFlex: {
        display: 'flex',
    },
});

function mapStateToProps(state) {
    return {
        router: state.router,
        idToken: state.app.idToken,
        employeeID: state.app.employeeID,
        accountID: state.app.accountID,
        menuItems: state.menuItemData.publicMenuItems,
        receivedAt: state.menuItemData.receivedPublicMenuItemsAt,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: {
            fetchPublicMenuItems: bindActionCreators(fetchPublicMenuItems, dispatch)
        },
    };
}

@connect(mapStateToProps, mapDispatchToProps)
class MenuItemSearchView extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            menuItems: [],
            requestItems: [],
            stockPerItem: {},
        };
    }

    componentDidMount() {
        console.log('MenuItems Search View Mounted');
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
            console.log('THis')
            return false;
        }
        return true;
    }

    componentDidUpdate() {
        console.log('MenuItems Search View Updated');
    }

    componentWillUnmount() {
        console.log('MenuItems Search View UnMounted');
        const { actions } = this.props;
        // actions.unmountMenuItemListener();
        this.receiveMenuItems = undefined;
        this.loadCompData = undefined;
        this.render = undefined;
    }

    receiveMenuItems = (menuItems) => {
        console.warn('Received Search MenuItems');
        const _menuItems = filterBy(menuItems);
        this.setState({menuItems: _menuItems});
    }

    loadCompData = () => {
        const { actions, employeeID, accountID } = this.props;
        console.warn('Fetching Search MenuItems');
        actions.fetchPublicMenuItems(employeeID, accountID);
    }

    dispatchNewMenuItem = (e, menuItemID) => {
        e.preventDefault();
        const { accountID } = this.props;
        const route = `/accounts/${accountID}/menuItems/${menuItemID}`
        dispatchNewRoute(route);
    }

    handleMenuItemChange = (e, menuItem) => {
        const { value } = e.target;
        const next_state = this.state;
        const itemID = menuItem.itemID;
        const quantity = value;
        console.warn(quantity);
        console.warn(menuItem);
        console.warn(this.state.requestItems);
        const packageType = menuItem.quantities[0].packageType;
        const pricePerUnit = menuItem.quantities[0].pricePerUnit;
        const found = this.state.requestItems.some(o => o.itemID === itemID);
        console.warn(found);
        if (found) {
            next_state.stockPerItem[menuItem.itemID] = {packageType: packageType, quantity: quantity};
            if (quantity === '') {
              next_state.requestItems = this.state.requestItems.filter(o => o.itemID !== itemID);
              delete next_state.request.stockPerItem[menuItem.itemID];
            }
        } else {
            next_state.requestItems.push(menuItem);
            next_state.stockPerItem[menuItem.itemID] = {packageType: packageType, quantity: quantity};
        }
        this.setState(next_state, () => {});
    }

    deleteMenuItem(e, item){
        let next_state = this.state.requestItems;
        for(let i = 0; i < next_state.length; i++){
            if(next_state[i] === item){
                next_state.splice(i,1);
            }
        }
        this.setState(next_state, () => {})
    }

    renderRequestMenuItems = (item) => {
        const { classes } = this.props;
        const { stockPerItem } = this.state;
        console.log(item);
        return (
            <div key={item.itemID}>
                <IconButton
                  color='secondary'
                  disabled={false}
                  onClick={e => this.deleteMenuItem(e, item)}
                >
                    <RemoveCircleOutlineIcon className={classes.iconButton} />
                </IconButton>
                <span className={classes.detailListDt}>
                    Item Name: {item.itemName} - Requested: {stockPerItem[item.itemID].quantity}
                </span>
            </div>
        );
    }

    render() {
        const { classes, accountID, request, handleItemsSelected } = this.props;
        const {
            menuItems,
            requestItems,
            stockPerItem,
        } = this.state;

        const GeneralContainer = (
            <div className={classes.outerCell}><h1>Search Menu Items</h1>
            {requestItems.length > 0
              ? (
                <div className={classes.block}>
                    <dl className={classes.detailList}>
                        <div className={classes.detailListFlex}>
                            {requestItems.map(this.renderRequestMenuItems, this)}
                        </div>
                    </dl>
                </div>
              ) : null
            }
            <Button
              variant="contained"
              disableRipple
              disableFocusRipple
              className={classes.firstButton}
              classes={{ label: classes.buttonLabel }}
              onClick={e => handleItemsSelected(e, requestItems, stockPerItem)}
            >
                {'Finalize Request'}
            </Button>
            </div>
        );

        return (
              <PublicMenuItemResultsTable
                  menuItems={menuItems}
                  handleChange={this.handleMenuItemChange}
              />
        );
    }
}

MenuItemSearchView.defaultProps = {
    accountID: '',
    employeeID: '',
    fetchMenuItems: f => f,
};
MenuItemSearchView.propTypes = {
    accountID: PropTypes.string,
    employeeID: PropTypes.string,
    fetchMenuItems: PropTypes.func,
    request: PropTypes.object.isRequired,
    handleItemsSelected: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(MenuItemSearchView);
