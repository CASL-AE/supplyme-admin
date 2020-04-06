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

import LocationResultsTable from '../../../components/Xupply/Location/LocationResultsTable';

import { validateString, dispatchNewRoute, filterBy } from '../../../utils/misc';
import { fetchLocations } from '../../../services/location/actions';
import { locationRowObject } from '../../../services/location/model';

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
        locations: state.locationData.locations,
        receivedAt: state.locationData.receivedAt,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: {},
    };
}

@connect(mapStateToProps, mapDispatchToProps)
class LocationListView extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            location: {},
            showLocationDialog: false,
            rows: [],
        };
    }

    componentDidMount() {
        console.log('Locations View Mounted');
        const { receivedAt, locations } = this.props;
        if (!receivedAt) {
            // this.loadCompData();
        } else {
            this.receiveLocations(locations);
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.receivedAt && !this.props.receivedAt) {
            this.receiveLocations(nextProps.locations);
        }
        // if (nextProps.location.isLoaded && this.props.location.isFetching) {
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
        console.log('Locations View Updated');
    }

    componentWillUnmount() {
        console.log('Locations View UnMounted');
        const { actions } = this.props;
        // actions.unmountLocationListener();
        this.receiveLocations = undefined;
        this.loadCompData = undefined;
        this.render = undefined;
    }

    receiveLocations = (locations) => {
        console.warn('Received Locations');
        const rows = filterBy(locations).map(e => locationRowObject(e));

        this.setState({
            rows,
        });
    }

    loadCompData = () => {
        const { actions, employeeID, accountID } = this.props;
        actions.fetchLocations(accountID);
    }

    dispatchNewLocation = (e, locationID) => {
        e.preventDefault();
        const { accountID } = this.props;
        const route = `/accounts/${accountID}/locations/${locationID}`
        dispatchNewRoute(route);
    }

    render() {
        const { classes, accountID } = this.props;
        const {
            rows,
        } = this.state;

        const GeneralContainer = (
            <div className={classes.outerCell}>
            <Button
              variant="contained"
              disableRipple
              disableFocusRipple
              className={classes.firstButton}
              classes={{ label: classes.buttonLabel }}
              onClick={e => dispatchNewRoute(`/accounts/${accountID}/locations/create`)}
            >
                {'+ New Location'}
            </Button>
            </div>
        );
        return (
            <div className={classes.root}>
                <div className={classes.content}>
                    <div className={classes.headerCell}>
                        {GeneralContainer}
                    </div>
                    <LocationResultsTable
                        type={'location'}
                        rows={rows}
                        handleLink={this.dispatchNewLocation}
                    />
                </div>
            </div>
        );
    }
}

LocationListView.defaultProps = {
    accountID: '',
    employeeID: '',
    fetchLocations: f => f,
    bulkUploadLocations: f => f,
};
LocationListView.propTypes = {
    accountID: PropTypes.string,
    employeeID: PropTypes.string,
    fetchLocations: PropTypes.func,
    bulkUploadLocations: PropTypes.func,
    classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(LocationListView);
