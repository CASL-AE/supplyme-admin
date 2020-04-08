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

import LocationResultsTable from '../../../components/Xupply/Location/LocationResultsTable';
import LocationCard from '../../../components/Xupply/Location/LocationCard';
import EmptyResults from '../../../components/Xupply/Base/EmptyResults';

import { validateString, dispatchNewRoute, filterBy } from '../../../utils/misc';
import { fetchLocations } from '../../../services/location/actions';
import { locationRowObject } from '../../../services/location/model';
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
        height: 80,
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

    renderLocationCard = (row) => {
        return (
            <Grid item xs={isMobileAndTablet() ? 12 : 4}>
              <LocationCard row={row} handleLink={this.dispatchNewLocation} />
            </Grid>
        )
    }

    render() {
        const { classes, accountID } = this.props;
        const {
            rows,
        } = this.state;

        return rows.length > 0
        ? (
          <section>
              <div className={classes.headerCell}>
                  <Fab
                      aria-label={'Add'}
                      className={isMobileAndTablet() ? classes.fab : null}
                      color={'primary'}
                      onClick={e => dispatchNewRoute(`/accounts/${accountID}/locations/create`)}
                  >
                    <AddIcon />
                  </Fab>
              </div>
              <Grid container className={classes.root} spacing={3}>
                {rows.map(this.renderLocationCard, this)}
              </Grid>
          </section>
        ) : (
            <EmptyResults
                title={`You haven't created any requests...`}
                message={`You will see active requests appear here. Create one to get started...`}
            />
        )
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
