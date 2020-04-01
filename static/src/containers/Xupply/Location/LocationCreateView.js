/* eslint camelcase: 0, no-underscore-dangle: 0 */
import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import IconButton from '@material-ui/core/IconButton';
import RemoveCircleOutlineIcon from '@material-ui/icons/RemoveCircleOutline';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import Button from '@material-ui/core/Button';

import { toNewLocation } from '../../../services/location/model';
import { saveNewLocation, updateLocation, deleteLocation } from '../../../services/location/actions';
import { geocodeGooglePlace } from '../../../services/google/actions';
import {
    getKeys,
    validateString,
    validateDate,
    validateEmail,
    validateDatePick,
    roundUp,
} from '../../../utils/misc';

import AutoCompleteHospitals from '../../../components/Xupply/AutoCompletes/AutoCompleteHospitals';
import PhoneTextInput from '../../../components/Xupply/Misc/PhoneTextInput';

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
        marginBottom: 40,
    },
    headerCell: {
        marginBottom: 40,
        display: 'block',
    },
    headers: {
        display: 'inline-block',
        fontWeight: 500,
        fontSize: 28,
        // fontFamily: 'AvenirNext-DemiBold',
    },
    subHeaderCell: {
        marginBottom: 24,
        display: 'block',
    },
    subHeaders: {
        display: 'inline-block',
        fontWeight: 500,
        fontSize: 20,
        // fontFamily: 'AvenirNext-DemiBold',
    },
    childHeaderCell: {
        marginTop: 16,
        marginBottom: 16,
    },
    childHeaders: {
        display: 'inline-block',
        fontWeight: 500,
        fontSize: 16,
    },
    textField: {
        width: 250,
    },
    textCell: {
        marginBottom: 15,
    },
    inputLabel: {
        fontSize: 13,
        fontFamily: 'AvenirNext',
        paddingBottom: 5,
        display: 'inline-block',
    },
    helperText: {
        fontSize: 12,
        color: '#d22323',
    },
    createButton: {
        color: '#ffffff',
        backgroundColor: theme.palette.primary.main,
        textTransform: 'none',
    },
    deleteButton: {
        color: theme.palette.primary.main,
        backgroundColor: '#e02626',
        textTransform: 'none',
    },
    outerFlexCell: {
        display: 'flex',
        flexWrap: 'wrap',
        marginBottom: 40,
    },
    innerFlexCell: {
        paddingRight: 10,
    },
    block: {
        marginBottom: 40,
    },
    detailList: {
        // borderTop: '1px solid #e6e6e6',
        paddingTop: 15,
        display: 'block',
    },
    detailListDt: {
        minWidth: '30%',
        border: 0,
        padding: '.5rem 0',
        margin: 0,
    },
    detailListDd: {
        minWidth: '60%',
        border: 0,
        fontWeight: 500,
        padding: '.5rem 0',
        margin: 0,
        marginLeft: 5,
    },
    detailListFlex: {
        // display: 'flex',
    },
});

function mapStateToProps(state) {
    return {
        pathname: state.router.location.pathname,
        idToken: state.app.idToken,
        employeeID: state.app.employeeID,
        accountID: state.app.accountID,
        locations: state.locationData.locations,
        receivedAt: state.locationData.receivedAt,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: {
            saveNewLocation: bindActionCreators(saveNewLocation, dispatch),
            deleteLocation: bindActionCreators(deleteLocation, dispatch),
            updateLocation: bindActionCreators(updateLocation, dispatch),
        },
    };
}

