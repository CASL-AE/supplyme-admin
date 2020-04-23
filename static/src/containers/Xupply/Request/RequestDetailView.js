/* eslint camelcase: 0, no-underscore-dangle: 0 */
import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import Fade from '@material-ui/core/Fade';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Fab from '@material-ui/core/Fab';
import EditIcon from '@material-ui/icons/Edit';
import AddIcon from '@material-ui/icons/Add';

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
      backgroundColor: theme.palette.primary.appBar,
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
      bordertTop: '1px solid #e6e6e6',
      display: 'block',
      backgroundColor: theme.palette.primary.appBar,
      borderRadius: 8,
      padding: 30,
      position: 'relative',
    },
    detailListDt: {
      minWidth: '30%',
      border: 0,
      padding: '.5rem 0',
      margin: 0,
    },
    detailListDd: {
      minWidth: '70%',
      border: 0,
      fontWeight: 500,
      padding: '.5rem 0',
      margin: 0,
    },
    detailListFlex: {
        display: 'flex',
    },
    img: {
        borderRadius: '50%',
        paddingRight: 10,
    },
    editButton: {
        position: 'absolute',
        top: 20,
        right: 20,
        textTransform: 'none',
    },
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

    renderEditAction = () => {
        const { classes, accountType } = this.props;
        const { request } = this.state;
        switch(accountType) {
            case 'retailer':
                return (
                    <Fab
                        aria-label={'Edit'}
                        className={classes.editButton}
                        color={'primary'}
                        onClick={(e) => dispatchNewObject(e, accountID, 'request', request.requestID, 'edit')}
                    >
                      <EditIcon />
                    </Fab>
                );
            case 'manufacturer':
                return null;
            case 'financier':
                return null;
            default:
                return null;
        }
    }

    renderAddAction = () => {
        const { classes, accountType } = this.props;
        const { request } = this.state;
        switch(accountType) {
            case 'retailer':
                return null;
            case 'manufacturer':
                return (
                    <Fab
                      className={classes.button}
                      onClick={e => this.dispatchNewOrder(e, request.requestID)}
                    >
                        <AddIcon />
                    </Fab>
                );
            case 'financier':
                return null;
            default:
                return null;
        }
    }

    render() {
        const { classes, accountID } = this.props;
        const { request } = this.state;
        console.error(request)
        return (
          <Fade
              in={true}
              style={{ transformOrigin: '0 0 0' }}
              {...(true ? { timeout: 1000 } : {})}
          >
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
                                  {this.renderAddAction()}
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
                                      Request Type
                                  </dt>
                                  <dd className={classes.detailListDd}>
                                      {request.requestType}
                                  </dd>
                                  </div>
                                  <div className={classes.detailListFlex}>
                                      {this.renderEditAction()}
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
          </Fade>
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
