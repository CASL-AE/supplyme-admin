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

import MenuItemResultsTable from '../../../components/Xupply/MenuItem/MenuItemResultsTable';
import MenuItemCard from '../../../components/Xupply/MenuItem/MenuItemCard';
import EmptyResults from '../../../components/Xupply/Base/EmptyResults';

import { validateString, dispatchNewRoute, filterBy } from '../../../utils/misc';
import { fetchMenuItems } from '../../../services/menuItem/actions';
import { menuItemRowObject } from '../../../services/menuItem/model';

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
        menuItems: state.menuItemData.menuItems,
        receivedAt: state.menuItemData.receivedAt,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: {
            fetchMenuItems: bindActionCreators(fetchMenuItems, dispatch)
        },
    };
}

@connect(mapStateToProps, mapDispatchToProps)
class MenuItemListView extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            menuItem: {},
            showMenuItemDialog: false,
            rows: [],
        };
    }

    componentDidMount() {
        console.log('MenuItems View Mounted');
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
        const { accountID } = nextProps;
        if (nextProps.receivedAt !== null && nextProps.menuItems.length === 0) {
            const route = `/accounts/${accountID}/menuItems/create/beta`;
            dispatchNewRoute(route);
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (nextState === this.state) {
            return false;
        }
        return true;
    }

    componentDidUpdate() {
        console.log('MenuItems View Updated');
    }

    componentWillUnmount() {
        console.log('MenuItems View UnMounted');
        const { actions } = this.props;
        // actions.unmountMenuItemListener();
        this.receiveMenuItems = undefined;
        this.loadCompData = undefined;
        this.render = undefined;
    }

    receiveMenuItems = (menuItems) => {
        console.warn('Received MenuItems');
        var rows = [];
        filterBy(menuItems).forEach((m) => {
              m.quantities.forEach((q) => {
                    rows.push(menuItemRowObject(m, q));
              });
        });
        this.setState({rows});
    }

    loadCompData = () => {
        const { actions, employeeID, accountID } = this.props;
        actions.fetchMenuItems(employeeID, accountID);
    }

    dispatchNewMenuItem = (e, menuItemID) => {
        e.preventDefault();
        const { accountID } = this.props;
        const route = `/accounts/${accountID}/menuItems/${menuItemID}`
        dispatchNewRoute(route);
    }

    renderMenuItemCard = (row) => {
        return (
            <Grid item xs={isMobileAndTablet() ? 12 : 3}>
              <MenuItemCard row={row} />
            </Grid>
        )
    }

    render() {
        const { classes, accountID } = this.props;
        const {
            rows,
        } = this.state;

        console.error(rows)

        return rows.length > 0
        ? (
          <Grid container className={classes.root} spacing={2}>
            {rows.map(this.renderMenuItemCard, this)}
          </Grid>
        ) : <EmptyResults isType='request'/>
    }
}

MenuItemListView.defaultProps = {
    accountID: '',
    employeeID: '',
    fetchMenuItems: f => f,
};
MenuItemListView.propTypes = {
    accountID: PropTypes.string,
    employeeID: PropTypes.string,
    fetchMenuItems: PropTypes.func,
    classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(MenuItemListView);
