/* eslint camelcase: 0, no-underscore-dangle: 0 */
import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import IconButton from '@material-ui/core/IconButton';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import { KeyboardDatePicker } from '@material-ui/pickers';
import RemoveCircleOutlineIcon from '@material-ui/icons/RemoveCircleOutline';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';

import { toNewOpportunity, toNewOpportunityItem } from '../../../services/opportunity/model';
import { saveNewOpportunity, updateOpportunity, deleteOpportunity } from '../../../services/opportunity/actions';
import {
    getKeys,
    validateString,
    validateDate,
    validateEmail,
    validateDatePick,
    roundUp,
    formatDateNoTime,
} from '../../../utils/misc';

import AutoCompleteLocations from '../../../components/Xupply/AutoCompletes/AutoCompleteLocations';
import AutoCompleteMenuItems from '../../../components/Xupply/AutoCompletes/AutoCompleteMenuItems';

function renderPriorityType() {
    const array = [];
    array.push(<MenuItem key={'high'} value={'high'}>High</MenuItem>);
    array.push(<MenuItem key={'med'} value={'med'}>Medium</MenuItem>);
    array.push(<MenuItem key={'low'} value={'low'}>Low</MenuItem>);
    return array;
}

const styles = (theme) => ({
    root: {
        flex: 1,
        height: '100vh',
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
        orders: state.orderData.orders,
        receivedAt: state.orderData.receivedAt,
        requests: state.requestData.publicRequests,
        receivedPublicRequestsAt: state.requestData.receivedPublicRequestsAt,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: {
            saveNewOpportunity: bindActionCreators(saveNewOpportunity, dispatch),
            deleteOpportunity: bindActionCreators(deleteOpportunity, dispatch),
            updateOpportunity: bindActionCreators(updateOpportunity, dispatch),
        },
    };
}

@connect(mapStateToProps, mapDispatchToProps)
class OpportunityCreateView extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            order: toNewOpportunity(),
            menuItemOpen: false,
            requiredBy_error_text: null,
            // phoneNumber_error_text: null,
            redirectRoute: `/accounts/${this.props.accountID}/orders`,
        };
    }

    componentDidMount() {
        console.log('Opportunity Create Mounted')
        this.loadRequestData();
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.receivedPublicRequestsAt !== null && this.props.receivedPublicRequestsAt === null) {
            this.loadRequestData(nextProps);
        }
    }

    componentWillUnmount() {
        console.log('Opportunity Create UnMounted')
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (nextState === this.state) {
            return false;
        }
        return true;
    }

    loadRequestData = (props = this.props) => {
        const { requests, pathname } = props;
        const keys = getKeys(pathname);
        const requestID = keys.third;
        if (requestID && requestID !== null) {
            requests.forEach((request) => {
                if (request.requestID === requestID) {
                    console.log('Setting Request State')
                    const next_state = this.state;
                    next_state.order.request = request;
                    request.menuItems.forEach((item) => {
                        const newItem = toNewOpportunityItem();
                        newItem.item = item.item;
                        next_state.order.menuItems.push(newItem)
                    })
                    this.setState(next_state, () => {});
                }
            })
        }
    }

    handleChange = (e, parent, name) => {
        const { value } = e.target;
        const next_state = this.state;
        next_state.order[name] = value;
        this.setState(next_state, () => {});
    }

    handleDateChange = (name) => (date) => {
        const next_state = this.state;
        next_state.order[name] = date.toDate();
        this.setState(next_state, () => {});
    }

    handleLocationSelected = (location) => {
        const next_state = this.state;
        console.log(location)
        next_state.order.location = location;
        this.setState(next_state, () => {});
    }

    handleMenuItemChange = (e, name, index) => {
        const { value } = e.target;
        const next_state = this.state;
        next_state.order.menuItems[index][name] = value;
        this.setState(next_state, () => {});
    }

    handleMenuItemAdd = () => {
        const next_state = this.state;
        let next_items = this.state.order.menuItems;
        if (this.state.order.menuItems.map(i => i).includes(this.state.menuItem.item.itemID)) {
            next_items = next_items.filter(e => e !== this.state.menuItem.item.itemID);
        } else {
            next_items.push(this.state.menuItem);
        }
        next_state.order.menuItems = next_items;
        next_state.menuItemOpen = false;
        next_state.menuItem = toNewOpportunityItem();
        this.setState(next_state, () => {});
    }

    handleMenuItemSelected = (item) => {
        console.log(item)
        const next_state = this.state;
        next_state.menuItem.item = item;
        this.setState(next_state, () => {});
    }

    isOpportunityDisabled() {
        this.setState({
            disabled: true,
        });
        let name_is_valid = false;
        let email_is_valid = false;

        // Validate Opportunity Name
        if (this.state.order.contactInfo.name === null || this.state.order.contactInfo.name === '') {
            this.setState({
                name_error_text: null,
            });
        } else if (validateString(this.state.order.contactInfo.name) && this.state.order.contactInfo.name.length < 40) {
            name_is_valid = true;
            this.setState({
                name_error_text: null,
            });
        } else {
            this.setState({
                name_error_text: `The order first name must be a string and < ${40} and > 1 characters.`,
            });
        }

        // Validate Opportunity Email
        if (this.state.order.contactInfo.email === null || this.state.order.contactInfo.email === '') {
            this.setState({
                email_error_text: null,
            });
        } else if (validateEmail(this.state.order.contactInfo.email) && this.state.order.contactInfo.email.length < 40) {
            email_is_valid = true;
            this.setState({
                email_error_text: null,
            });
        } else {
            this.setState({
                email_error_text: `Please enter a valid email`,
            });
        }

        // console.warn(this.state.order)
        // console.warn(name_is_valid)

        if (
            name_is_valid && email_is_valid
        ) {
            this.setState({
                disabled: false,
            });
        }
    }

    deleteActiveProperty = (e) => {
        const {
            actions,
            idToken,
            employeeID,
            accountID,
        } = this.props;
        const { order, redirectRoute } = this.state;
        e.preventDefault();
        swal({
            title: `Delete this Property?`,
            text: `Doing so will permanently delete the data for this Property?.`,
            icon: 'warning',
            buttons: {
                cancel: 'Cancel',
                order: {
                    text: 'Delete',
                    value: 'delete',
                },
            },
        })
            .then((value) => {
                switch (value) {
                    case 'delete':
                        console.log(`Delete Property`);
                        actions.deleteOpportunity(employeeID, accountID, order, redirectRoute);
                        break;
                    default:
                        break;
                }
            });
    }

    createNewOpportunity = () => {
        const { actions, idToken, employeeID, accountID } = this.props;
        const { order, redirectRoute } = this.state;
        actions.saveNewOpportunity(idToken, employeeID, accountID, order, redirectRoute);
    }

    updateThisOpportunity = () => {
        const { actions, idToken, employeeID, accountID } = this.props;
        const { order, redirectRoute } = this.state;
        actions.updateOpportunity(employeeID, accountID, order, redirectRoute);

    }

    deleteMenuItem(e, item){
        let next_state = this.state.order.menuItems
        for(let i = 0; i < next_state.length; i++){
            if(next_state[i] === item){
                next_state.splice(i,1)
            }
        }
        this.setState(next_state, () => { })
    }

    toggleAddMenuItem = (e, menuItemOpen) => {
        this.setState({menuItemOpen: menuItemOpen})
    }

    renderOpportunityMenuItems = (item, index) => {
        console.log(item)
        console.log(index)
        const { classes } = this.props;
        return (
            <div key={item.item.itemID}>
                <span className={classes.detailListDt}>
                    Item Name: {item.item.itemName} - Requested: {item.quantity}
                </span>
                <div className={classes.textCell}>
                    <TextField
                      placeholder="Ex. 10"
                      label="Quantity"
                      margin="dense"
                      variant="outlined"
                      type="number"
                      // helperText={'cbdContent_error_text'}
                      // value={menuItemQuaa.stock || ''}
                      className={classes.textFieldSmall}
                      onChange={e => this.handleMenuItemChange(e, 'quantity', index)}
                      // FormHelperTextProps={{ classes: { root: classes.helperText } }}
                      autoComplete=""
                    />
                </div>
                <span className={classes.detailListDt}>
                    Available: 240
                </span>
            </div>
        );
    }

    render() {
        const { classes } = this.props;
        const {
            order,
            requiredBy_error_text,
            menuItemOpen,
        } = this.state;

        const priorityTypes = renderPriorityType();

        console.log(order)

        const NameContainer = (
            <div className={classes.outerCell}>
                <div className={classes.subHeaderCell}>
                    <div className={classes.subHeaders}>
                        Request Information
                    </div>
                </div>
                <div className={classes.childHeaderCell}>
                    <div className={classes.childHeaders}>
                        The Request information attached to the order.
                    </div>
                </div>
                <div className={classes.childHeaderCell}>
                    <div className={classes.childHeaders}>
                        <span style={{fontWeight: 600}}>Request ID:</span> {order.request.requestID}
                    </div>
                </div>
                <div className={classes.childHeaderCell}>
                    <div className={classes.childHeaders}>
                        <span style={{fontWeight: 600}}>Request Budget:</span> {order.request.budget}
                    </div>
                </div>
                <div className={classes.childHeaderCell}>
                    <div className={classes.childHeaders}>
                        <span style={{fontWeight: 600}}>Request Priority:</span> {order.request.priority}
                    </div>
                </div>
                <div className={classes.childHeaderCell}>
                    <div className={classes.childHeaders}>
                        <span style={{fontWeight: 600}}>Request Required By:</span> {formatDateNoTime(order.request.requiredBy)}
                    </div>
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
                        onClick={order.active ? this.updateThisOpportunity : this.createNewOpportunity}
                        className={classes.createButton}
                        style={{ marginRight: 10 }}
                    >
                        {order.active ? 'Update Opportunity' : 'Create Opportunity'}
                    </Button>
                    <Button
                        variant="contained"
                        disableRipple
                        disableFocusRipple
                        onClick={this.deleteActiveProperty}
                        className={classes.deleteButton}
                    >
                        {'Delete Opportunity'}
                    </Button>
                </div>
            </div>
        );

        const MenuItemsContainer = (
            <div className={classes.outerCell}>
                <div className={classes.subHeaderCell}>
                    <div className={classes.subHeaders}>
                        Requested Menu Items
                    </div>
                </div>
                <div className={classes.block}>
                    <dl className={classes.detailList}>
                        <div className={classes.detailListFlex}>
                            {order.request.menuItems.map(this.renderOpportunityMenuItems, this)}
                        </div>
                    </dl>
                </div>
            </div>
        );

        return (
            <div className={classes.root}>
                <div className={classes.content}>
                    <div className={classes.headerCell}>
                        <div className={classes.headers}>
                            {order.active ? 'Edit Opportunity' : 'New Opportunity'}
                        </div>
                    </div>
                    {NameContainer}
                    {MenuItemsContainer}
                    {CreateContainer}
                </div>
            </div>
        );
    }
}

OpportunityCreateView.defaultProps = {
    saveNewOpportunity: f => f,
    deleteOpportunity: f => f,
    updateOpportunity: f => f,
};
OpportunityCreateView.propTypes = {
    saveNewOpportunity: PropTypes.func,
    updateOpportunity: PropTypes.func,
    deleteOpportunity: PropTypes.func,
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(OpportunityCreateView);


// const AddMenuItemContainer = (
//   <div className={classes.outerCell}>
//       <div className={classes.subHeaderCell}>
//           <div className={classes.subHeaders}>
//               Add Menu Item & Quantity
//           </div>
//       </div>
//       <div>
//           <AutoCompleteMenuItems onFinishedSelecting={this.handleMenuItemSelected} />
//       </div>

//       <div className={classes.textCell}>
//           <Button
//             variant="contained"
//             disableRipple
//             disableFocusRipple
//             onClick={this.handleMenuItemAdd}
//             className={classes.createButton}
//           >
//               {'Add Menu Item'}
//           </Button>
//       </div>
//   </div>
// );
