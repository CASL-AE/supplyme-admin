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
import Tooltip from '@material-ui/core/Tooltip';

import TablePaginationActions from '../../TablePaginationActions';

import MenuItemCell from './MenuItemCell';

import {
    formatDateWTime,
    formatAddress,
    formatDateNoTime,
    formatNumbersWithCommas
} from '../../../utils/misc';
import {
    calculateLeadAvailableBy,
} from '../../../utils/inventory';

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

const ImageTooltip = withStyles((theme) => ({
  tooltip: {
    backgroundColor: '#f5f5f9',
    color: 'rgba(0, 0, 0, 0.87)',
    maxWidth: 220,
    fontSize: theme.typography.pxToRem(12),
    border: '1px solid #dadde9',
  },
}))(Tooltip);

const LocationTooltip = withStyles((theme) => ({
  tooltip: {
    backgroundColor: '#f5f5f9',
    color: 'rgba(0, 0, 0, 0.87)',
    maxWidth: 220,
    fontSize: theme.typography.pxToRem(12),
    border: '1px solid #dadde9',
  },
}))(Tooltip);

function RetailerMenuItemResultsTable(props) {
  const { classes, menuItems, handleLink, handleAction } = props;
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const emptyRows = rowsPerPage - Math.min(rowsPerPage, menuItems.length - page * rowsPerPage);
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
            <TableCell className={classes.tableHeaders} >Name</TableCell>
            <TableCell className={classes.tableHeaders} >On Hand</TableCell>
            <TableCell className={classes.tableHeaders} >Package Details</TableCell>
            <TableCell className={classes.tableHeaders} >Measurement</TableCell>
            <TableCell className={classes.tableHeaders} >Package Price</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {(rowsPerPage > 0
            ? menuItems.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            : menuItems
          ).map(menuItem => (
            <TableRow className={classes.tableRow} key={`${menuItem.itemID}${menuItem.index}`}>
              <TableCell>
                <ImageTooltip
                  title={
                    <React.Fragment>
                      <img src={menuItem.thumbnailSizeURL ? menuItem.thumbnailSizeURL : '/src/containers/App/styles/img/broken.png'} style={{height: 50, width: 50}} />
                    </React.Fragment>
                  }
                >
                  <a onClick={e => handleLink(e, menuItem.itemID)} className={classes.linkText}>{menuItem.itemName}</a>
                </ImageTooltip>
              </TableCell>
              <TableCell>
                {`${menuItem.quantity.stock}`}
              </TableCell>
              <TableCell>
                  <LocationTooltip
                    title={
                      <React.Fragment>
                      <em>
                          {`${menuItem.quantity.location.address.locality}, ${menuItem.quantity.location.address.region}`}
                      </em>
                      </React.Fragment>
                    }
                  >
                    <span className={classes.linkText}>{`${menuItem.quantity.packageQuantity} / ${menuItem.quantity.packageType}`}</span>
                  </LocationTooltip>
              </TableCell>
              <TableCell>
                {menuItem.quantity.measurement.label !== null ? `${menuItem.quantity.measurement.units} / ${menuItem.quantity.measurement.label}` : `${menuItem.quantity.measurement.nickname}`}
              </TableCell>
              <TableCell>
                {menuItem.quantity.pricePerUnit > 0 ? `$ ${formatNumbersWithCommas(menuItem.quantity.pricePerUnit)}` : 'donation'}
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
              colSpan={8}
              count={menuItems.length}
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



RetailerMenuItemResultsTable.propTypes = {
  menuItems: PropTypes.array.isRequired,
  handleLink: PropTypes.func.isRequired,
  handleAction: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(RetailerMenuItemResultsTable);