@connect(mapStateToProps, mapDispatchToProps)
class LocationCreateView extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            location: toNewLocation(),
            locationName: null,
            name_error_text: null,
            email_error_text: null,
            phoneNumber_error_text: null,
            disabled: true,
            redirectRoute: `/accounts/${this.props.accountID}/locations`,
        };
    }

    componentDidMount() {
        console.log('Location Create Mounted')
        this.loadCompData();
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.receivedAt !== null && this.props.receivedAt === null) {
            this.loadCompData(nextProps);
        }
    }

    componentWillUnmount() {
        console.log('Location Create UnMounted')
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (nextState === this.state) {
            return false;
        }
        return true;
    }

    loadCompData = (props = this.props) => {
        const { locations, pathname } = props;
        const keys = getKeys(pathname);
        const locationID = keys.second;
        console.warn(locationID);
        if (locationID && locationID !== null) {
            locations.forEach((location) => {
                if (location.locationID === locationID) {
                    console.log('Setting Location State')
                    const next_state = this.state;
                    next_state.location = location;
                    this.setState(next_state, () => {
                        this.isLocationDisabled();
                    });
                }
            })
        }
    }

    handlePhoneChange = (e, name) => {
        const { value } = e.target;
        const next_state = this.state;
        next_state.location.contactInfo[name] = value;
        this.setState(next_state, () => {
            this.isLocationDisabled();
        });
    }

    handleChange = (e, parent, name) => {
        const { value } = e.target;
        const next_state = this.state;
        if (parent) {
            next_state.location[parent][name] = value;
        } else {
            next_state.location[name] = value;
        }
        this.setState(next_state, () => {
            this.isLocationDisabled();
        });
    }

    handleLocationSelected = (location) => {
        const { place_id, description } = location;
        const { main_text } = location.structured_formatting;
        const { idToken, accountID } = this.props;
        const next_state = this.state;
        next_state.location.name = description;
        geocodeGooglePlace(idToken, accountID, description).then((result) => {
            result.placeID = place_id
            next_state.location.address = result;
            this.setState(next_state, () => {});
        });
    }

    isLocationDisabled() {
        this.setState({
            disabled: true,
        });
        let name_is_valid = false;
        let email_is_valid = false;

        // Validate Location Name
        if (this.state.location.contactInfo.name === null || this.state.location.contactInfo.name === '') {
            this.setState({
                name_error_text: null,
            });
        } else if (validateString(this.state.location.contactInfo.name) && this.state.location.contactInfo.name.length < 40) {
            name_is_valid = true;
            this.setState({
                name_error_text: null,
            });
        } else {
            this.setState({
                name_error_text: `The location first name must be a string and < ${40} and > 1 characters.`,
            });
        }

        // Validate Location Email
        if (this.state.location.contactInfo.email === null || this.state.location.contactInfo.email === '') {
            this.setState({
                email_error_text: null,
            });
        } else if (validateEmail(this.state.location.contactInfo.email) && this.state.location.contactInfo.email.length < 40) {
            email_is_valid = true;
            this.setState({
                email_error_text: null,
            });
        } else {
            this.setState({
                email_error_text: `Please enter a valid email`,
            });
        }

        // console.warn(this.state.location)
        // console.warn(name_is_valid)

        if (
            name_is_valid && email_is_valid
        ) {
            this.setState({
                disabled: false,
            });
        }
    }

    deleteActiveLocation = (e) => {
        const {
            actions,
            idToken,
            employeeID,
            accountID,
        } = this.props;
        const { location, redirectRoute } = this.state;
        e.preventDefault();
        swal({
            title: `Delete this Location?`,
            text: `Doing so will permanently delete the data for this Location?.`,
            icon: 'warning',
            buttons: {
                cancel: 'Cancel',
                request: {
                    text: 'Delete',
                    value: 'delete',
                },
            },
        })
            .then((value) => {
                switch (value) {
                    case 'delete':
                        console.log(`Delete Location`);
                        actions.deleteLocation(employeeID, accountID, location, redirectRoute);
                        break;
                    default:
                        break;
                }
            });
    }

    createNewLocation = () => {
        const { actions, idToken, employeeID, accountID } = this.props;
        const { location, redirectRoute } = this.state;
        actions.saveNewLocation(idToken, employeeID, accountID, location, redirectRoute);
    }

    updateThisLocation = () => {
        const { actions, idToken, employeeID, accountID } = this.props;
        const { location, redirectRoute } = this.state;
        actions.updateLocation(employeeID, accountID, location, redirectRoute);

    }

    render() {
        const { classes } = this.props;
        const {
            location,
            locationName,
            name_error_text,
            email_error_text,
            phoneNumber_error_text,
            disabled,
        } = this.state;


        const NameContainer = (
            <div className={classes.outerCell}>
                <div className={classes.subHeaderCell}>
                    <div className={classes.subHeaders}>
                        Location Information
                    </div>
                </div>
                <div className={classes.childHeaderCell}>
                    <div className={classes.childHeaders}>
                        Enter the location name and contact information.
                    </div>
                </div>
                <label className={classes.inputLabel}>Contact Name</label>
                <div className={classes.textCell}>
                    <TextField
                        placeholder="Ex. John Doe"
                        margin="dense"
                        variant="outlined"
                        helperText={name_error_text}
                        value={location.contactInfo.name}
                        className={classes.textField}
                        onChange={e => this.handleChange(e, 'contactInfo', 'name')}
                        FormHelperTextProps={{ classes: { root: classes.helperText } }}
                    />
                </div>
                <label className={classes.inputLabel}>Contact Email</label>
                <div className={classes.textCell}>
                    <TextField
                        placeholder="Ex. Email"
                        margin="dense"
                        variant="outlined"
                        type="email"
                        helperText={email_error_text}
                        value={location.contactInfo.email}
                        className={classes.textField}
                        onChange={e => this.handleChange(e, 'contactInfo', 'email')}
                        FormHelperTextProps={{ classes: { root: classes.helperText } }}
                    />
                </div>
                <label className={classes.inputLabel}>Contact Phone</label>
                <PhoneTextInput phoneNumber={location.contactInfo.phoneNumber} error_text={phoneNumber_error_text} handleChange={this.handlePhoneChange}/>
                <label className={classes.inputLabel}>Location</label>
                <div className={classes.textField}>
                    <AutoCompleteHospitals name={location.name} onFinishedSelecting={this.handleLocationSelected}/>
                </div>
            </div>
        );

        const CreateContainer = (
            <div className={classes.outerCell}>
                <div className={classes.textCell}>
                    <Button
                        variant="contained"
                        disableRipple
                        disableFocusRipple
                        onClick={location.active ? this.updateThisLocation : this.createNewLocation}
                        className={classes.createButton}
                        disabled={disabled}
                        style={{ marginRight: 10 }}
                    >
                        {location.active ? 'Update Location' : 'Create Location'}
                    </Button>
                    {
                      location.active
                      ? (
                        <Button
                            variant="contained"
                            disableRipple
                            disableFocusRipple
                            onClick={this.deleteActiveLocation}
                            className={classes.deleteButton}
                        >
                            {'Delete Location'}
                        </Button>
                      ) : null
                    }
                </div>
            </div>
        )

        return (
            <div className={classes.root}>
                <div className={classes.content}>
                    <div className={classes.headerCell}>
                        <div className={classes.headers}>
                            {location.active ? 'Edit Location' : 'New Location'}
                        </div>
                    </div>
                    {NameContainer}
                    {CreateContainer}
                </div>
            </div>
        );
    }
}

LocationCreateView.defaultProps = {
    saveNewLocation: f => f,
    deleteLocation: f => f,
    updateLocation: f => f,
};
LocationCreateView.propTypes = {
    saveNewLocation: PropTypes.func,
    updateLocation: PropTypes.func,
    deleteLocation: PropTypes.func,
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(LocationCreateView);
