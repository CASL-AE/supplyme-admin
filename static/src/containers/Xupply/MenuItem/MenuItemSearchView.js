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
import RemoveCircleOutlineIcon from '@material-ui/icons/RemoveCircleOutline';

import PublicMenuItemResultsTable from '../../../components/Xupply/MenuItem/PublicMenuItemResultsTable';

import { validateString, dispatchNewRoute, filterBy } from '../../../utils/misc';
import { fetchPublicMenuItems } from '../../../services/menuItem/actions';
import { toNewRequestItem } from '../../../services/request/model';

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
    block: {
        marginBottom: 40,
    },
    detailList: {
        // borderTop: '1px solid #e6e6e6',
        paddingTop: 15,
        display: 'block',
    },
    detailListFlex: {
        display: 'flex',
    },
});

function mapStateToProps(state) {
    return {
        router: state.router,
        idToken: state.app.idToken,
        employeeID: state.app.employeeID,
        accountID: state.app.accountID,
        menuItems: state.menuItemData.publicMenuItems,
        receivedAt: state.menuItemData.receivedPublicMenuItemsAt,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: {
            fetchPublicMenuItems: bindActionCreators(fetchPublicMenuItems, dispatch)
        },
    };
}

@connect(mapStateToProps, mapDispatchToProps)
class MenuItemSearchView extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            menuItems: [],
            menuItem: toNewRequestItem(),
            requestItems: [],
        };
    }

    componentDidMount() {
        console.log('MenuItems Search View Mounted');
        const { receivedAt, menuItems } = this.props;
        if (receivedAt === null) {
            this.loadCompData();
        } else {
            this.receiveMenuItems(menuItems);
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.receivedAt !== null && this.props.receivedAt === null) {
            this.receiveMenuItems(nextProps.menuItems);
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (nextState === this.state) {
            console.log('THis')
            return false;
        }
        return true;
    }

    componentDidUpdate() {
        console.log('MenuItems Search View Updated');
    }

    componentWillUnmount() {
        console.log('MenuItems Search View UnMounted');
        const { actions } = this.props;
        // actions.unmountMenuItemListener();
        this.receiveMenuItems = undefined;
        this.loadCompData = undefined;
        this.render = undefined;
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

    dispatchNewMenuItem = (e, menuItemID) => {
        e.preventDefault();
        const { accountID } = this.props;
        const route = `/accounts/${accountID}/menuItems/${menuItemID}`
        dispatchNewRoute(route);
    }

    handleMenuItemChange = (e, name) => {
        const { value } = e.target;
        const next_state = this.state;
        next_state.menuItem[name] = value;
        this.setState(next_state, () => {});
    }

    handleMenuItemAdd = (e, item) => {
        console.log('Item Added');
        console.warn(item);
        const next_state = this.state;
        next_state.menuItem.item = item;
        let next_items = this.state.requestItems;
        if (this.state.requestItems.map(i => i).includes(this.state.menuItem.item.itemID)) {
            next_items = next_items.filter(e => e !== this.state.menuItem.item.itemID);
        } else {
            next_items.push(this.state.menuItem);
        }
        next_state.requestItems = next_items;
        next_state.menuItem = toNewRequestItem();
        this.setState(next_state, () => {});
    }

    deleteMenuItem(e, item){
        let next_state = this.state.requestItems;
        for(let i = 0; i < next_state.length; i++){
            if(next_state[i] === item){
                next_state.splice(i,1);
            }
        }
        this.setState(next_state, () => {})
    }

    renderRequestMenuItems = (item) => {
        const { classes } = this.props;
        console.log(item);
        return (
            <div key={item.item.itemID}>
                <IconButton
                  color='secondary'
                  disabled={false}
                  onClick={e => this.deleteMenuItem(e, item)}
                >
                    <RemoveCircleOutlineIcon className={classes.iconButton} />
                </IconButton>
                <span className={classes.detailListDt}>
                    Item Name: {item.item.itemName} - Requested: {item.quantity}
                </span>
            </div>
        );
    }

    render() {
        const { classes, accountID, request, handleItemsSelected } = this.props;
        const {
            menuItems,
            requestItems,
        } = this.state;

        const GeneralContainer = (
            <div className={classes.outerCell}><h1>Search Menu Items</h1>
            {requestItems.length > 0
              ? (
                <div className={classes.block}>
                    <dl className={classes.detailList}>
                        <div className={classes.detailListFlex}>
                            {requestItems.map(this.renderRequestMenuItems, this)}
                        </div>
                    </dl>
                </div>
              ) : null
            }
            <Button
              variant="contained"
              disableRipple
              disableFocusRipple
              className={classes.firstButton}
              classes={{ label: classes.buttonLabel }}
              onClick={e => handleItemsSelected(e, requestItems)}
            >
                {'Back To Request'}
            </Button>
            </div>
        );

        return (
            <div className={classes.root}>
                <div className={classes.content}>
                    <div className={classes.headerCell}>
                        {GeneralContainer}
                    </div>
                    <PublicMenuItemResultsTable
                        menuItems={menuItems}
                        handleChange={this.handleMenuItemChange}
                        handleAction={this.handleMenuItemAdd}
                    />
                </div>
            </div>
        );
    }
}

MenuItemSearchView.defaultProps = {
    accountID: '',
    employeeID: '',
    fetchMenuItems: f => f,
};
MenuItemSearchView.propTypes = {
    accountID: PropTypes.string,
    employeeID: PropTypes.string,
    fetchMenuItems: PropTypes.func,
    request: PropTypes.object.isRequired,
    handleItemsSelected: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(MenuItemSearchView);
