/* eslint camelcase: 0, no-underscore-dangle: 0, react/jsx-indent-props: 0, max-len: 0, react/forbid-prop-types: 0 */
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

// Core UI
import deburr from 'lodash/deburr';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import HomeIcon from '@material-ui/icons/Home';

// Icons
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';

// Components
import AutoCompleteLocations from '../../../components/Xupply/AutoCompletes/AutoCompleteLocations';
import PublicMenuItemResultsTable from '../../../components/Xupply/MenuItem/PublicMenuItemResultsTable';
import WalletCheckoutDialog from '../../../components/Xupply/Wallet/WalletCheckoutDialog';


import { filterBy } from '../../../utils/misc';
import { validateAddress } from '../../../utils/validate';
import { toNewRequest } from '../../../services/request/model';
import { saveNewRequest } from '../../../services/request/actions';
import { fetchPublicMenuItems } from '../../../services/menuItem/actions';

const styles = theme => ({
    root: {
        flex: 1,
        height: '100%',
        background: 'linear-gradient(to right, #000000 0%, #79bac1 100%, #79bac1 100%, #79bac1 100%)',
    },
    rightContent: {
        margin: 'auto',
        width: '90%',
    },
    gridItem: {
      marginLeft: '3%',
      marginRight: '3%',
    },
    gridItemBox: {
      backgroundColor: '#fff',
      borderRadius: 8,
      boxShadow: '0 0.5rem 4rem 0.5rem rgba(0,0,0,0.08)',
    },
    gridItemBoxInner: {
      margin: 80,
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
class RequestCreateView extends Component {

    constructor(props) {
        super(props);
        this.state = {
            request: toNewRequest(),
            searchLocation: false,
            menuItems: [],
            fmenuItems: [],
            filter: {
                isDonation: false,
                isDIY: false,
            },
            isCheckout: false,
            disabled: true,
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
        this.setState({menuItems: _menuItems, fmenuItems: _menuItems});
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

    handleChange = (e, name) => {
        const { value } = e.target;
        const { quantity, pricePerUnit } = this.state.request.package;
        const next_state = this.state;
        next_state.request.package[name] = value;
        if (name === 'quantity') {
            next_state.request.budget = parseFloat(value, 2) * parseFloat(pricePerUnit, 2);
        } else {
            next_state.request.budget = parseFloat(quantity, 2) * parseFloat(value, 2);
        }
        if (name === 'pricePerUnit' && value === 0) {
            next_state.filter.isDonation = true;
        }
        this.setState(next_state, () => {});
    }

    handleCheckBox = (e, menuItem) => {
        const { quantity } = this.state.request.package;
        const next_state = this.state;
        const itemID = menuItem.itemID;
        const packageType = menuItem.quantities[0].packageType;
        const found = this.state.request.items.some(o => o.itemID === itemID);
        if (found) {
            next_state.request.stockPerItem[menuItem.itemID] = {packageType: packageType, quantity: quantity};
            if (quantity === 0) {
              next_state.request.items = this.state.request.items.filter(o => o.itemID !== itemID);
              delete next_state.request.stockPerItem[menuItem.itemID];
            }
        } else {
            next_state.request.items = [...this.state.request.items, menuItem];
            next_state.request.stockPerItem[menuItem.itemID] = {packageType: packageType, quantity: quantity};
        }
        this.setState(next_state, () => {});
    }

    handleLocationSelected = (location) => {
        const next_state = this.state;
        console.log(location)
        next_state.request.location = location;
        next_state.searchLocation = false;
        this.setState(next_state, () => {});
    }

    getWords = (menuItem) => {
        var newWords = '';
        if (menuItem.itemName && menuItem.itemName.length > 0) {
            newWords += `${menuItem.itemName}`.slice(0, menuItem.itemName.length).toLowerCase() + ' ';
        }
        if (menuItem.brandName && menuItem.brandName.length > 0) {
            newWords += `${menuItem.brandName}`.slice(0, menuItem.brandName.length).toLowerCase() + ' ';
        }
        if (menuItem.description && menuItem.description.length > 0) {
            newWords += `${menuItem.description}`.slice(0, menuItem.description.length).toLowerCase() + ' ';
        }
        return newWords;
    }

    searchItems = (e) => {
        const { value } = e.target;
        const next_state = this.state;
        const inputValue = deburr(value.trim()).toLowerCase();
        const next_rows = this.state.menuItems.filter((i) => {
            const words = this.getWords(i);
            return words.includes(inputValue);
        });
        next_state.fmenuItems = next_rows;
        this.setState(next_state, () => {});
    }

    handleFilter = (e, type) => {
        const { checked } = e.target;
        const next_state = this.state;
        next_state.filter[type] = checked;
        var next_rows = this.state.menuItems;
        if (checked) {
            if (type === 'isDonation') {
                next_rows = this.state.menuItems.filter((i) => {
                    return i.quantities[0].pricePerUnit === '0';
                });
            } else {
                next_rows = this.state.menuItems.filter((i) => {
                    return i[type] === checked;
                });
            }
        }
        next_state.fmenuItems = next_rows;
        this.setState(next_state, () => {});
    }

    toggleAddMenuItem = (e, menuItemOpen) => {
        this.setState({menuItemOpen: menuItemOpen})
    }

    requestCheckout = (e) => {
        e.preventDefault();
        this.setState({isCheckout: true});
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
        e.preventDefault();
        this.setState({
            disabled: true,
        });
        let location_is_valid = false;
        let priority_is_valid = false;
        let requestedBy_is_valid = false;
        let items_is_valid = false;
        let stock_is_valid = false;

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
          fmenuItems,
          filter,
          isCheckout,
          disabled,
        } = this.state;

        console.log(fmenuItems)
        console.error(request)

        const RequestContainer = (
          <div className={classes.rightContent}>
              <div className={classes.gridItem}>
                  <div className={classes.gridItemBox}>
                      <div className={classes.gridItemBoxInner}>
                          <div style={{padding: 60}}>
                              <h4 style={{ fontWeight: 300, fontSize: 20, textAlign: 'center', paddingBottom: 15 }}>{'Tell us about your Request?'}</h4>
                              <div className={classes.divider} >
                                  <div className={classes.dividerLine} />
                              </div>
                              <div style={{paddingTop: 40}}>
                                  <HomeIcon className={classes.iconButton} />
                                  <span style={{ fontSize: 16, paddingLeft: 10 }}>{`${request.location.name}`}</span>
                                  <span onClick={e => this.toggleLocation(e)} style={{ fontSize: 14, paddingLeft: 10, color: 'blue', cursor: 'pointer' }}>Change Location</span>
                              </div>
                              {
                                searchLocation
                                ? (
                                  <div style={{paddingTop: 10}}>
                                      <AutoCompleteLocations
                                          name={request.location.name}
                                          onFinishedSelecting={this.handleLocationSelected}
                                      />
                                  </div>
                                ) : null
                              }
                              <div style={{paddingTop: 10}}>
                              <TextField
                                  placeholder="Search Item Name"
                                  label="Search Item Name"
                                  variant="outlined"
                                  margin="dense"
                                  type="text"
                                  // helperText={name_error_text}
                                  // value={location.contactInfo.name}
                                  style={{paddingRight: 20, width: '60%'}}
                                  onChange={e => this.searchItems(e)}
                                  // FormHelperTextProps={{ classes: { root: classes.helperText } }}
                              />
                              <TextField
                                  placeholder="# of Pieces"
                                  label="# of Pieces"
                                  variant="outlined"
                                  margin="dense"
                                  type="number"
                                  // helperText={name_error_text}
                                  value={request.package.quantity || ''}
                                  style={{paddingRight: 20, width: '20%'}}
                                  onChange={e => this.handleChange(e, 'quantity')}
                                  // FormHelperTextProps={{ classes: { root: classes.helperText } }}
                              />
                              <TextField
                                  placeholder="Max Piece Price"
                                  label="Max Piece Price"
                                  variant="outlined"
                                  margin="dense"
                                  type="number"
                                  // helperText={name_error_text}
                                  value={request.package.pricePerUnit || ''}
                                  style={{width: '20%'}}
                                  onChange={e => this.handleChange(e, 'pricePerUnit')}
                                  // FormHelperTextProps={{ classes: { root: classes.helperText } }}
                              />
                              <div style={{paddingTop: 10}}>
                                  <FormControlLabel
                                      classes={{ label: classes.checkboxLabel }}
                                      control={
                                        <Checkbox
                                          checked={filter.isDIY}
                                          onChange={e => this.handleFilter(e, 'isDIY')}
                                          color="primary"
                                          className={classes.checkbox}
                                        />
                                      }
                                      label="DIY Only"
                                  />
                                  <FormControlLabel
                                      classes={{ label: classes.checkboxLabel }}
                                      control={
                                        <Checkbox
                                          checked={filter.isDonation}
                                          onChange={e => this.handleFilter(e, 'isDonation')}
                                          color="primary"
                                          className={classes.checkbox}
                                        />
                                      }
                                      label="Donations Only"
                                  />
                              </div>
                                  <PublicMenuItemResultsTable
                                      menuItems={fmenuItems}
                                      approvedMenuItems={request.items}
                                      handleCheckBox={this.handleCheckBox}
                                  />
                              </div>
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
                          </div>
                      </div>
                  </div>
              </div>
          </div>
        );

        return (
            <section>
            <div className={classes.root}>
                {RequestContainer}
            </div>
            <WalletCheckoutDialog open={isCheckout} request={request} handleClose={this.handleClose} />
            </section>
        );
    }
}

RequestCreateView.defaultProps = {
    saveNewRequest: f => f,
    fetchPublicMenuItems: f => f,
};

RequestCreateView.propTypes = {
    saveNewRequest: PropTypes.func.isRequired,
    fetchPublicMenuItems: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(RequestCreateView);

// <WalletCheckoutDialog />
