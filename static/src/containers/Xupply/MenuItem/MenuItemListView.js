/* eslint camelcase: 0, no-underscore-dangle: 0 */
import React from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import algoliasearch from "algoliasearch/lite";
import { InstantSearch, SearchBox, Configure } from "react-instantsearch-dom";

import MenuItemResultsTable from "../../../components/Xupply/MenuItem/MenuItemResultsTable";
import HitComponent from "../../../components/Xupply/MenuItem/MenuItemResultsRow";

import {
    dispatchNewRoute,
    filterBy,
} from "../../../utils/misc";
import { fetchMenuItems } from "../../../services/menuItem/actions";
import { menuItemRowObject } from "../../../services/menuItem/model";

const styles = (theme) => ({
    root: {
        flex: 1,
        display: "inline-block",
        width: "100%",
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
        display: "block",
    },
    firstButton: {
        marginTop: 28,
        color: "#ffffff",
        backgroundColor: theme.palette.primary.main,
        textTransform: "none",
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
            fetchMenuItems: bindActionCreators(fetchMenuItems, dispatch),
        },
    };
}
class MenuItemListView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            menuItem: {},
            showMenuItemDialog: false,
            rows: [],
            hitsPerPage: 5,
        };
    }

    searchClient = algoliasearch(
        "5EIN2BYQ8O",
        "db2234eba37bde834ae2504e6c6bbeca"
    );

    componentDidMount() {
        console.log("MenuItems View Mounted");
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
        console.log("MenuItems View Updated");
    }

    componentWillUnmount() {
        console.log("MenuItems View UnMounted");
        const { actions } = this.props;
        // actions.unmountMenuItemListener();
        this.receiveMenuItems = undefined;
        this.loadCompData = undefined;
        this.render = undefined;
    }

    receiveMenuItems = (menuItems) => {
        console.warn("Received MenuItems");
        var rows = [];
        filterBy(menuItems).forEach((m) => {
            m.quantities.forEach((q) => {
                rows.push(menuItemRowObject(m, q));
            });
        });
        this.setState({ rows });
    };

    loadCompData = () => {
        const { actions, employeeID, accountID } = this.props;
        actions.fetchMenuItems(employeeID, accountID);
    };

    dispatchNewMenuItem = (e, menuItemID) => {
        e.preventDefault();
        const { accountID } = this.props;
        const route = `/accounts/${accountID}/menuItems/${menuItemID}`;
        dispatchNewRoute(route);
    };

    setHitsPerPage = (number) => {
        this.setState({
            hitsPerPage: number
        })
    }

    render() {
        const { classes, accountID } = this.props;
        const { rows, hitsPerPage } = this.state;

        const GeneralContainer = (
            <div className={classes.outerCell}>
                <Button
                    variant="contained"
                    disableRipple
                    disableFocusRipple
                    className={classes.firstButton}
                    classes={{ label: classes.buttonLabel }}
                    onClick={(e) =>
                        dispatchNewRoute(
                            `/accounts/${accountID}/menuItems/create/beta`
                        )
                    }
                >
                    {"+ New MenuItem"}
                </Button>
            </div>
        );
        return (
            <div className={classes.root}>
                <div className={classes.content}>
                    <div className={classes.headerCell}>{GeneralContainer}</div>
                    <InstantSearch
                        indexName="MenuItems"
                        searchClient={this.searchClient}
                    >
                        <SearchBox />
                        <Configure hitsPerPage={hitsPerPage} />
                        <MenuItemResultsTable
                            rows={rows}
                            handleLink={this.dispatchNewMenuItem}
                            setHitsPerPage = {this.setHitsPerPage}
                            hitsPerPage = {hitsPerPage}
                        >
                            <HitComponent />
                        </MenuItemResultsTable>
                    </InstantSearch>
                </div>
            </div>
        );
    }
}

MenuItemListView.defaultProps = {
    accountID: "",
    employeeID: "",
    fetchMenuItems: (f) => f,
};
MenuItemListView.propTypes = {
    accountID: PropTypes.string,
    employeeID: PropTypes.string,
    fetchMenuItems: PropTypes.func,
    classes: PropTypes.object.isRequired,
};
let ListViewWithStyles =  withStyles(styles)(MenuItemListView)
export default connect(mapStateToProps, mapDispatchToProps)(ListViewWithStyles);
