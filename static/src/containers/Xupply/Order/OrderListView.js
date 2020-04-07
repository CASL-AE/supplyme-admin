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

import OrderResultsTable from '../../../components/Xupply/Order/OrderResultsTable';

import { validateString, dispatchNewRoute, filterBy } from '../../../utils/misc';
import { fetchOrders } from '../../../services/order/actions';
import { orderRowObject } from '../../../services/order/model';

const styles = (theme) => ({
    root: {
        flex: 1,
        display: 'inline-block',
        width: '100%',
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
});

function mapStateToProps(state) {
    return {
        router: state.router,
        idToken: state.app.idToken,
        employeeID: state.app.employeeID,
        accountID: state.app.accountID,
        orders: state.orderData.orders,
        receivedAt: state.orderData.receivedAt,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: {},
    };
}

@connect(mapStateToProps, mapDispatchToProps)
class OrderListView extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            order: {},
            showOrderDialog: false,
            rows: [],
        };
    }

    componentDidMount() {
        console.log('Orders View Mounted');
        const { receivedAt, orders } = this.props;
        if (!receivedAt) {
            // this.loadCompData();
        } else {
            this.receiveOrders(orders);
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.receivedAt && !this.props.receivedAt) {
            this.receiveOrders(nextProps.orders);
        }
        // if (nextProps.order.isLoaded && this.props.order.isFetching) {
        //     this.handledClose();
        // }
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (nextState === this.state) {
            return false;
        }
        return true;
    }

    componentDidUpdate() {
        console.log('Orders View Updated');
    }

    componentWillUnmount() {
        console.log('Orders View UnMounted');
        const { actions } = this.props;
        // actions.unmountOrderListener();
        this.receiveOrders = undefined;
        this.loadCompData = undefined;
        this.render = undefined;
    }

    receiveOrders = (orders) => {
        console.warn('Received Orders');
        const rows = filterBy(orders).map(e => orderRowObject(e));

        this.setState({
            rows,
        });
    }

    loadCompData = () => {
        const { actions, employeeID, accountID } = this.props;
        actions.fetchOrders(accountID);
    }

    dispatchNewOrder = (e, orderID) => {
        e.preventDefault();
        const { accountID } = this.props;
        const route = `/accounts/${accountID}/orders/${orderID}`
        dispatchNewRoute(route);
    }

    render() {
        const { classes, accountID } = this.props;
        const {
            rows,
        } = this.state;
        return (
            <div className={classes.root}>
                <div className={classes.content}>
                    <div className={classes.headerCell}></div>
                    <OrderResultsTable
                        rows={rows}
                        handleLink={this.dispatchNewOrder}
                    />
                </div>
            </div>
        );
    }
}

OrderListView.defaultProps = {
    accountID: '',
    employeeID: '',
    fetchOrders: f => f,
    bulkUploadOrders: f => f,
};
OrderListView.propTypes = {
    accountID: PropTypes.string,
    employeeID: PropTypes.string,
    fetchOrders: PropTypes.func,
    bulkUploadOrders: PropTypes.func,
    classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(OrderListView);
