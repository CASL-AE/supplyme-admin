/* eslint camelcase: 0, no-underscore-dangle: 0, react/jsx-indent-props: 0, max-len: 0, react/forbid-prop-types: 0 */
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

// Core UI
import deburr from 'lodash/deburr';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import HomeIcon from '@material-ui/icons/Home';

// Components
import AutoCompleteLocations from '../../../components/Xupply/AutoCompletes/AutoCompleteLocations';
import BetaOrderFormTable from '../../../components/Xupply/Beta/BetaOrderFormTable';
import XupplyLoader from '../../../components/Xupply/Base/XupplyLoader';


import { getKeys, filterBy, filterForOrder } from '../../../utils/misc';
import { validateAddress, validateString } from '../../../utils/validate';
import { toNewOrder } from '../../../services/order/model';
import { toNewRequest } from '../../../services/request/model';
import { saveNewOrder } from '../../../services/order/actions';
import { fetchMenuItems } from '../../../services/menuItem/actions';
import { isMobileAndTablet } from '../../../utils/isMobileAndTablet';
import {
  calculateOverBurnStock,
  calculateOverBurnPriority,
  calculateOverBurnRequiredBy,
} from '../../../utils/inventory';

const styles = theme => ({
    root: {
        flexGrow: 1,
    },
    content: {
        padding: isMobileAndTablet() ? 0 : theme.spacing(2),
        backgroundColor: theme.palette.primary.appBar,
        borderRadius: 8,
    },
    gridItemBoxInner: {
        padding: 30,
    },
    divider: {
        display: 'flex',
        color: '#5c5c5c',
        fontSize: 15,
    },
    dividerLine: {
        margin: 'auto',
        content: "",
        borderTop: '10px solid red',
        // flex: 1,
        width: 40,
        transform: 'translateY(50%)',
    },
    inputLabel: {
        fontSize: 13,
        fontFamily: 'AvenirNext',
        paddingBottom: 5,
        display: 'inline-block',
        textAlign: 'left',
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
    checkbox: {
        margin: 0,
        padding: 0,
        paddingRight: 10,
        marginLeft: 10,
    },
    checkboxLabel: {
        display: 'inline-block',
        fontWeight: 500,
        fontSize: 14,
        color: '#656565'
    },
});

function mapStateToProps(state) {
    return {
        pathname: state.router.location.pathname,
        idToken: state.app.idToken,
        employeeID: state.app.employeeID,
        accountID: state.app.accountID,
        orders: state.orderData.orders,
        receivedAt: state.orderData.receivedAt,
        requests: state.requestData.publicRequests,
        receivedRequestsAt: state.requestData.receivedPublicRequestsAt,
        menuItems: state.menuItemData.menuItems,
        receivedMenuItemsAt: state.menuItemData.receivedAt,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: {
            fetchMenuItems: bindActionCreators(fetchMenuItems, dispatch),
            saveNewOrder: bindActionCreators(saveNewOrder, dispatch)
        },
    };
}

@connect(mapStateToProps, mapDispatchToProps)
class OrderCreateBetaView extends Component {

    constructor(props) {
        super(props);
        this.state = {
            order: toNewOrder(),
            searchLocation: false,
            menuItemOpen: false,
            menuItems: [],
            isCheckout: false,
            disabled: true,
            loading: false,
            redirectRoute: `/accounts/${this.props.accountID}/requests`,
        };
    }

    componentDidMount() {
        console.log(this.props)
        const { receivedMenuItemsAt, menuItems } = this.props;
        if (receivedMenuItemsAt === null) {
            this.loadCompData();
        } else {
            this.receiveMenuItems(menuItems);
        }
        const { receivedRequestsAt, requests } = this.props;
        if (receivedRequestsAt !== null) {
            this.loadRequestData();
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.receivedMenuItemsAt !== null && this.props.receivedMenuItemsAt === null) {
            this.receiveMenuItems(nextProps.menuItems);
        }
        if (nextProps.receivedRequestsAt !== null && this.props.receivedRequestsAt === null) {
            this.loadRequestData(nextProps);
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (nextState === this.state) {
            return false;
        }
        return true;
    }

    receiveMenuItems = (menuItems) => {
        console.warn('Received MenuItems');
        this.setState({menuItems: filterBy(menuItems)});
    }

    loadCompData = () => {
        const { actions, employeeID, accountID } = this.props;
        console.warn('Fetching MenuItems');
        actions.fetchMenuItems(employeeID, accountID);
    }

    loadRequestData = (props = this.props) => {
        console.warn('Loading Order Request');
        const { actions, accountID, requests, pathname } = props;
        const keys = getKeys(pathname);
        const requestID = keys.third;
        const next_state = this.state;
        if (requestID && requestID !== null) {
            requests.forEach((request) => {
                if (request.requestID === requestID) {
                    next_state.order.request = request;
                    this.setState(next_state, () => {});
                }
            })
        }
    }

    handleChange = (e, name, itemID) => {
        const { value } = e.target;
        const next_state = this.state;
        next_state.order.stockPerItem[itemID][name] = value;
        this.setState(next_state, () => {});
    }

    handleCheckBox = (e, menuItem) => {
        const next_state = this.state;
        const itemID = menuItem.itemID;
        console.log(itemID)
        const found = this.state.order.items.some(o => o.itemID === itemID);
        if (found) {
            next_state.order.items = this.state.order.items.filter(o => o.itemID !== itemID);
            delete next_state.order.stockPerItem[menuItem.itemID];
        } else {
            next_state.order.items = [...this.state.order.items, menuItem];
            next_state.order.stockPerItem[itemID] = {};
            next_state.order.stockPerItem[itemID].priority = this.state.order.request.stockPerItem[itemID].priority;
            next_state.order.stockPerItem[itemID].requiredBy = this.state.order.request.stockPerItem[itemID].requiredBy;
            // Calc amount of stock the manu can fulfil if stock(Manu) < stock(Request), fill all of stock(Manu) if > stock fill all of stock(Request)
            // const stock = calculateOverBurnStock(menuItem.quantities[0]);
            // const availableBy = calculateOverBurnRequiredBy(menuItem.quantities[0]);
            // next_state.order.stockPerItem[itemID].stock = parseInt(Math.abs(stock));
            // next_state.order.stockPerItem[itemID].availableBy = availableBy.leadDate;
            next_state.order.stockPerItem[itemID].packageType = menuItem.quantities[0].packageType;
            next_state.order.stockPerItem[itemID].pricePerUnit = menuItem.quantities[0].pricePerUnit;
        }
        this.setState(next_state, () => {});
    }

    handleLocationSelected = (location) => {
        const next_state = this.state;
        console.log(location)
        next_state.order.location = location;
        next_state.searchLocation = false;
        this.setState(next_state, () => {});
    }

    requestCheckout = (e) => {
        e.preventDefault();
        const next_state = this.state;
        Object.entries(next_state.order.stockPerItem).forEach((s) => {
            next_state.order.totals.items += s[1].stock * s[1].pricePerUnit;
        });
        next_state.order.totals.serviceCharges = (next_state.order.totals.items * 0.025) + .30;
        next_state.order.totals.subTotal = next_state.order.totals.items + next_state.order.totals.serviceCharges;
        next_state.order.totals.tax = next_state.order.totals.subTotal * 0.085;
        next_state.order.totals.total = next_state.order.totals.subTotal + next_state.order.totals.tax;
        next_state.order.totals.due = next_state.order.totals.total;
        next_state.isCheckout = true;
        this.setState(next_state, () => {});
    }

    handleClose = (e) => {
        e.preventDefault();
        this.setState({isCheckout: false});
    }

    toggleLocation = (e) => {
        const { searchLocation } = this.state;
        this.setState({searchLocation: !searchLocation});
    }

    isOrderDisabled(e) {
        this.setState({
            disabled: true,
        });
        let location_is_valid = false;
        let items_is_valid = false;
        let stock_is_valid = false;

        console.log(this.state.order)

        // Validate Order Name
        if (this.state.order.location.address.active === false && this.state.order.location.address.street1 === null) {
            this.setState({
                location_error_text: null,
            });
        } else if (validateAddress(this.state.order.location.address)) {
            location_is_valid = true;
            this.setState({
                location_error_text: null,
            });
        } else {
            this.setState({
                location_error_text: `Please select a valid location`,
            });
        }

        // Validate Order Items
        if (this.state.order.items === []) {
            this.setState({
                items_error_text: null,
            });
        } else if (this.state.order.items.length > 0) {
            items_is_valid = true;
            this.setState({
                items_error_text: null,
            });
        } else {
            this.setState({
                items_error_text: `Please select a valid item`,
            });
        }

        // Validate Order Stock Per Item
        if (this.state.order.stockPerItem === {}) {
            this.setState({
                stock_error_text: null,
            });
        } else if (Object.keys(this.state.order.stockPerItem).length > 0) {
            stock_is_valid = true;
            this.setState({
                stock_error_text: null,
            });
        } else {
            this.setState({
                stock_error_text: `Please select a valid stock`,
            });
        }

        // console.warn(this.state.order)
        // console.warn(name_is_valid)

        if (
            location_is_valid &&
            items_is_valid &&
            stock_is_valid
        ) {
            this.setState({disabled: false})
        }
    }

    createNewOrder = () => {
        const { actions, idToken, employeeID, accountID } = this.props;
        const { order, redirectRoute } = this.state;
        console.log(order)
        console.log(redirectRoute)
        actions.saveNewOrder(idToken, employeeID, accountID, order, redirectRoute);
    }

    render() {
        const { classes } = this.props;
        const {
          order,
          menuItems,
          isCheckout,
          disabled,
          loading,
        } = this.state;

        console.error(order)

        return (
            <Grid container alignItems="center" justify="center" className={classes.root} spacing={isMobileAndTablet() ? 0 : 2}>
                <Grid item xs={12}>
                    <Paper className={classes.content}>
                        <div className={classes.gridItemBoxInner}>
                            <div>
                                <h4 style={{ color: 'red', fontWeight: 300, fontSize: 20, textAlign: 'center', paddingBottom: 15 }}>{'COVID19 PPE Order Form'}</h4>
                                <div className={classes.divider} >
                                    <div className={classes.dividerLine} />
                                </div>
                                <BetaOrderFormTable
                                    menuItems={filterForOrder(menuItems, this.state.order.request)}
                                    approvedMenuItems={order.items}
                                    stockPerItem={order.stockPerItem}
                                    requestStockPerItem={order.request.stockPerItem}
                                    handleCheckBox={this.handleCheckBox}
                                    handleChange={this.handleChange}
                                />
                                <div style={{width: '50%', margin: 'auto', paddingTop: 10, paddingLeft: 25, paddingRight: 25, paddingBottom: 25}}>
                                    <Button
                                        disableRipple
                                        disableFocusRipple
                                        // disabled={disabled}
                                        onClick={e => this.createNewOrder(e)}
                                        className={classes.continueButton}
                                        variant="outlined"
                                    >
                                        {'Agree & Continue'}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </Paper>
                </Grid>
            </Grid>
        );
    }
}

OrderCreateBetaView.defaultProps = {
    saveNewOrder: f => f,
    fetchMenuItems: f => f,
};

OrderCreateBetaView.propTypes = {
    saveNewOrder: PropTypes.func.isRequired,
    fetchMenuItems: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(OrderCreateBetaView);
