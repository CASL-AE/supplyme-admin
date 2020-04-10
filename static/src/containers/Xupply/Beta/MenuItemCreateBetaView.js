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
import BetaMenuItemFormTable from '../../../components/Xupply/Beta/BetaMenuItemFormTable';
import WalletCheckoutDialog from '../../../components/Xupply/Wallet/WalletCheckoutDialog';


import { filterBy } from '../../../utils/misc';
import { validateAddress, validateString } from '../../../utils/validate';
import { toNewLocation } from '../../../services/location/model';
import { toNewQuantity } from '../../../services/menuItem/model';
import { toNewTotals } from '../../../services/request/model';
import { fetchPublicMenuItems, saveBetaMenuItem } from '../../../services/menuItem/actions';
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
            saveBetaMenuItem: bindActionCreators(saveBetaMenuItem, dispatch)
        },
    };
}

@connect(mapStateToProps, mapDispatchToProps)
class MenuItemCreateBetaView extends Component {

    constructor(props) {
        super(props);
        this.state = {
            location: toNewLocation(),
            totals: toNewTotals(),
            searchLocation: false,
            menuItems: [],
            approvedMenuItems: [],
            stockPerItem: {},
            isCheckout: false,
            disabled: false,
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
        this.setState({ menuItems: _menuItems });
    }

    loadCompData = () => {
        const { actions, employeeID, accountID } = this.props;
        console.warn('Fetching Search MenuItems');
        actions.fetchPublicMenuItems(employeeID, accountID);
    }

    loadLocationData = (location) => {
        this.setState({location});
    }

    handleChange = (e, name, itemID) => {
        const { value } = e.target;
        const next_state = this.state;
        if (!next_state.stockPerItem[itemID]) {
            next_state.stockPerItem[itemID] = {};
        }
        next_state.stockPerItem[itemID][name] = value;
        this.setState(next_state, () => {
            this.isRequestDisabled();
        });
    }

    handleCheckBox = (e, menuItem) => {
        const next_state = this.state;
        const itemID = menuItem.itemID;
        const found = this.state.approvedMenuItems.some(o => o.itemID === itemID);
        if (found) {
            next_state.approvedMenuItems = this.state.approvedMenuItems.filter(o => o.itemID !== itemID);
            delete next_state.stockPerItem[menuItem.itemID];
        } else {
            next_state.approvedMenuItems = [...this.state.approvedMenuItems, menuItem];
        }
        this.setState(next_state, () => {
            this.isRequestDisabled();
        });
    }

    handleLocationSelected = (location) => {
        const next_state = this.state;
        console.log(location)
        next_state.location = location;
        next_state.searchLocation = false;
        this.setState(next_state, () => {});
    }

    requestCheckout = (e) => {
        e.preventDefault();
        const next_state = this.state;
        Object.entries(next_state.stockPerItem).forEach((s) => {
            next_state.totals.items += s[1].quantity * s[1].pricePerUnit;
        });
        next_state.totals.serviceCharges = (next_state.totals.items * 0.025) + .30;
        next_state.totals.subTotal = next_state.totals.items + next_state.totals.serviceCharges;
        next_state.totals.tax = next_state.totals.subTotal * 0.085;
        next_state.totals.total = next_state.totals.subTotal + next_state.totals.tax;
        next_state.totals.due = next_state.totals.total;
        next_state.isCheckout = true;
        next_state.approvedMenuItems.forEach((i, index) => {
            const itemStock = next_state.stockPerItem[i.itemID];
            const quantityInfo = toNewQuantity();
            quantityInfo.stock = itemStock.quantity;
            quantityInfo.pricePerUnit = itemStock.pricePerUnit;
            quantityInfo.leadQuantity = itemStock.leadQuantity;
            quantityInfo.leadTime = itemStock.leadTime;
            quantityInfo.location = next_state.location;
            next_state.approvedMenuItems[index].quantities = [quantityInfo];
        });

        this.setState(next_state, () => {
            this.createNewMenuItems();
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
        let items_is_valid = false;
        let stock_is_valid = false;

        console.log(this.state.location)

        // Validate Request Name
        if (this.state.location.address.active === false && this.state.location.address.street1 === null) {
            this.setState({
                location_error_text: null,
            });
        } else if (validateAddress(this.state.location.address)) {
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
        if (this.state.menuItems === []) {
            this.setState({
                items_error_text: null,
            });
        } else if (this.state.menuItems.length > 0) {
            items_is_valid = true;
            this.setState({
                items_error_text: null,
            });
        } else {
            this.setState({
                items_error_text: `Please select a valid item`,
            });
        }

        if (
            location_is_valid && items_is_valid
        ) {
            this.setState({disabled: false})
        }
    }

    createNewMenuItems = () => {
        const { actions, idToken, employeeID, accountID } = this.props;
        const { approvedMenuItems, redirectRoute } = this.state;
        this.setState({loading: true});
        actions.saveBetaMenuItem(idToken, employeeID, accountID, approvedMenuItems, redirectRoute);
    }

    render() {
        const { classes } = this.props;
        const {
          location,
          searchLocation,
          menuItems,
          approvedMenuItems,
          stockPerItem,
          isCheckout,
          disabled,
          loading,
        } = this.state;

        // console.error(location)
        // console.error(menuItems)
        // console.error(approvedMenuItems)
        // console.error(stockPerItem)
        // console.error(isCheckout)

        return (
          <Grid container alignItems="center" justify="center" className={classes.root} spacing={isMobileAndTablet() ? 0 : 2}>
              <Grid item xs={isMobileAndTablet() ? 12 : 10}>
                  <Paper className={classes.content}>
                      <div className={classes.gridItemBoxInner}>
                          <div>
                              <h4 style={{ fontWeight: 300, fontSize: 20, textAlign: 'center', paddingBottom: 15 }}>{'New Menu Items'}</h4>
                              <div className={classes.divider} >
                                  <div className={classes.dividerLine} />
                              </div>
                              <div style={{paddingTop: 30, paddingLeft: 40, paddingRight: 40}}>
                                  <HomeIcon className={classes.iconButton} />
                                  <span style={{ fontSize: 16, paddingLeft: 10 }}>{`${location.name}`}</span>
                                  <span onClick={e => this.toggleLocation(e)} style={{ fontSize: 14, paddingLeft: 10, color: 'blue', cursor: 'pointer' }}>Change Location</span>
                              </div>
                              {
                                searchLocation
                                ? (
                                  <div style={{paddingTop: 30, paddingLeft: 40, paddingRight: 40}}>
                                      <AutoCompleteLocations
                                          name={location.name}
                                          onFinishedSelecting={this.handleLocationSelected}
                                      />
                                  </div>
                                ) : null
                              }
                              <BetaMenuItemFormTable
                                  menuItems={menuItems}
                                  approvedMenuItems={approvedMenuItems}
                                  stockPerItem={stockPerItem}
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
              </Grid>
          </Grid>
        );
    }
}

MenuItemCreateBetaView.defaultProps = {
    saveBetaMenuItem: f => f,
    fetchPublicMenuItems: f => f,
};

MenuItemCreateBetaView.propTypes = {
    saveBetaMenuItem: PropTypes.func.isRequired,
    fetchPublicMenuItems: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(MenuItemCreateBetaView);
