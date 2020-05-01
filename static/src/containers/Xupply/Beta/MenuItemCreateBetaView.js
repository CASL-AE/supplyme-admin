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
import BetaManuMenuItemFormTable from '../../../components/Xupply/Beta/BetaManuMenuItemFormTable';
import BetaRetailerMenuItemFormTable from '../../../components/Xupply/Beta/BetaRetailerMenuItemFormTable';


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
        borderTop: '10px solid red',
        // flex: 1,
        width: 40,
        transform: 'translateY(50%)',
    },
    inputLabel: {
        fontSize: 13,
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
        accountType: state.app.accountType,
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
            loading: false,
            burnVariable: '', // Is saved to each menu item on submit. burn.variable
            redirectRoute: `/accounts/${this.props.accountID}/menuItems`,
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
        this.setState({
            menuItems: filterBy(menuItems)
        });
    }

    loadCompData = () => {
        const { actions, employeeID, accountID } = this.props;
        console.warn('Fetching Search MenuItems');
        actions.fetchPublicMenuItems(employeeID, accountID);
    }

    loadLocationData = (location) => {
        this.setState({location});
    }

    handleBurnVariable = (e) => {
        const { value } = e.target;
        console.log(value)
        const next_state = this.state;
        next_state.burnVariable = value;
        this.setState(next_state, () => {});
    }

    handleChange = (e, name, itemID) => {
        const next_state = this.state;
        const {value} = e.target;
        next_state.stockPerItem[itemID][name] = value;
        this.setState(next_state, () => {});
    }

    handleCheckBox = (e, menuItem) => {
        const { value } = e.target;
        const next_state = this.state;
        const itemID = menuItem.itemID;
        const found = this.state.approvedMenuItems.some(o => o.itemID === itemID);
        // If item exists and pricePerUnit is now 0; Remove Item
        if (found) {
            next_state.approvedMenuItems = this.state.approvedMenuItems.filter(o => o.itemID !== itemID);
            delete next_state.stockPerItem[menuItem.itemID];
        } else {
            next_state.approvedMenuItems = [...this.state.approvedMenuItems, menuItem];
            // Add New Quantity
            const newQuantity = toNewQuantity();
            newQuantity.packageQuantity = menuItem.quantities[0].packageQuantity;
            newQuantity.packageType = menuItem.quantities[0].packageType;
            newQuantity.measurement = menuItem.quantities[0].measurement;
            next_state.stockPerItem[itemID] = newQuantity;
        }
        this.setState(next_state, () => {});
    }

    handleLocationSelected = (location) => {
        const next_state = this.state;
        console.log(location)
        next_state.location = location;
        next_state.searchLocation = false;
        this.setState(next_state, () => {});
    }

    requestRetailerCheckout = (e) => {
        e.preventDefault();
        const next_state = this.state;
        Object.entries(next_state.stockPerItem).forEach((s) => {
            next_state.totals.items += s[1].stock * s[1].pricePerUnit;
        });
        next_state.totals.serviceCharges = (next_state.totals.items * 0.025) + .30;
        next_state.totals.subTotal = next_state.totals.items + next_state.totals.serviceCharges;
        next_state.totals.tax = next_state.totals.subTotal * 0.085;
        next_state.totals.total = next_state.totals.subTotal + next_state.totals.tax;
        next_state.totals.due = next_state.totals.total;
        next_state.isCheckout = true;
        next_state.approvedMenuItems.forEach((i, index) => {
            const itemStock = next_state.stockPerItem[i.itemID];
            console.log(itemStock)
            itemStock.location = next_state.location;
            next_state.approvedMenuItems[index].quantities = [itemStock];
        });

        this.setState(next_state, () => {
            this.createNewMenuItems();
        });
    }

    requestManufacturerCheckout = (e) => {
        e.preventDefault();
        const next_state = this.state;
        Object.entries(next_state.stockPerItem).forEach((s) => {
            next_state.totals.items += s[1].stock * s[1].pricePerUnit;
        });
        next_state.totals.serviceCharges = (next_state.totals.items * 0.025) + .30;
        next_state.totals.subTotal = next_state.totals.items + next_state.totals.serviceCharges;
        next_state.totals.tax = next_state.totals.subTotal * 0.085;
        next_state.totals.total = next_state.totals.subTotal + next_state.totals.tax;
        next_state.totals.due = next_state.totals.total;
        next_state.isCheckout = true;
        next_state.approvedMenuItems.forEach((i, index) => {
            var itemStock = next_state.stockPerItem[i.itemID];
            itemStock.location = next_state.location;
            next_state.approvedMenuItems[index].quantities = [itemStock];
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

    isRetailerRequestDisabled(e) {
        let location_is_valid = false;
        let items_is_valid = false;
        let stock_is_valid = false;

        // console.log(this.state.location)

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

        // Validate Request Items
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

        // Validate Request Stock Per Item
        if (this.state.stockPerItem === {}) {
            this.setState({
                stock_error_text: null,
            });
        } else if (Object.keys(this.state.stockPerItem).length > 0) {
            stock_is_valid = true;
            this.setState({
                stock_error_text: null,
            });
        } else {
            this.setState({
                stock_error_text: `Please select a valid stock`,
            });
        }

        if (
            location_is_valid &&
            items_is_valid &&
            stock_is_valid
        ) {
            this.requestRetailerCheckout(e);
        }
    }

    isManuRequestDisabled(e) {
        let location_is_valid = false;
        let items_is_valid = false;
        let stock_is_valid = false;

        // console.log(this.state.location)

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

        // Validate Request Items
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

        // Validate Request Stock Per Item
        if (this.state.stockPerItem === {}) {
            this.setState({
                stock_error_text: null,
            });
        } else if (Object.keys(this.state.stockPerItem).length > 0) {
            stock_is_valid = true;
            this.setState({
                stock_error_text: null,
            });
        } else {
            this.setState({
                stock_error_text: `Please select a valid stock`,
            });
        }

        if (
            location_is_valid &&
            items_is_valid &&
            stock_is_valid
        ) {
            this.requestManufacturerCheckout(e);
        }
    }

    createNewMenuItems = () => {
        const { actions, idToken, employeeID, accountID } = this.props;
        const { approvedMenuItems, redirectRoute } = this.state;
        this.setState({loading: true});
        actions.saveBetaMenuItem(idToken, employeeID, accountID, approvedMenuItems, redirectRoute);
    }


    renderManufacturerView() {
        const { classes, accountType } = this.props;
        const {
          location,
          searchLocation,
          menuItems,
          approvedMenuItems,
          stockPerItem,
          items_error_text,
          stock_error_text,
          isCheckout,
          loading,
          burnVariable
        } = this.state;
        return (
          <div className={classes.gridItemBoxInner}>
              <div>
                  <h4 style={{ color: 'red', fontWeight: 300, fontSize: 20, textAlign: 'center', paddingBottom: 15 }}>{'COVID19 PPE Inventory Form'}</h4>
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
                  <BetaManuMenuItemFormTable
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
                                onClick={e => this.isManuRequestDisabled(e)}
                                className={classes.continueButton}
                                variant="outlined"
                            >
                                {'Upload Menu Items'}
                            </Button>
                            <span className={classes.helperText}>{items_error_text}</span>
                        </div>
                    ) : null
                  }
              </div>
          </div>
        );
    }

    renderRetailerView() {
        const { classes, accountType } = this.props;
        const {
          location,
          searchLocation,
          menuItems,
          approvedMenuItems,
          stockPerItem,
          items_error_text,
          stock_error_text,
          isCheckout,
          loading,
          burnVariable
        } = this.state;
        return (
          <div className={classes.gridItemBoxInner}>
              <div>
                  <h4 style={{ color: 'red', fontWeight: 300, fontSize: 20, textAlign: 'center', paddingBottom: 15 }}>{'COVID19 PPE Inventory Form'}</h4>
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
                  <div style={{paddingTop: 30, paddingLeft: 40, paddingRight: 40}}>
                      <label className={classes.inputLabel}>Confirmed & Suspected Cases</label>
                      <div className={classes.textCell}>
                          <TextField
                            placeholder="# Cases"
                            label="# Cases"
                            margin="dense"
                            variant="outlined"
                            type="number"
                            // helperText={'password_error_text'}
                            value={burnVariable}
                            className={classes.textField}
                            onChange={e => this.handleBurnVariable(e)}
                            // FormHelperTextProps={{ classes: { root: classes.helperText } }}
                          />
                      </div>
                  </div>
                  <BetaRetailerMenuItemFormTable
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
                                onClick={e => this.isRetailerRequestDisabled(e)}
                                className={classes.continueButton}
                                variant="outlined"
                            >
                                {'Upload Menu Items'}
                            </Button>
                            <span className={classes.helperText}>{items_error_text}</span>
                        </div>
                    ) : null
                  }
              </div>
          </div>
        );
    }

    render() {
        const { classes, accountType } = this.props;

        return (
            <Grid container alignItems="center" justify="center" className={classes.root} spacing={isMobileAndTablet() ? 0 : 2}>
                <Grid item xs={12}>
                    <Paper className={classes.content}>
                          {accountType === 'retailer' && this.renderRetailerView()}
                          {accountType === 'manufacturer' && this.renderManufacturerView()}
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
