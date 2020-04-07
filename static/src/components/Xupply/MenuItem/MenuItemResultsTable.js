import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableFooter from "@material-ui/core/TableFooter";
import Paper from "@material-ui/core/Paper";
import Tooltip from "@material-ui/core/Tooltip";
import Pagination from "./Pagination";

const styles = (theme) => ({
    root: {
        width: "100%",
        marginTop: 40,
        boxShadow: "none",
        borderRadius: 8,
        padding: 30,
    },
    table: {},
    tableHeaders: {
        fontSize: 12,
        fontWeight: 500,
        borderBottom: "1px solid #d6d6d6",
        borderLeft: 0,
        verticalAlign: "bottom",
        color: theme.palette.primary.black,
    },
    linkText: {
        color: "#82a4bc !important",
        fontWeight: "600px !important",
        cursor: "pointer",
        textAlign: "left",
        fontSize: "14px !important",
    },
    cancelIcon: {
        color: "#e02626",
        margin: 0,
        padding: 0,
    },
    checkIcon: {
        color: "#37e026",
        margin: 0,
        padding: 0,
    },
});

const ImageTooltip = withStyles((theme) => ({
    tooltip: {
        backgroundColor: "#f5f5f9",
        color: "rgba(0, 0, 0, 0.87)",
        maxWidth: 220,
        fontSize: theme.typography.pxToRem(12),
        border: "1px solid #dadde9",
    },
}))(Tooltip);

const LocationTooltip = withStyles((theme) => ({
    tooltip: {
        backgroundColor: "#f5f5f9",
        color: "rgba(0, 0, 0, 0.87)",
        maxWidth: 220,
        fontSize: theme.typography.pxToRem(12),
        border: "1px solid #dadde9",
    },
}))(Tooltip);

function MenuItemResultsTable(props) {
    const { classes, setHitsPerPage, hitsPerPage } = props;

    const handleChangeRowsPerPage = (e, cb) => {
        let number = parseInt(e.target.value, 10);
        setHitsPerPage(number);
        cb(number);
    };
    return (
        <Paper className={classes.root}>
            <Table size="small" className={classes.table}>
                <TableHead>
                    <TableRow>
                        <TableCell className={classes.tableHeaders}>
                            Name
                        </TableCell>
                        <TableCell className={classes.tableHeaders}>
                            Package Details
                        </TableCell>
                        <TableCell className={classes.tableHeaders}>
                            Package Price
                        </TableCell>
                        <TableCell className={classes.tableHeaders}>
                            Brand Name
                        </TableCell>
                        <TableCell className={classes.tableHeaders}>
                            UPC ID
                        </TableCell>
                        <TableCell className={classes.tableHeaders}>
                            DIY?
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>{props.children}</TableBody>
                <TableFooter>
                    <TableRow>
                        <Pagination
                            {...{ handleChangeRowsPerPage, hitsPerPage }}
                        />
                    </TableRow>
                </TableFooter>
            </Table>
        </Paper>
    );
}

MenuItemResultsTable.propTypes = {
    rows: PropTypes.array.isRequired,
    handleLink: PropTypes.func.isRequired,
    handleAction: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(MenuItemResultsTable);
