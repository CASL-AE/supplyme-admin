/* eslint camelcase: 0, no-underscore-dangle: 0 */
import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import Fade from '@material-ui/core/Fade';
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
import GetStarted from '../../../components/Xupply/Base/GetStarted';

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
        marginBottom: 20,
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
    paper: {
      padding: theme.spacing(2),
      textAlign: 'center',
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
        actions: {},
    };
}

@connect(mapStateToProps, mapDispatchToProps)
class DashboardView extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            orders: [],
        };
    }

    componentDidMount() {
        console.log('Orders View Mounted');
        const { receivedAt, orders } = this.props;
        if (!receivedAt === null) {
            this.loadCompData();
        } else {
            this.receiveOrders(orders);
        }
    }

    componentWillReceiveProps(nextProps) {
        console.warn('Orders View Received Props')
        if (nextProps.receivedAt !== null && this.props.receivedAt === null) {
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
        const { actions } = this.props;
        // actions.unmountOrderListener();
        this.receiveOrders = undefined;
        this.loadCompData = undefined;
        this.render = undefined;
    }

    receiveOrders = (orders) => {
        console.warn('Received Orders');
        this.setState({orders: filterBy(orders)});
    }

    loadCompData = () => {
        const { actions, employeeID, accountID } = this.props;
        actions.fetchOrders(accountID);
    }

    dispatchNewOrder = (e, orderID) => {
        e.preventDefault();
        const { accountID } = this.props;
        const route = `/accounts/${accountID}/orders/${orderID}`;
        dispatchNewRoute(route);
    }

    render() {
        const { classes, accountID } = this.props;
        const {
            orders,
        } = this.state;

        console.error(orders)

        return orders.length > 0
        ? (
          <Fade
              in={true}
              style={{ transformOrigin: '0 0 0' }}
              {...(true ? { timeout: 1000 } : {})}
          >
              <section>
                  <Grid container className={classes.root} spacing={2}>
                      <OrderResultsTable orders={orders} handleLink={this.dispatchNewOrder} />
                  </Grid>
              </section>
          </Fade>
        ) : (
          <GetStarted />
        );
    }
}

DashboardView.defaultProps = {
    accountID: '',
    employeeID: '',
    fetchOrders: f => f,
    bulkUploadOrders: f => f,
};
DashboardView.propTypes = {
    accountID: PropTypes.string,
    employeeID: PropTypes.string,
    fetchOrders: PropTypes.func,
    bulkUploadOrders: PropTypes.func,
    classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(DashboardView);
