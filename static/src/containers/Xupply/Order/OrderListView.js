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

import OrderResultsTable from '../../../components/Xupply/Order/OrderResultsTable';
import OrderCard from '../../../components/Xupply/Order/OrderCard';
import EmptyResults from '../../../components/Xupply/Base/EmptyResults';
import WalletCheckoutDialog from '../../../components/Xupply/Wallet/WalletCheckoutDialog';

import { validateString, dispatchNewRoute, filterBy } from '../../../utils/misc';
import { fetchOrders } from '../../../services/order/actions';
import { orderRowObject } from '../../../services/order/model';
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
        orders: state.orderData.orders,
        receivedAt: state.orderData.receivedAt,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: {
            fetchOrders: bindActionCreators(fetchOrders, dispatch)
        },
    };
}

@connect(mapStateToProps, mapDispatchToProps)
class OrderListView extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            orders: [],
        };
    }

    componentDidMount() {
        console.log('Orders View Mounted');
        const { receivedAt, orders } = this.props;
        if (receivedAt === null) {
            this.loadCompData();
        } else {
            this.receiveOrders(orders);
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.receivedAt && !this.props.receivedAt) {
            this.receiveOrders(nextProps.orders);
        }
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
        // const { actions } = this.props;
        // // actions.unmountOrderListener();
        // this.receiveOrders = undefined;
        // this.loadCompData = undefined;
        // this.render = undefined;
    }

    receiveOrders = (orders) => {
        console.warn('Received Orders');
        this.setState({
            orders: orders
        });
    }

    loadCompData = () => {
        const { actions, employeeID, accountID } = this.props;
        actions.fetchOrders(employeeID, accountID);
    }

    dispatchNewOrder = (e, orderID) => {
        e.preventDefault();
        const { accountID } = this.props;
        const route = `/accounts/${accountID}/orders/${orderID}`
        dispatchNewRoute(route);
    }

    renderOrderCard = (orders) => {
        return (
            <Grid item xs={isMobileAndTablet() ? 12 : 3}>
              <OrderCard row={orders} />
            </Grid>
        )
    }

    render() {
        const { classes, accountID } = this.props;
        const {
            orders,
        } = this.state;

        return orders.length > 0
        ? (
          <section>
          <div className={classes.headerCell}>
              <Fab
                  aria-label={'Add'}
                  className={isMobileAndTablet() ? classes.fab : null}
                  color={'primary'}
                  onClick={e => dispatchNewRoute(`/accounts/${accountID}/requests/search`)}
              >
                <AddIcon />
              </Fab>
          </div>
          <Grid container className={classes.root} spacing={2}>
              <OrderResultsTable orders={orders} handleLink={this.dispatchNewOrder} />
          </Grid>
          </section>

        ) : (
            <div className={classes.headerCell}>
                <EmptyResults
                    header={'Xupply Orders'}
                    title={'Manually create orders from other Xupply Requests'}
                    emptyType={'orders'}
                    handleLink={e => dispatchNewRoute(`/accounts/${accountID}/requests/search`)}
                    startedLink={f=>f}
                    hiwLink={f=>f}
                    whatLink={f=>f}
                />
            </div>
        )
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
