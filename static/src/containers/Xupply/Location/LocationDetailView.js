/* eslint camelcase: 0, no-underscore-dangle: 0 */
import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

// import { getLocation } from '../../../services/location/actions';
import { toNewLocation } from '../../../services/location/model';
import { getKeys, formatDateWTime, dispatchNewObject } from '../../../utils/misc';

import MiniDetailMap from '../../../components/Xupply/Misc/MiniDetailMap';

const styles = {
    root: {
        flex: 1,
        height: '100vh'
    },
    content: {
        paddingTop: 42,
        paddingBottom: 42,
        paddingLeft: 80,
        paddingRight: 80,
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
      blocationRadius: 16,
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
        marginRight: 10,
        textTransform: 'none',
    },
    deleteButton: {
        backgroundColor: '#e02626',
        textTransform: 'none',
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
      blocationTop: '1px solid #e6e6e6',
      paddingTop: 15,
      display: 'block',
    },
    editButton: {
        float: 'right',
        textTransform: 'none',
    },
    detailListDt: {
      minWidth: '30%',
      blocation: 0,
      padding: '.5rem 0',
      margin: 0,
    },
    detailListDd: {
      minWidth: '70%',
      blocation: 0,
      fontWeight: 500,
      padding: '.5rem 0',
      margin: 0,
    },
    detailListFlex: {
        display: 'flex',
    },
    img: {
        blocationRadius: '50%',
        paddingRight: 10,
    }
};

function mapStateToProps(state) {
    return {
        pathname: state.router.location.pathname,
        employeeID: state.app.employeeID,
        accountID: state.app.accountID,
        locations: state.locationData.locations,
        receivedAt: state.locationData.receivedAt,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: {
            // getLocation: bindActionCreators(getLocation, dispatch)
        },
    };
}

@connect(mapStateToProps, mapDispatchToProps)
class LocationDetailView extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            location: toNewLocation()
        };
    }

    componentDidMount() {
      console.log('Location Detail Mounted')
      this.loadCompData();
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.receivedAt !== null && this.props.receivedAt === null) {
            this.loadCompData(nextProps);
        }
    }

    componentWillUnmount() {
      console.log('Location Detail UnMounted')
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (nextState === this.state) {
            return false;
        }
        return true;
    }

    loadCompData = () => {
        const { actions, accountID, locations, pathname } = this.props;
        const keys = getKeys(pathname);
        const locationID = keys.second;
        if (locationID && locationID !== null) {
            locations.forEach((location) => {
                if (location.locationID === locationID) {
                    this.setState({location});
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

    render() {
        const { classes, accountID } = this.props;
        const { location } = this.state;
        console.error(location)
        return (
          <div className={classes.root}>
              <div className={classes.content}>
                  <div className={classes.display}>
                      <div className={classes.leftDetail}>
                          <div className={classes.detailCard}>
                              <div className={classes.detailTop}>
                                  {
                                    location.active
                                    ? (
                                      <MiniDetailMap
                                          isMarkerShown={true}
                                          googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${process.env.GOOGLE_API_KEY}`}
                                          loadingElement={<div style={{ height: `100%` }} />}
                                          containerElement={<div style={{ width: 400, height: 200 }} />}
                                          mapElement={<div style={{ height: `100%` }} />}
                                          id={location.locationID}
                                          location={location.address.location}
                                      />
                                    ) : null
                                  }
                              </div>
                              <div className={classes.detailTitle}>
                                <span className={classes.detailTitleText}>{`${location.contactInfo.name}`}</span>
                                <br />
                                <span>{`${location.name}`}</span>
                                <br />
                                <span>{location.active ? `Lat: ${location.address.location.lat} Lng: ${location.address.location.lng}` : null}</span>
                              </div>
                          </div>
                      </div>
                      <div className={classes.rightDetail}>
                          <div className={classes.block}>
                              <div className={classes.section}>
                                  <span className={classes.detailTitleText}>Details</span>
                                  <Button
                                    variant="contained"
                                    disableRipple
                                    disableFocusRipple
                                    onClick={(e) => dispatchNewObject(e, accountID, 'location', location.locationID, 'edit')}
                                    className={classes.editButton}
                                  >
                                      {'Edit'}
                                  </Button>
                              </div>
                              <dl className={classes.detailList}>
                                  <div className={classes.detailListFlex}>
                                  <dt className={classes.detailListDt}>
                                      ID
                                  </dt>
                                  <dd className={classes.detailListDd}>
                                      {location.locationID}
                                  </dd>
                                  </div>
                                  <div className={classes.detailListFlex}>
                                  <dt className={classes.detailListDt}>
                                      Created
                                  </dt>
                                  <dd className={classes.detailListDd}>
                                      {`${formatDateWTime(location.createdDate)}`}
                                  </dd>
                                  </div>
                                  <div className={classes.detailListFlex}>
                                  <dt className={classes.detailListDt}>
                                      Contact Name
                                  </dt>
                                  <dd className={classes.detailListDd}>
                                      {location.contactInfo.name}
                                  </dd>
                                  </div>
                                  <div className={classes.detailListFlex}>
                                  <dt className={classes.detailListDt}>
                                      Contact Email
                                  </dt>
                                  <dd className={classes.detailListDd}>
                                      {location.contactInfo.email}
                                  </dd>
                                  </div>
                                  <div className={classes.detailListFlex}>
                                  <dt className={classes.detailListDt}>
                                      Contact Phone
                                  </dt>
                                  <dd className={classes.detailListDd}>
                                      {location.contactInfo.phoneNumber}
                                  </dd>
                                  </div>
                              </dl>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
        );
    }
}

LocationDetailView.defaultProps = {
    router: PropTypes.object,
};

LocationDetailView.propTypes = {
    router: PropTypes.object,
};

export default withStyles(styles)(LocationDetailView);
