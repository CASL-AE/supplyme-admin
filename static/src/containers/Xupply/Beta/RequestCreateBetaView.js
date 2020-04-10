/* eslint camelcase: 0, no-underscore-dangle: 0, react/jsx-indent-props: 0, max-len: 0, react/forbid-prop-types: 0 */
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

// Core UI
import deburr from 'lodash/deburr';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import HomeIcon from '@material-ui/icons/Home';

// Components
import AutoCompleteLocations from '../../../components/Xupply/AutoCompletes/AutoCompleteLocations';
import BetaRequestFormTable from '../../../components/Xupply/Beta/BetaRequestFormTable';
import WalletCheckoutDialog from '../../../components/Xupply/Wallet/WalletCheckoutDialog';
import XupplyLoader from '../../../components/Xupply/Base/XupplyLoader';


import { filterBy } from '../../../utils/misc';
import { validateAddress, validateString } from '../../../utils/validate';
import { toNewRequest } from '../../../services/request/model';
import { saveNewRequest } from '../../../services/request/actions';
import { fetchPublicMenuItems } from '../../../services/menuItem/actions';
import { isMobileAndTablet } from '../../../utils/isMobileAndTablet';

const styles = theme => ({
    root: {
        flexGrow: 1,
    },
    content: {
        padding: isMobileAndTablet() ? 0 : theme.spacing(2),
        backgroundColor: theme.palette.primary.appBar,
        borderRadius: 8,
    },
    gridItemBoxInner: {
        padding: 30,
    },
    divider: {
        display: 'flex',
        color: '#5c5c5c',
        fontSize: 15,
    },
    dividerLine: {
        margin: 'auto',
        content: "",
        borderTop: '10px solid #000000',
        // flex: 1,
        width: 40,
        transform: 'translateY(50%)',
    },
    inputLabel: {
        fontSize: 13,
        fontFamily: 'AvenirNext',
        paddingBottom: 5,
        display: 'inline-block',
        textAlign: 'left',
    },
    continueButton: {
        textAlign: 'center',
        color: '#fff',
        backgroundColor: theme.palette.primary.main,
        textTransform: 'none',
        height: 45,
        width: '100%',
        fontSize: 14,
    },
    checkbox: {
        margin: 0,
        padding: 0,
        paddingRight: 10,
        marginLeft: 10,
    },
    checkboxLabel: {
        display: 'inline-block',
        fontWeight: 500,
        fontSize: 14,
        color: '#656565'
    },
});

function mapStateToProps(state) {
    return {
        idToken: state.app.idToken,
        employeeID: state.app.employeeID,
        accountID: state.app.accountID,
        menuItems: state.menuItemData.publicMenuItems,
        receivedAt: state.menuItemData.receivedPublicMenuItemsAt,
        locations: state.locationData.locations,
        receivedLocationsAt: state.locationData.receivedAt,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: {
            fetchPublicMenuItems: bindActionCreators(fetchPublicMenuItems, dispatch),
            saveNewRequest: bindActionCreators(saveNewRequest, dispatch)
        },
    };
}

@connect(mapStateToProps, mapDispatchToProps)
class RequestCreateBetaView extends Component {

    constructor(props) {
        super(props);
        this.state = {
            request: toNewRequest(),
            searchLocation: false,
            menuItemOpen: false,
            menuItems: [],
            isCheckout: false,
            disabled: true,
            loading: false,
        };
    }

