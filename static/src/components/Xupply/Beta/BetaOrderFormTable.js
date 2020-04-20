import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles, useTheme } from '@material-ui/core/styles';

import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
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
import Checkbox from '@material-ui/core/Checkbox';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { KeyboardDatePicker } from '@material-ui/pickers';

import TablePaginationActions from '../../TablePaginationActions';

import {
    formatDateWTime,
    formatAddress,
    formatDateNoTime,
    formatNumbersWithCommas
} from '../../../utils/misc';

import { isMobileAndTablet } from '../../../utils/isMobileAndTablet';

function renderPriorityType() {
    const array = [];
    array.push(<MenuItem key={'default'} value={'default'}>Select Priority</MenuItem>);
    array.push(<MenuItem key={'high'} value={'high'}>High</MenuItem>);
    array.push(<MenuItem key={'med'} value={'med'}>Medium</MenuItem>);
    array.push(<MenuItem key={'low'} value={'low'}>Low</MenuItem>);
    return array;
}

const styles = (theme) => ({
  root: {
    boxShadow: 'none',
    borderRadius: 8,
    padding: isMobileAndTablet() ? 0 : 30,
    backgroundColor: theme.palette.primary.appBar,
    overflow: 'scroll',
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
  textField: {
      width: 100,
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


function BetaRequestFormTable(props) {
  const { classes, menuItems, approvedMenuItems, stockPerItem, handleCheckBox, handleChange } = props;
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const emptyRows = rowsPerPage - Math.min(rowsPerPage, menuItems.length - page * rowsPerPage);
  const handleChangePage = (e, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = e => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };

  console.warn(menuItems)
  const priorityTypes = renderPriorityType();
  return (
    <Paper className={classes.root}>
      <Table size="small" className={classes.table}>
        <TableHead>
          <TableRow>
            <TableCell className={classes.tableHeaders} >Item</TableCell>
            <TableCell className={classes.tableHeaders} >Needed #</TableCell>
            <TableCell className={classes.tableHeaders} >Max Price</TableCell>
            <TableCell className={classes.tableHeaders} >Fill Priority</TableCell>
            <TableCell className={classes.tableHeaders} >Fill By</TableCell>
            <TableCell className={classes.tableHeaders} >Will Fund</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {menuItems.map(menuItem => (
            <TableRow key={menuItem.itemID}>
              <TableCell>
                  <Checkbox
                      checked={approvedMenuItems.some(o => o.itemID === menuItem.itemID)}
                      onChange={e => handleCheckBox(e, menuItem)}
                      color="primary"
                  />
                  <ImageTooltip
                    title={
                      <React.Fragment>
                        <img src={menuItem.thumbItemImageURL ? menuItem.thumbItemImageURL : '/src/containers/App/styles/img/broken.png'} style={{height: 50, width: 50}} />
                      </React.Fragment>
                    }
                  >
                    <a onClick={e => handleLink(e, menuItem.itemID)} className={classes.linkText}>{`${menuItem.itemName} - ${menuItem.measurement.nickname}`}</a>
                  </ImageTooltip>
              </TableCell>
              <TableCell>
                  <TextField
                      placeholder="#/units"
                      margin="dense"
                      type="number"
                      disabled={!approvedMenuItems.some(o => o.itemID === menuItem.itemID)}
                      // helperText={name_error_text}
                      value={stockPerItem[menuItem.itemID] ? stockPerItem[menuItem.itemID].stock : ''}
                      style={{width: 75}}
                      onChange={e => handleChange(e, 'stock', menuItem.itemID)}
                      // FormHelperTextProps={{ classes: { root: classes.helperText } }}
                  />
              </TableCell>
              <TableCell>
                  <TextField
                      placeholder="$/unit"
                      margin="dense"
                      type="number"
                      disabled={!approvedMenuItems.some(o => o.itemID === menuItem.itemID)}
                      // helperText={name_error_text}
                      value={stockPerItem[menuItem.itemID] ? stockPerItem[menuItem.itemID].pricePerUnit : ''}
                      style={{width: 75}}
                      onChange={e => handleChange(e, 'pricePerUnit', menuItem.itemID)}
                      // FormHelperTextProps={{ classes: { root: classes.helperText } }}
                  />
              </TableCell>
              <TableCell>
                <Select
                    // onChange={e => this.handleChange(e, 'priority')}
                    value={stockPerItem[menuItem.itemID] ? stockPerItem[menuItem.itemID].priority : 'default'}
                    // margin="dense"
                    style={{margin: 0, padding: 0}}
                    disabled={!approvedMenuItems.some(o => o.itemID === menuItem.itemID)}
                    inputProps={{
                        name: 'priority',
                        id: 'priority',
                    }}
                >
                    {priorityTypes}
                </Select>
              </TableCell>
              <TableCell>
                <KeyboardDatePicker
                    autoOk
                    value={formatDateNoTime(stockPerItem[menuItem.itemID] ? stockPerItem[menuItem.itemID].requiredBy : new Date())}
                    margin="normal"
                    variant="outline"
                    // helperText={birth_error_text}
                    className={classes.pickerField}
                    // onChange={this.handleDateChange('birthDate')}
                    format="MM/DD/YYYY"
                    id="date-picker-inline"
                />
              </TableCell>
              <TableCell>
                <TextField
                    placeholder="$/budget"
                    margin="dense"
                    type="number"
                    disabled={!approvedMenuItems.some(o => o.itemID === menuItem.itemID)}
                    // helperText={name_error_text}
                    value={stockPerItem[menuItem.itemID] ? stockPerItem[menuItem.itemID].pricePerUnit * stockPerItem[menuItem.itemID].stock : ''}
                    style={{width: 75}}
                    // onChange={e => handleChange(e, 'leadTime', menuItem.itemID)}
                    // FormHelperTextProps={{ classes: { root: classes.helperText } }}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TablePagination
                rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                colSpan={7}
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

BetaRequestFormTable.propTypes = {
  menuItems: PropTypes.array.isRequired,
  approvedMenuItems: PropTypes.array.isRequired,
  stockPerItem: PropTypes.object.isRequired,
  handleCheckBox: PropTypes.func.isRequired,
  handleChange: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(BetaRequestFormTable);
