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

import Loader from '../../../components/Xupply/Base/Loader';
import PublicRequestMap from '../../../components/Xupply/Request/PublicRequestMap';

import { validateString, dispatchNewRoute, filterBy } from '../../../utils/misc';
import { fetchRequests } from '../../../services/request/actions';
import { requestMarkerObject } from '../../../services/request/model';

const styles = (theme) => ({
    root: {
        flex: 1,
        backgroundColor: theme.palette.primary.background,
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
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: theme.palette.primary.main,
    },
});

function mapStateToProps(state) {
    return {
        router: state.router,
        idToken: state.app.idToken,
        employeeID: state.app.employeeID,
        accountID: state.app.accountID,
        requests: state.requestData.requests,
        receivedAt: state.requestData.receivedAt,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: {
            fetchRequests: bindActionCreators(fetchRequests, dispatch),
        },
    };
}

@connect(mapStateToProps, mapDispatchToProps)
class PublicRequestMapView extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            request: {},
            showRequestDialog: false,
            markers: [],
            loaded: false,
            currentCoords: {
              lat: 37.6,
              lng: -95.665
            },
            isOpen: false,
        };
    }

    componentDidMount() {
        console.log('Requests View Mounted');
        const { receivedAt, requests } = this.props;
        if (receivedAt === null) {
            this.loadCompData();
        } else {
            this.receiveRequests(requests);
            this.locate();
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.receivedAt !== null && this.props.receivedAt === null) {
            this.receiveRequests(nextProps.requests);
            this.locate();
        }
        // if (nextProps.request.isLoaded && this.props.request.isFetching) {
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
        console.log('Requests View Updated');
    }

    componentWillUnmount() {
        console.log('Requests View UnMounted');
        const { actions } = this.props;
        // actions.unmountRequestListener();
        this.receiveRequests = undefined;
        this.loadCompData = undefined;
        this.render = undefined;
    }

    receiveRequests = (requests) => {
        console.warn('Received Requests');
        const markers = filterBy(requests).map(e => requestMarkerObject(e));
        this.setState({
            markers,
        });
    }

    loadCompData = () => {
        const { actions } = this.props;
        actions.fetchRequests();
    }

    dispatchNewRequest = (e, requestID) => {
        e.preventDefault();
        const { accountID } = this.props;
        const route = `/accounts/${accountID}/orders/create/requests/${requestID}`;
        dispatchNewRoute(route);
    }

    locate = () => {
          console.warn(navigator);
          if ("geolocation" in navigator){
            navigator.geolocation.getCurrentPosition((position) => {
                console.warn('GOT LOCATION')
                this.setState({
                    currentCoords: {
                      lat: position.coords.latitude,
                      lng: position.coords.longitude,
                    },
                    loaded: true,
                });
            });
          }
    }

    onToggleOpen = () => {
        this.setState({isOpen: !this.state.isOpen})
    }

    onMarkerClustererClick = (markerClusterer) => {
        const clickedMarkers = markerClusterer.getMarkers()
        console.log(`Current clicked markers length: ${clickedMarkers.length}`)
        console.log(clickedMarkers)
    }

    render() {
        const { classes, accountID } = this.props;
        const {
            markers,
            currentCoords,
            loaded,
            isOpen,
        } = this.state;

        console.log(currentCoords);

        return (
            <div className={classes.root}>
                <div className={classes.content}>
                    {
                      loaded ?
                      (
                          <PublicRequestMap
                              isMarkerShown={true}
                              googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${process.env.GOOGLE_API_KEY}`}
                              loadingElement={<div style={{ height: `100%` }} />}
                              containerElement={<div style={{ height: `600px` }} />}
                              mapElement={<div style={{ height: `100%` }} />}
                              markers={markers}
                              currentCoords={currentCoords}
                              isOpen={isOpen}
                              onToggleOpen={this.onToggleOpen}
                              onMarkerClustererClick={this.onMarkerClustererClick}
                          />
                      ) : (
                        <Loader open={!loaded} />
                      )
                    }
                </div>
            </div>
        );
    }
}

PublicRequestMapView.defaultProps = {
    accountID: '',
    employeeID: '',
    fetchRequests: f => f,
};
PublicRequestMapView.propTypes = {
    accountID: PropTypes.string,
    employeeID: PropTypes.string,
    fetchRequests: PropTypes.func,
    classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(PublicRequestMapView);
