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

import {
  formatDateWTime,
  formatAddress,
  formatDateNoTime
} from '../../../utils/misc';
import {
  formatRequestStatus
} from '../../../utils/events';

const styles = (theme) => ({
  root: {
    width: '100%',
    boxShadow: 'none',
    borderRadius: 8,
    backgroundColor: theme.palette.primary.background,
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
  tableRow: {
      backgroundColor: theme.palette.primary.appBar,
      height: 50,
      boxShadow: '0 8px 64px rgba(32, 32, 32, 0.08), 0 4px 16px rgba(32, 32, 32, 0.02)',
  },
});

function RequestResultsTable(props) {
  const { classes, requests, handleLink } = props;
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const emptyRows = rowsPerPage - Math.min(rowsPerPage, requests.length - page * rowsPerPage);
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
            <TableCell className={classes.tableHeaders} >Delivery Location</TableCell>
            <TableCell className={classes.tableHeaders} >Requested</TableCell>
            <TableCell className={classes.tableHeaders} >Item</TableCell>
            <TableCell className={classes.tableHeaders} >Priority</TableCell>
            <TableCell className={classes.tableHeaders} >Required By</TableCell>
            <TableCell className={classes.tableHeaders} ># Filled</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {(rowsPerPage > 0
            ? requests.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            : requests
          ).map(request => (
            <TableRow className={classes.tableRow} key={request.requestID}>
              <TableCell>
                  <a onClick={e => handleLink(e, request.requestID)} className={classes.linkText}>{request.location.name || 'Unkown Name'}</a>
              </TableCell>
              <TableCell>
                  {`${request.stockPerItem[request.item.itemID].stock} / ${request.stockPerItem[request.item.itemID].packageType}`}
              </TableCell>
              <TableCell>
                  {`${request.item.itemName}`}
              </TableCell>
              <TableCell>
                  {request.stockPerItem[request.item.itemID].priority}
              </TableCell>
              <TableCell>
                  {formatDateNoTime(request.stockPerItem[request.item.itemID].requiredBy)}
              </TableCell>
              <TableCell>
                  <LinearProgress variant="determinate" value={(0/request.stockPerItem[request.item.itemID].stock)*100} style={{backgroundColor: 'black'}} color="primary" />
                  {`# ${0} of ${request.stockPerItem[request.item.itemID].stock}`}
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
                colSpan={7}
                count={requests.length}
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



RequestResultsTable.propTypes = {
  requests: PropTypes.array.isRequired,
  handleLink: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(RequestResultsTable);
