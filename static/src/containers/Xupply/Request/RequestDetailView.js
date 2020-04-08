/* eslint camelcase: 0, no-underscore-dangle: 0 */
import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import { toNewRequest } from '../../../services/request/model';
import { getKeys, dispatchNewRoute, formatDateWTime, dispatchNewObject } from '../../../utils/misc';

import MiniDetailMap from '../../../components/Xupply/Misc/MiniDetailMap';
import RequestMenuItemsTable from '../../../components/Xupply/Request/RequestMenuItemsTable';

const styles = (theme) => ({
    root: {
        flex: 1,
        height: '100vh'
    },
    display: {
        display: 'flex',
    },
    leftDetail: {
      flexBasis: 0,
      flexGrow: 1,
      marginRight: 30,
    },
    detailCard: {
      padding: '2.0rem',
      boxShadow: '0 8px 64px rgba(32, 32, 32, 0.08), 0 4px 16px rgba(32, 32, 32, 0.02)',
      backgroundColor: '#eee',
      borderRadius: 8,
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
      backgroundColor: '#eee',
      padding: 30,
      borderRadius: 8,
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
        requests: state.requestData.publicRequests,
        receivedAt: state.requestData.receivedPublicRequestsAt,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: {},
    };
}

@connect(mapStateToProps, mapDispatchToProps)
class RequestDetailView extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            request: toNewRequest()
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
        const requestID = keys.second;
        if (requestID && requestID !== null) {
            requests.forEach((request) => {
                if (request.requestID === requestID) {
                    this.setState({request});
                }
            })
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
        const { request } = this.state;
        console.error(request)
        return (
          <div className={classes.root}>
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
                            <span className={classes.detailTitleText}>{`Total Funded:  $ ${request.budget || '0'}`}</span>
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
                          <RequestMenuItemsTable menuItems={request.items} stockPerItem={request.stockPerItem} />
                      </div>
                  </div>
              </div>
          </div>
        );
    }
}

RequestDetailView.defaultProps = {
    router: PropTypes.object,
};

RequestDetailView.propTypes = {
    router: PropTypes.object,
};

export default withStyles(styles)(RequestDetailView);
