import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TablePagination from '@material-ui/core/TablePagination';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableFooter from '@material-ui/core/TableFooter';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CancelIcon from '@material-ui/icons/Cancel';

import TablePaginationActions from '../../TablePaginationActions';

import { formatDateWTime, formatAddress } from '../../../utils/misc';

const styles = (theme) => ({
    root: {
      width: '100%',
      marginTop: 40,
      boxShadow: 'none',
      borderRadius: 8,
      padding: 30,
    },
    table: {},
    tableHeaders: {
      fontSize: 12,
      fontWeight: 500,
      borderBottom: '1px solid #d6d6d6',
      borderLeft: 0,
      verticalAlign: 'bottom',
      color: theme.palette.primary.main,
    },
    linkText: {
      color: '#2A38D8',
      fontWeight: 500,
      cursor: 'pointer',
    },
    cancelIcon: {
        color: '#e02626',
        margin: 0,
        padding: 0,
    },
    checkIcon: {
        color: '#37e026',
        margin: 0,
        padding: 0,
    },
});

function EmployeeResultsTable(props) {
  const { classes, rows, handleLink, handleAction } = props;
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);
  const handleChangePage = (e, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = e => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };
  return (
    <Paper className={classes.root}>
      <Table size="small" className={classes.table}>
        <TableHead>
          <TableRow>
            <TableCell className={classes.tableHeaders} align="right">Employee Name</TableCell>
            <TableCell className={classes.tableHeaders} align="left">Employee Permissions</TableCell>
            <TableCell className={classes.tableHeaders} align="left">Email</TableCell>
            <TableCell className={classes.tableHeaders} align="left">Phone</TableCell>
            <TableCell className={classes.tableHeaders} align="left">Active</TableCell>
            <TableCell className={classes.tableHeaders} align="left">Updated Date</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {(rowsPerPage > 0
            ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            : rows
          ).map(row => (
            <TableRow key={row.id}>
              <TableCell align="right"><a onClick={e => handleLink(e, row.id)} className={classes.linkText}>{row.name}</a></TableCell>
              <TableCell component="th" scope="row">
                {row.permissionLevel}
              </TableCell>
              <TableCell component="th" scope="row">
                {row.email || 'No Current Email'}
              </TableCell>
              <TableCell component="th" scope="row">
                {row.phoneNumber || 'No Current Phone'}
              </TableCell>
              <TableCell component="th" scope="row">
                {row.active ? 'True' : 'False'}
              </TableCell>
              <TableCell component="th" scope="row">{row.updatedDate ? formatDateWTime(row.updatedDate) : formatDateWTime(row.createdDate)}</TableCell>
            </TableRow>
          ))}
          {emptyRows > 0 && (
            <TableRow style={{ height: 53 * emptyRows }}>
              <TableCell colSpan={6} />
            </TableRow>
          )}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
              colSpan={6}
              count={rows.length}
              rowsPerPage={rowsPerPage}
              page={page}
              selectProps={{
                inputProps: { 'aria-label': 'rows per page' },
                native: true,
              }}
              onChangePage={handleChangePage}
              onChangeRowsPerPage={handleChangeRowsPerPage}
              actionsComponent={TablePaginationActions}
            />
          </TableRow>
        </TableFooter>
      </Table>
    </Paper>
  );
}


EmployeeResultsTable.propTypes = {
    rows: PropTypes.array.isRequired,
    handleLink: PropTypes.func.isRequired,
    handleAction: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(EmployeeResultsTable);
