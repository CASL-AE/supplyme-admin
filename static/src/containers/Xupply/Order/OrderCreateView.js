/* eslint camelcase: 0, no-underscore-dangle: 0 */
import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import { toNewOrder } from '../../../services/order/model';
import { toNewRequest } from '../../../services/request/model';
import {
  getKeys,
  dispatchNewRoute,
  formatDateWTime,
  dispatchNewObject,
  roundUp
} from '../../../utils/misc';

import MiniDetailMap from '../../../components/Xupply/Misc/MiniDetailMap';
import OrderMenuItemsTable from '../../../components/Xupply/Order/OrderMenuItemsTable';

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
        backgroundColor: theme.palette.primary.appBar,
    },
    display: {
        display: 'flex',
    },
    leftDetail: {
      paddingRight: '8rem',
      flexBasis: 0,
      flexGrow: 1,
    },
    detailCard: {
      padding: '2.0rem',
      boxShadow: '0 8px 64px rgba(32, 32, 32, 0.08), 0 4px 16px rgba(32, 32, 32, 0.02)',
      brequestRadius: 16,
    },
    detailTop: {
      marginBottom: 30,
      display: 'flex',
      alignItems: 'center',
      fontWeight: 500,
      color: '#202020',
    },
    detailTitle: {
        marginBottom: 30,
    },
    detailTitleText: {
      color: 'black',
      fontSize: 24,
      fontWeight: 600,
      lineHeight: 1.36,
      margin: 0,
    },
    detailActions: {
        display: 'flex',
    },
    button: {
        color: 'fff',
        marginRight: 10,
        textTransform: 'none',
        backgroundColor: theme.palette.primary.main,
    },
    rightDetail: {
      flexGrow: 2,
      flexBasis: 0,
    },
    block: {
        marginBottom: 40,
    },
    section: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingTop: 15,
      paddingBottom: 15,
      margin: 0,
    },
    detailList: {
      brequestTop: '1px solid #e6e6e6',
      paddingTop: 15,
      display: 'block',
    },
    detailListDt: {
      minWidth: '30%',
      brequest: 0,
      padding: '.5rem 0',
      margin: 0,
    },
    detailListDd: {
      minWidth: '70%',
      brequest: 0,
      fontWeight: 500,
      padding: '.5rem 0',
      margin: 0,
    },
    detailListFlex: {
        display: 'flex',
    },
    img: {
        brequestRadius: '50%',
        paddingRight: 10,
    }
});

function mapStateToProps(state) {
    return {
        pathname: state.router.location.pathname,
        employeeID: state.app.employeeID,
        accountID: state.app.accountID,
        accountType: state.app.accountType,
        requests: state.requestData.requests,
        receivedAt: state.requestData.receivedAt,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: {},
    };
}

export function searchQuantityPriceByPackageType(quantities, type) {
      console.log(quantities)
      console.log(type)
      var count = 0;
      if (quantities.length > 0 && type !== null) {
            quantities.forEach((q) => {
                if (q.packageType === type) {
                    count = parseFloat(q.pricePerUnit, 2);
                }
            });
      }
      return count;
}

export function getTotal(items, stockPerItem) {
    console.log(items);
    console.log(stockPerItem);
    let count = 0;
    if (items.length > 0 && Object.keys(stockPerItem).length > 0) {
        items.forEach((i) => {
            if (i !== null && i.quantities.length > 0) {
                console.log(stockPerItem[i.itemID].quantity)
                console.log(stockPerItem[i.itemID].packageType)
                const price = searchQuantityPriceByPackageType(i.quantities, stockPerItem[i.itemID].packageType)
                console.log(price)
                count += parseFloat(stockPerItem[i.itemID].quantity * price, 2);
            }
        });
    }
    console.log(count)
    return roundUp(count, 2);
}

