import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles, useTheme } from '@material-ui/core/styles';

import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TablePagination from '@material-ui/core/TablePagination';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableFooter from '@material-ui/core/TableFooter';
import Paper from '@material-ui/core/Paper';
import CancelIcon from '@material-ui/icons/Cancel';
import LinearProgress from '@material-ui/core/LinearProgress';

import TablePaginationActions from '../../TablePaginationActions';

import { formatDateWTime, formatAddress, formatDateNoTime } from '../../../utils/misc';

import {
  formatOrderStatus
} from '../../../utils/events';

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
    color: theme.palette.primary.black,
  },
  linkText: {
    color: '#82a4bc !important',
    fontWeight: '600px !important',
    cursor: 'pointer',
    textAlign: 'left',
    fontSize: '14px !important',
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



function OrderResultsTable(props) {
  const { classes, orders, handleLink, handleAction } = props;
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const emptyRows = rowsPerPage - Math.min(rowsPerPage, orders.length - page * rowsPerPage);
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
            <TableCell className={classes.tableHeaders} >Order ID</TableCell>
            <TableCell className={classes.tableHeaders} >Deliver To</TableCell>
            <TableCell className={classes.tableHeaders} >Required By</TableCell>
            <TableCell className={classes.tableHeaders} >Total</TableCell>
            <TableCell className={classes.tableHeaders} >Status</TableCell>
            <TableCell className={classes.tableHeaders} >Updated Date</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {(rowsPerPage > 0
            ? orders.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            : orders
          ).map(order => (
            <TableRow key={order.orderID}>
              <TableCell><a onClick={e => handleLink(e, order.orderID)} className={classes.linkText}>{order.orderID || 'Unkown Name'}</a></TableCell>
              <TableCell>
                {order.orderID}
              </TableCell>
              <TableCell>
                {order.totals.total}
              </TableCell>
              <TableCell>
                {formatOrderStatus(order.status.isStatus)}
              </TableCell>
              <TableCell>
                {'order.updatedDate'}
              </TableCell>
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
              count={orders.length}
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



OrderResultsTable.propTypes = {
  orders: PropTypes.array.isRequired,
  handleLink: PropTypes.func.isRequired,
  handleAction: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(OrderResultsTable);
