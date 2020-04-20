/* eslint camelcase: 0, no-underscore-dangle: 0 */
import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import Switch from '@material-ui/core/Switch';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import IconButton from '@material-ui/core/IconButton';
import RemoveCircleOutlineIcon from '@material-ui/icons/RemoveCircleOutline';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';

import Loader from '../../../components/Xupply/Base/Loader';
import UploadMedia from '../../../components/Xupply/Media/UploadMedia';

import AutoCompleteLocations from '../../../components/Xupply/AutoCompletes/AutoCompleteLocations';

import { toNewMenuItem, toNewQuantity } from '../../../services/menuItem/model';
import { saveNewMenuItem, updateMenuItem, deleteMenuItem } from '../../../services/menuItem/actions';
import { geocodeGooglePlace } from '../../../services/google/actions';
import {
    getKeys,
    validateString,
    validateDate,
    validateEmail,
    validateDatePick,
    roundUp,
} from '../../../utils/misc';

import { isMobileAndTablet } from '../../../utils/isMobileAndTablet';

function renderItemType() {
    const array = [];
    array.push(<MenuItem key={'product'} value={'product'}>Product</MenuItem>);
    array.push(<MenuItem key={'material'} value={'material'}>Material</MenuItem>);
    return array;
}
function renderPackageType() {
    const array = [];
    array.push(<MenuItem key={'piece'} value={'piece'}>Piece</MenuItem>);
    array.push(<MenuItem key={'box'} value={'box'}>Box</MenuItem>);
    array.push(<MenuItem key={'case'} value={'case'}>Case</MenuItem>);
    array.push(<MenuItem key={'carton'} value={'carton'}>Carton</MenuItem>);
    array.push(<MenuItem key={'pallet'} value={'pallet'}>Pallet</MenuItem>);
    array.push(<MenuItem key={'weight'} value={'weight'}>Weight</MenuItem>);
    return array;
}
function renderWeightType() {
    const array = [];
    array.push(<MenuItem key={'grain'} value={'grain'}>Grain</MenuItem>);
    array.push(<MenuItem key={'dr'} value={'dr'}>Dram</MenuItem>);
    array.push(<MenuItem key={'oz'} value={'oz'}>Ounce</MenuItem>);
    array.push(<MenuItem key={'lb'} value={'lb'}>Pound</MenuItem>);
    array.push(<MenuItem key={'cwt'} value={'cwt'}>Hundred Weight</MenuItem>);
    array.push(<MenuItem key={'ton'} value={'ton'}>Ton</MenuItem>);
    array.push(<MenuItem key={'lngcwt'} value={'lngcwt'}>Long CWT</MenuItem>);
    return array;
}

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
        backgroundColor: theme.palette.primary.appBar,
        borderRadius: 8,
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
    },
    subHeaderCell: {
        marginBottom: 24,
        display: 'block',
    },
    subHeaders: {
        display: 'inline-block',
        fontWeight: 500,
        fontSize: 20,
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
    textSmallField: {
        width: 100,
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
    flexCell: {
        display: 'flex',
        flexWrap: 'wrap',
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
        menuItems: state.menuItemData.menuItems,
        receivedAt: state.menuItemData.receivedAt,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: {
            saveNewMenuItem: bindActionCreators(saveNewMenuItem, dispatch),
            deleteMenuItem: bindActionCreators(deleteMenuItem, dispatch),
            updateMenuItem: bindActionCreators(updateMenuItem, dispatch),
        },
    };
}

@connect(mapStateToProps, mapDispatchToProps)
class MenuItemCreateView extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            menuItem: toNewMenuItem(),
            quantity: toNewQuantity(),
            quantityOpen: false,
            name_error_text: null,
            desc_error_text: null,
            brand_error_text: null,
            upc_error_text: null,
            redirectRoute: `/accounts/${this.props.accountID}/menuItems`,
            loading: false,
        };
    }

    componentDidMount() {
        console.log('MenuItem Create Mounted')
        this.loadCompData();
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.receivedAt !== null && this.props.receivedAt === null) {
            this.loadCompData(nextProps);
        }

    }

    componentWillUnmount() {
        console.log('MenuItem Create UnMounted')
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (nextState === this.state) {
            return false;
        }
        return true;
    }

    loadCompData = (props = this.props) => {
        const { menuItems, pathname } = props;
        const keys = getKeys(pathname);
        const itemID = keys.second;
        console.warn(itemID);
        if (itemID && itemID !== null) {
            menuItems.forEach((menuItem) => {
                if (menuItem.itemID === itemID) {
                    console.log('Setting MenuItem State')
                    const next_state = this.state;
                    next_state.menuItem = menuItem;
                    this.setState(next_state, () => {});
                }
            })
        }
    }

    handleChange = (e, parent, name) => {
        const { value } = e.target;
        const next_state = this.state;
        if (parent !== null) {
            next_state.menuItem[parent][name] = value;
        } else {
            next_state.menuItem[name] = value;
        }
        this.setState(next_state, () => {});
    }

    handleSwitch = (e, name) => {
        const { checked } = e.target;
        const next_state = this.state;
        next_state.menuItem[name] = checked;
        this.setState(next_state, () => {});
    }

    handleMenuItemSelected = (menuItem) => {
        const { place_id, description } = menuItem;
        const { main_text } = menuItem.structured_formatting;
        const { idToken, accountID } = this.props;
        const next_state = this.state;
        next_state.menuItem.name = description;
        geocodeGooglePlace(idToken, accountID, description).then((result) => {
            result.placeID = place_id
            next_state.menuItem.address = result;
            this.setState(next_state, () => {});
        });
    }

    handleQuantityChange = (e, name) => {
        const { value } = e.target;
        const next_state = this.state;
        next_state.quantity[name] = value;
        this.setState(next_state, () => {});
    }

    handleQuantitySelected = (e) => {
        console.warn(quantity)
        const next_state = this.state;
        const quantity = next_state.quantity;
        let next_levels = this.state.menuItem.quantities;
        if (next_levels.map(i => i).includes(quantity.pricePerUnit)) {
            next_levels = next_levels.filter(e => e !== quantity.pricePerUnit);
        } else {
            next_levels.push(quantity);
        }
        next_state.menuItem.quantities = next_levels;
        next_state.quantityOpen = false;
        next_state.quantity = toNewQuantity();
        this.setState(next_state, () => {});
    }

    deleteQuantity = (e, quantity) => {
        let next_state = this.state.menuItem.quantities
        for(let i = 0; i < next_state.length; i++){
            if(next_state[i] === quantity){
                next_state.splice(i,1)
            }
        }
        this.setState(next_state, () => {})
    }

    handleLocationSelected = (location) => {
        const next_state = this.state;
        next_state.quantity.location = location;
        this.setState(next_state, () => {});
    }

    isMenuItemDisabled() {
        let name_is_valid = false;
        let email_is_valid = false;

        // Validate MenuItem Name
        if (this.state.menuItem.contactInfo.name === null || this.state.menuItem.contactInfo.name === '') {
            this.setState({
                name_error_text: null,
            });
        } else if (validateString(this.state.menuItem.contactInfo.name) && this.state.menuItem.contactInfo.name.length < 40) {
            name_is_valid = true;
            this.setState({
                name_error_text: null,
            });
        } else {
            this.setState({
                name_error_text: `The menuItem first name must be a string and < ${40} and > 1 characters.`,
            });
        }

        // Validate MenuItem Email
        if (this.state.menuItem.contactInfo.email === null || this.state.menuItem.contactInfo.email === '') {
            this.setState({
                email_error_text: null,
            });
        } else if (validateEmail(this.state.menuItem.contactInfo.email) && this.state.menuItem.contactInfo.email.length < 40) {
            email_is_valid = true;
            this.setState({
                email_error_text: null,
            });
        } else {
            this.setState({
                email_error_text: `Please enter a valid email`,
            });
        }

        // console.warn(this.state.menuItem)
        // console.warn(name_is_valid)

        if (
            name_is_valid && email_is_valid
        ) {
            this.setState({
                disabled: false,
            });
        }
    }

    deleteActiveItem = (e) => {
        const {
            actions,
            idToken,
            employeeID,
            accountID,
        } = this.props;
        const { menuItem, redirectRoute } = this.state;
        e.preventDefault();
        swal({
            title: `Delete this Item?`,
            text: `Doing so will permanently delete the data for this Item?.`,
            icon: 'warning',
            buttons: {
                cancel: 'Cancel',
                menuItem: {
                    text: 'Delete',
                    value: 'delete',
                },
            },
        })
            .then((value) => {
                switch (value) {
                    case 'delete':
                        console.log(`Delete Item`);
                        actions.deleteMenuItem(employeeID, accountID, menuItem, redirectRoute);
                        break;
                    default:
                        break;
                }
            });
    }

    createNewMenuItem = () => {
        const { actions, idToken, employeeID, accountID } = this.props;
        const { menuItem, redirectRoute } = this.state;
        this.setState({loading: true});
        actions.saveNewMenuItem(idToken, employeeID, accountID, menuItem, redirectRoute);
    }

    updateThisMenuItem = () => {
        const { actions, idToken, employeeID, accountID } = this.props;
        const { menuItem, redirectRoute } = this.state;
        this.setState({loading: true});
        actions.updateMenuItem(employeeID, accountID, menuItem, redirectRoute);

    }

    toggleNewQuantity = (e, quantityOpen) => {
        this.setState({quantityOpen: quantityOpen})
    }

    renderItemQuantities = (quantity) => {
        const { classes } = this.props;
        return (
            <div key={quantity.pricePerUnit}>
                <IconButton
                  color='secondary'
                  disabled={false}
                  onClick={e => this.deleteQuantity(e, quantity)}
                >
                    <RemoveCircleOutlineIcon className={classes.iconButton} />
                </IconButton>
                <span className={classes.detailListDt}>
                    On Hand: {quantity.stock} In: {quantity.location.address.locality} - Price: $ {quantity.pricePerUnit} - {quantity.packageQuantity} / {quantity.packageType}
                </span>
            </div>
        );
    }

    onFinishedMediaSelected = (file) => {
        const next_state = this.state;
        next_state.menuItem.imageData = file;
        this.setState(next_state, () => {});
    }

    render() {
        const { classes } = this.props;
        const {
            menuItem,
            quantity,
            quantityOpen,
            name_error_text,
            desc_error_text,
            brand_error_text,
            upc_error_text,
            loading,
        } = this.state;

        const itemTypes = renderItemType();
        const packageTypes = renderPackageType();
        const weightTypes = renderWeightType();

        console.log(menuItem);

        const NameContainer = (
            <div className={classes.outerCell}>
                <div className={classes.subHeaderCell}>
                    <div className={classes.subHeaders}>
                        MenuItem Information
                    </div>
                </div>
                <div className={classes.childHeaderCell}>
                    <div className={classes.childHeaders}>
                        Enter the general menu item information.
                    </div>
                </div>
                <label className={classes.inputLabel}>Item Type</label>
                <div className={classes.textCell}>
                    <FormControl margin="dense" className={classes.textField}>
                        <Select
                            onChange={e => this.handleChange(e, null, 'itemType')}
                            value={menuItem.itemType}
                            variant="outlined"
                            inputProps={{
                                name: 'itemType',
                                id: 'itemType',
                            }}
                        >
                            {itemTypes}
                        </Select>
                    </FormControl>
                </div>
                <label className={classes.inputLabel}>Item Name</label>
                <div className={classes.textCell}>
                    <TextField
                        placeholder="Ex. N95 Mask"
                        margin="dense"
                        variant="outlined"
                        helperText={name_error_text}
                        value={menuItem.itemName || ''}
                        className={classes.textField}
                        onChange={e => this.handleChange(e, null, 'itemName')}
                        FormHelperTextProps={{ classes: { root: classes.helperText } }}
                    />
                </div>
                <div className={classes.childHeaderCell}>
                    <div className={classes.childHeaders}>
                        Measurement Information
                    </div>
                </div>
                <div className={classes.flexCell}>
                    <div className={classes.innerFlexCell}>
                        <label className={classes.inputLabel}>Measurement Label</label>
                        <div className={classes.textCell}>
                            <TextField
                              placeholder="Ex. oz"
                              margin="dense"
                              variant="outlined"
                              type="text"
                              // helperText={'thcContent_error_text'}
                              value={menuItem.measurement.label || ''}
                              className={classes.textSmallField}
                              onChange={e => this.handleChange(e, 'measurement', 'label')}
                              // FormHelperTextProps={{ classes: { root: classes.helperText } }}
                              autoComplete=""
                            />
                        </div>
                    </div>
                    <div className={classes.innerFlexCell}>
                        <label className={classes.inputLabel}>Measurement Units</label>
                        <div className={classes.textCell}>
                            <TextField
                              placeholder="Ex. 10"
                              margin="dense"
                              variant="outlined"
                              type="number"
                              // helperText={'cbdContent_error_text'}
                              value={menuItem.measurement.units || ''}
                              className={classes.textSmallField}
                              onChange={e => this.handleChange(e, 'measurement', 'units')}
                              // FormHelperTextProps={{ classes: { root: classes.helperText } }}
                              autoComplete=""
                            />
                        </div>
                    </div>
                    <div className={classes.innerFlexCell}>
                        <label className={classes.inputLabel}>Measurement Nickname</label>
                        <div className={classes.textCell}>
                            <TextField
                              placeholder="Ex. Small"
                              margin="dense"
                              variant="outlined"
                              type="text"
                              // helperText={'cbdContent_error_text'}
                              value={menuItem.measurement.nickname || ''}
                              className={classes.textSmallField}
                              onChange={e => this.handleChange(e, 'measurement', 'nickname')}
                              // FormHelperTextProps={{ classes: { root: classes.helperText } }}
                              autoComplete=""
                            />
                        </div>
                    </div>
                </div>
                <label className={classes.inputLabel}>Item Image</label>
                <div className={classes.textCell}>
                    <UploadMedia media={menuItem.fullSizeItemImageURL} onFinishedSelecting={this.onFinishedMediaSelected} />
                </div>
                <label className={classes.inputLabel}>Brand Name</label>
                <div className={classes.textCell}>
                    <TextField
                        placeholder="Ex. 3M"
                        margin="dense"
                        variant="outlined"
                        type="text"
                        helperText={brand_error_text}
                        value={menuItem.brandName || ''}
                        className={classes.textField}
                        onChange={e => this.handleChange(e, null, 'brandName')}
                        FormHelperTextProps={{ classes: { root: classes.helperText } }}
                    />
                </div>
                <label className={classes.inputLabel}>Item Description</label>
                <div className={classes.textCell}>
                    <TextField
                        placeholder="Ex. Particulate Respirator 8210"
                        margin="dense"
                        variant="outlined"
                        helperText={desc_error_text}
                        value={menuItem.description || ''}
                        className={classes.textField}
                        onChange={e => this.handleChange(e, null, 'description')}
                        FormHelperTextProps={{ classes: { root: classes.helperText } }}
                    />
                </div>
                <label className={classes.inputLabel}>Item UPC</label>
                <div className={classes.textCell}>
                    <TextField
                        placeholder="Ex. 50051138464573"
                        margin="dense"
                        variant="outlined"
                        type="text"
                        helperText={upc_error_text}
                        value={menuItem.upcID || ''}
                        className={classes.textField}
                        onChange={e => this.handleChange(e, null, 'upcID')}
                        FormHelperTextProps={{ classes: { root: classes.helperText } }}
                    />
                </div>
                <label className={classes.inputLabel}>DIY Item?</label>
                <div className={classes.textCell}>
                    <Switch
                        checked={menuItem.isDIY}
                        onChange={e => this.handleSwitch(e, null, 'isDIY')}
                        color="primary"
                    />
                </div>
                {
                  menuItem.isDIY
                  ? (
                    <section style={{margin: 0, padding: 0}}>
                        <label className={classes.inputLabel}>DIY Instructions</label>
                        <div className={classes.textCell}>
                            <UploadMedia media={menuItem.fullSizeItemImageURL} onFinishedSelecting={this.onFinishedMediaSelected} />
                        </div>
                    </section>
                  ) : null
                }
            </div>
        );

        const QuantityContainer = (
            <div className={classes.outerCell}>
                <div className={classes.subHeaderCell}>
                    <div className={classes.subHeaders}>
                        Menu Item Quantites Information
                    </div>
                </div>
                {menuItem.quantities.length > 0
                  ? (
                    <div className={classes.block}>
                        <dl className={classes.detailList}>
                            <div className={classes.detailListFlex}>
                                {menuItem.quantities.map(this.renderItemQuantities, this)}
                            </div>
                        </dl>
                    </div>
                  ) : null
                }
                <IconButton onClick={(e) => this.toggleNewQuantity(e, !this.state.quantityOpen)}>
                    <AddCircleOutlineIcon className={classes.iconButton} />
                    <span style={{ fontSize: 16, paddingLeft: 10 }}>Add New Quantity</span>
                </IconButton>
            </div>
        );

        const CreateQuantityContainer = (
          <div className={classes.outerCell}>
              <div className={classes.subHeaderCell}>
                  <div className={classes.subHeaders}>
                      Create Quantity
                  </div>
              </div>
              <div className={classes.flexCell}>
                <div className={classes.innerFlexCell}>
                    <label className={classes.inputLabel}>* Package Type</label>
                    <div className={classes.textCell}>
                        <Select
                            onChange={e => this.handleQuantityChange(e, 'packageType')}
                            value={quantity.packageType}
                            margin="dense"
                            variant="outlined"
                            inputProps={{
                                name: 'packageType',
                                id: 'packageType',
                            }}
                        >
                            {packageTypes}
                        </Select>
                    </div>
                </div>
                {
                  quantity.packageType === 'weight'
                  ? (
                    <div className={classes.innerFlexCell}>
                        <label className={classes.inputLabel}>* Weight Type</label>
                        <div className={classes.textCell}>
                            <Select
                                onChange={e => this.handleQuantityChange(e, 'weightType')}
                                value={quantity.weightType}
                                variant="outlined"
                                margin="dense"
                                inputProps={{
                                    name: 'weightType',
                                    id: 'weightType',
                                }}
                            >
                                {weightTypes}
                            </Select>
                        </div>
                    </div>
                  ) : null
                }
                <div className={classes.innerFlexCell}>
                    <label className={classes.inputLabel}>* Package Quantity</label>
                    <div className={classes.textCell}>
                        <TextField
                          placeholder="Ex. 10"
                          margin="dense"
                          variant="outlined"
                          type="number"
                          // helperText={'thcContent_error_text'}
                          value={quantity.packageQuantity || ''}
                          className={classes.textSmallField}
                          onChange={e => this.handleQuantityChange(e, 'packageQuantity')}
                          // FormHelperTextProps={{ classes: { root: classes.helperText } }}
                          autoComplete=""
                        />
                    </div>
                </div>
            </div>
            <div className={classes.flexCell}>
                <div className={classes.innerFlexCell}>
                    <label className={classes.inputLabel}>* Est. Price</label>
                    <div className={classes.textCell}>
                        <TextField
                          placeholder="$ 10.00"
                          margin="dense"
                          variant="outlined"
                          type="number"
                          // helperText={'thcContent_error_text'}
                          value={quantity.pricePerUnit || ''}
                          className={classes.textSmallField}
                          onChange={e => this.handleQuantityChange(e, 'pricePerUnit')}
                          // FormHelperTextProps={{ classes: { root: classes.helperText } }}
                          autoComplete=""
                        />
                    </div>
                </div>
                <div className={classes.innerFlexCell}>
                    <label className={classes.inputLabel}>* On Hand</label>
                    <div className={classes.textCell}>
                        <TextField
                          placeholder="10"
                          margin="dense"
                          variant="outlined"
                          type="number"
                          // helperText={'cbdContent_error_text'}
                          value={quantity.stock || ''}
                          className={classes.textSmallField}
                          onChange={e => this.handleQuantityChange(e, 'stock')}
                          // FormHelperTextProps={{ classes: { root: classes.helperText } }}
                          autoComplete=""
                        />
                    </div>
                </div>
            </div>
            <div className={classes.outerFlexCell}>
                <div className={classes.innerFlexCell}>
                    <label className={classes.inputLabel}>* Location</label>
                    <div className={classes.textField}>
                        <AutoCompleteLocations name={quantity.location.name} onFinishedSelecting={this.handleLocationSelected}/>
                    </div>
                </div>
            </div>
            <div className={classes.textCell}>
                <Button
                  variant="contained"
                  disableRipple
                  disableFocusRipple
                  onClick={this.handleQuantitySelected}
                  className={classes.createButton}
                >
                    {'Add Quantity'}
                </Button>
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
                        onClick={menuItem.active ? this.updateThisMenuItem : this.createNewMenuItem}
                        className={classes.createButton}
                        style={{ marginRight: 10 }}
                    >
                        {menuItem.active ? 'Update MenuItem' : 'Create MenuItem'}
                    </Button>
                    {
                      menuItem.active
                      ? (
                        <Button
                            variant="contained"
                            disableRipple
                            disableFocusRipple
                            onClick={this.deleteActiveItem}
                            className={classes.deleteButton}
                        >
                            {'Delete MenuItem'}
                        </Button>
                      ) : null
                    }
                </div>
            </div>
        )

        return (
            <div className={classes.root}>
            {
              loading
              ? (
                  <Loader open={loading} />
              ) : (
                  <div className={classes.content}>
                  <div className={classes.headerCell}>
                      <div className={classes.headers}>
                          {menuItem.active ? 'Edit MenuItem' : 'New MenuItem'}
                      </div>
                  </div>
                  {NameContainer}
                  {QuantityContainer}
                  {quantityOpen ? CreateQuantityContainer : null}
                  {CreateContainer}
                  </div>
              )
            }
            </div>
        );
    }
}

MenuItemCreateView.defaultProps = {
    saveNewMenuItem: f => f,
    deleteMenuItem: f => f,
    updateMenuItem: f => f,
};
MenuItemCreateView.propTypes = {
    saveNewMenuItem: PropTypes.func,
    updateMenuItem: PropTypes.func,
    deleteMenuItem: PropTypes.func,
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(MenuItemCreateView);
