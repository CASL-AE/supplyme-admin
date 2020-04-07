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
import Pagination from "./Pagination";
import { styles } from "./PublicMenuItemResultsTable";

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