@connect(mapStateToProps, mapDispatchToProps)
class OrderCreateView extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            order: toNewOrder(),
            request: toNewRequest(),
            activeOrders: [],
            totalOrder: 0,
        };
    }

    componentDidMount() {
      console.log('Request Detail Mounted')
      this.loadCompData();
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.receivedAt !== null && this.props.receivedAt === null) {
            this.loadCompData(nextProps);
        }
    }

    componentWillUnmount() {
      console.log('Request Detail UnMounted')
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (nextState === this.state) {
            return false;
        }
        return true;
    }

    loadCompData = () => {
        const { actions, accountID, requests, pathname } = this.props;
        const keys = getKeys(pathname);
        const requestID = keys.third;
        if (requestID && requestID !== null) {
            requests.forEach((request) => {
                if (request.requestID === requestID) {
                    this.setState({request});
                }
            })
        }
    }

    handleChange = (e, menuItem) => {
        const { value } = e.target;
        const next_state = this.state;
        const itemID = menuItem.item.itemID;
        const quantity = value;
        const packageType = menuItem.item.quantities[0].packageType;
        const pricePerUnit = menuItem.item.quantities[0].pricePerUnit;
        const found = this.state.order.items.some(o => o.itemID === itemID);
        console.warn(found);
        console.warn(quantity);
        if (found) {
            next_state.order.stockPerItem[menuItem.item.itemID] = {packageType: packageType, quantity: quantity};
            if (quantity === '') {
              next_state.order.items = this.state.order.items.filter(o => o.itemID !== itemID);
              delete next_state.order.stockPerItem[menuItem.item.itemID];
            }
        } else {
            next_state.order.items.push(menuItem.item);
            next_state.order.stockPerItem[menuItem.item.itemID] = {packageType: packageType, quantity: quantity};
        }
        this.setState(next_state, () => {});
    }

    isOrderDisabled() {
        this.setState({
            disabled: true,
        });
        let name_is_valid = false;
        let email_is_valid = false;

        // Validate Order Name
        if (this.state.order.contactInfo.name === null || this.state.order.contactInfo.name === '') {
            this.setState({
                name_error_text: null,
            });
        } else if (validateString(this.state.order.contactInfo.name) && this.state.order.contactInfo.name.length < 40) {
            name_is_valid = true;
            this.setState({
                name_error_text: null,
            });
        } else {
            this.setState({
                name_error_text: `The order first name must be a string and < ${40} and > 1 characters.`,
            });
        }

        // Validate Order Email
        if (this.state.order.contactInfo.email === null || this.state.order.contactInfo.email === '') {
            this.setState({
                email_error_text: null,
            });
        } else if (validateEmail(this.state.order.contactInfo.email) && this.state.order.contactInfo.email.length < 40) {
            email_is_valid = true;
            this.setState({
                email_error_text: null,
            });
        } else {
            this.setState({
                email_error_text: `Please enter a valid email`,
            });
        }

        // console.warn(this.state.order)
        // console.warn(name_is_valid)

        if (
            name_is_valid && email_is_valid
        ) {
            this.setState({
                disabled: false,
            });
        }
    }

    renderItemQuantites = (quantity, index) => {
        const { classes } = this.props;
        console.log(quantity)
        return (
            <div className={classes.block}>
                <div className={classes.section}>
                    <span className={classes.detailTitleText}>{`$ ${quantity.pricePerUnit} - ${quantity.packageQuantity} / ${quantity.packageType}`}</span>
                </div>
                <dl className={classes.detailList}>
                    <div key={index} className={classes.detailListFlex}>
                        <dt className={classes.detailListDt}>
                            {'Stock'}
                        </dt>
                        <dd className={classes.detailListDd}>
                            {quantity.stock}
                        </dd>
                    </div>
                </dl>
            </div>
        );
    }

    dispatchNewOrder = (e, requestID) => {
        e.preventDefault();
        const { accountID } = this.props;
        const route = `/accounts/${accountID}/orders/create/requests/${requestID}`;
        dispatchNewRoute(route);
    }

    dispatchNewOpportunity = (e, requestID) => {
        e.preventDefault();
        const { accountID } = this.props;
        const route = `/accounts/${accountID}/opportunities/create/requests/${requestID}`;
        dispatchNewRoute(route);
    }

    renderAction = () => {
        const { classes, accountType } = this.props;
        const { request } = this.state;
        switch(accountType) {
            case 'retailer':
                return null;
            case 'manufacturer':
                return (
                    <Button
                      variant="contained"
                      disableRipple
                      disableFocusRipple
                      className={classes.button}
                      onClick={e => this.dispatchNewOrder(e, request.requestID)}
                    >
                        {'Create Order'}
                    </Button>
                );
            case 'financier':
                return (
                    <Button
                      variant="contained"
                      disableRipple
                      disableFocusRipple
                      className={classes.button}
                      onClick={e => this.dispatchNewOpportunity(e, request.requestID)}
                    >
                        {'Fund Request'}
                    </Button>
                );
            default:
                return null;
        }
    }

    render() {
        const { classes, accountID } = this.props;
        const { request, order, totalOrder } = this.state;
        console.error(request)
        console.error(order)
        console.error(totalOrder)
        return (
          <div className={classes.root}>
              <div className={classes.content}>
                  <div className={classes.display}>
                      <div className={classes.leftDetail}>
                          <div className={classes.detailCard}>
                              <div className={classes.detailTop}>
                                  {
                                    request.active
                                    ? (
                                      <MiniDetailMap
                                          isMarkerShown={true}
                                          googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${process.env.GOOGLE_API_KEY}`}
                                          loadingElement={<div style={{ height: `100%` }} />}
                                          containerElement={<div style={{ width: 400, height: 200 }} />}
                                          mapElement={<div style={{ height: `100%` }} />}
                                          id={request.requestID}
                                          location={request.location.address.location}
                                      />
                                    ) : null
                                  }
                              </div>
                              <div className={classes.detailTitle}>
                                <span className={classes.detailTitleText}>{`Order Total:  $ ${order.total || getTotal(order.items, order.stockPerItem) || '0'}`}</span>
                                <br />
                                <span>{`${request.location.name}`}</span>
                                <br />
                                <span>{request.active ? `Lat: ${request.location.address.location.lat} Lng: ${request.location.address.location.lng}` : null}</span>
                              </div>
                              <div className={classes.detailActions}>
                                  {this.renderAction()}
                              </div>
                          </div>
                      </div>
                      <div className={classes.rightDetail}>
                          <div className={classes.block}>
                              <div className={classes.section}>
                                  <span className={classes.detailTitleText}>Details</span>

                              </div>
                              <dl className={classes.detailList}>
                                  <div className={classes.detailListFlex}>
                                  <dt className={classes.detailListDt}>
                                      ID
                                  </dt>
                                  <dd className={classes.detailListDd}>
                                      {request.requestID}
                                  </dd>
                                  </div>
                                  <div className={classes.detailListFlex}>
                                  <dt className={classes.detailListDt}>
                                      Created
                                  </dt>
                                  <dd className={classes.detailListDd}>
                                      {'formatDateWTime(request.status.events[0].time)'}
                                  </dd>
                                  </div>
                                  <div className={classes.detailListFlex}>
                                  <dt className={classes.detailListDt}>
                                      Priority
                                  </dt>
                                  <dd className={classes.detailListDd}>
                                      {request.priority}
                                  </dd>
                                  </div>
                                  <div className={classes.detailListFlex}>
                                  <dt className={classes.detailListDt}>
                                      Request Type
                                  </dt>
                                  <dd className={classes.detailListDd}>
                                      {request.requestType}
                                  </dd>
                                  </div>
                                  <div className={classes.detailListFlex}>
                                  <dt className={classes.detailListDt}>
                                      Required By
                                  </dt>
                                  <dd className={classes.detailListDd}>
                                      {formatDateWTime(request.requiredBy)}
                                  </dd>
                                  </div>
                              </dl>
                          </div>
                          <div className={classes.block}>
                              <div className={classes.section}>
                                  <span className={classes.detailTitleText}>{'Requested Menu Items'}</span>
                              </div>
                              <OrderMenuItemsTable
                                  handleChange={this.handleChange}
                                  menuItems={request.menuItems}
                              />
                          </div>
                      </div>
                  </div>
              </div>
          </div>
        );
    }
}

OrderCreateView.defaultProps = {
    router: PropTypes.object,
};

OrderCreateView.propTypes = {
    router: PropTypes.object,
};

export default withStyles(styles)(OrderCreateView);