    componentDidMount() {
        const { receivedAt, menuItems } = this.props;
        if (receivedAt === null) {
            this.loadCompData();
        } else {
            this.receiveMenuItems(menuItems);
        }
        const { receivedLocationsAt, locations } = this.props;
        if (receivedLocationsAt !== null) {
            this.loadLocationData(locations[0]);
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.receivedAt !== null && this.props.receivedAt === null) {
            this.receiveMenuItems(nextProps.menuItems);
        }
        if (nextProps.receivedLocationsAt !== null && this.props.receivedLocationsAt === null) {
            this.loadLocationData(nextProps.locations[0]);
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (nextState === this.state) {
            return false;
        }
        return true;
    }

    receiveMenuItems = (menuItems) => {
        console.warn('Received Search MenuItems');
        const _menuItems = filterBy(menuItems);
        this.setState({menuItems: _menuItems});
    }

    loadCompData = () => {
        const { actions, employeeID, accountID } = this.props;
        console.warn('Fetching Search MenuItems');
        actions.fetchPublicMenuItems(employeeID, accountID);
    }

    loadLocationData = (location) => {
        var { request } = this.state;
        request.location = location
        this.setState({request});
    }

    handleChange = (e, name, itemID) => {
        const { value } = e.target;
        const next_state = this.state;
        if (!next_state.request.stockPerItem[itemID]) {
            next_state.request.stockPerItem[itemID] = {};
        }
        next_state.request.stockPerItem[itemID][name] = value;
        this.setState(next_state, () => {
            this.isRequestDisabled();
        });
    }

    handleCheckBox = (e, menuItem) => {
        const next_state = this.state;
        const itemID = menuItem.itemID;
        const found = this.state.request.items.some(o => o.itemID === itemID);
        if (found) {
            next_state.request.items = this.state.request.items.filter(o => o.itemID !== itemID);
            delete next_state.request.stockPerItem[menuItem.itemID];
        } else {
            next_state.request.items = [...this.state.request.items, menuItem];
        }
        this.setState(next_state, () => {
            this.isRequestDisabled();
        });
    }

    handleLocationSelected = (location) => {
        const next_state = this.state;
        console.log(location)
        next_state.request.location = location;
        next_state.searchLocation = false;
        this.setState(next_state, () => {
            this.isRequestDisabled();
        });
    }

    requestCheckout = (e) => {
        e.preventDefault();
        const next_state = this.state;
        Object.entries(next_state.request.stockPerItem).forEach((s) => {
            next_state.request.totals.items += s[1].quantity * s[1].pricePerUnit;
        });
        next_state.request.totals.serviceCharges = (next_state.request.totals.items * 0.025) + .30;
        next_state.request.totals.subTotal = next_state.request.totals.items + next_state.request.totals.serviceCharges;
        next_state.request.totals.tax = next_state.request.totals.subTotal * 0.085;
        next_state.request.totals.total = next_state.request.totals.subTotal + next_state.request.totals.tax;
        next_state.request.totals.due = next_state.request.totals.total;
        next_state.isCheckout = true;
        this.setState(next_state, () => {
            this.isRequestDisabled();
        });
    }

    handleClose = (e) => {
        e.preventDefault();
        this.setState({isCheckout: false});
    }

    toggleLocation = (e) => {
        const { searchLocation } = this.state;
        this.setState({searchLocation: !searchLocation});
    }

    isRequestDisabled(e) {
        this.setState({
            disabled: true,
        });
        let location_is_valid = false;
        let priority_is_valid = false;
        let requestedBy_is_valid = false;
        let items_is_valid = false;
        let stock_is_valid = false;

        console.log(this.state.request)

        // Validate Request Name
        if (this.state.request.location.address.active === false && this.state.request.location.address.street1 === null) {
            this.setState({
                location_error_text: null,
            });
        } else if (validateAddress(this.state.request.location.address)) {
            location_is_valid = true;
            this.setState({
                location_error_text: null,
            });
        } else {
            this.setState({
                location_error_text: `Please select a valid location`,
            });
        }

        // Validate Request Email
        if (this.state.request.items === []) {
            this.setState({
                items_error_text: null,
            });
        } else if (this.state.request.items.length > 0) {
            items_is_valid = true;
            this.setState({
                items_error_text: null,
            });
        } else {
            this.setState({
                items_error_text: `Please select a valid item`,
            });
        }

        // console.warn(this.state.request)
        // console.warn(name_is_valid)

        if (
            location_is_valid && items_is_valid
        ) {
            this.setState({disabled: false})
        }
    }

    createNewRequest = () => {
        const { actions, idToken, employeeID, accountID } = this.props;
        const { request, redirectRoute } = this.state;
        actions.saveNewRequest(idToken, employeeID, accountID, request, redirectRoute);
    }

    render() {
        const { classes } = this.props;
        const {
          request,
          searchLocation,
          menuItems,
          isCheckout,
          disabled,
          loading,
        } = this.state;

        console.error(request)

        return (
            <Grid container alignItems="center" justify="center" className={classes.root} spacing={isMobileAndTablet() ? 0 : 2}>
                <Grid item xs={12}>
                    <Paper className={classes.content}>
                        <div className={classes.gridItemBoxInner}>
                            <div>
                                <h4 style={{ fontWeight: 300, fontSize: 20, textAlign: 'center', paddingBottom: 15 }}>{'New Request'}</h4>
                                <div className={classes.divider} >
                                    <div className={classes.dividerLine} />
                                </div>
                                <div style={{paddingTop: 30, paddingLeft: 40, paddingRight: 40}}>
                                    <HomeIcon className={classes.iconButton} />
                                    <span style={{ fontSize: 16, paddingLeft: 10 }}>{`${request.location.name}`}</span>
                                    <span onClick={e => this.toggleLocation(e)} style={{ fontSize: 14, paddingLeft: 10, color: 'blue', cursor: 'pointer' }}>Change Location</span>
                                </div>
                                {
                                  searchLocation
                                  ? (
                                    <div style={{paddingTop: 30, paddingLeft: 40, paddingRight: 40}}>
                                        <AutoCompleteLocations
                                            name={request.location.name}
                                            onFinishedSelecting={this.handleLocationSelected}
                                        />
                                    </div>
                                  ) : null
                                }
                                <BetaRequestFormTable
                                    menuItems={menuItems}
                                    approvedMenuItems={request.items}
                                    stockPerItem={request.stockPerItem}
                                    handleCheckBox={this.handleCheckBox}
                                    handleChange={this.handleChange}
                                />
                                {
                                  !searchLocation
                                  ? (
                                      <div style={{width: '50%', margin: 'auto'}}>
                                          <Button
                                              disableRipple
                                              disableFocusRipple
                                              disabled={disabled}
                                              onClick={e => this.requestCheckout(e)}
                                              className={classes.continueButton}
                                              variant="outlined"
                                          >
                                              {'Agree & Continue'}
                                          </Button>
                                      </div>
                                  ) : null
                                }
                            </div>
                        </div>
                    </Paper>
                    {
                      isCheckout
                      ? (
                        <WalletCheckoutDialog
                            open={isCheckout}
                            loading={loading}
                            request={request}
                            handleClose={this.handleClose}
                            handleSubmit={this.createNewRequest}
                        />
                      ) : null
                    }
                </Grid>
            </Grid>
        );
    }
}

RequestCreateBetaView.defaultProps = {
    saveNewRequest: f => f,
    fetchPublicMenuItems: f => f,
};

RequestCreateBetaView.propTypes = {
    saveNewRequest: PropTypes.func.isRequired,
    fetchPublicMenuItems: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(RequestCreateBetaView);
