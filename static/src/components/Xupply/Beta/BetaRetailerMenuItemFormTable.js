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

import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

import {
    formatDateWTime,
    formatAddress,
    formatDateNoTime,
    formatNumbersWithCommas
} from '../../../utils/misc';
import {
  calculateOverBurnStock
} from '../../../utils/inventory';

import { isMobileAndTablet } from '../../../utils/isMobileAndTablet';

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

function BetaMenuItemFormTable(props) {
  const { classes, menuItems, approvedMenuItems, stockPerItem, handleChange } = props;
  return (
    <Paper className={classes.root}>
      <Table size="small" className={classes.table}>
        <TableHead>
          <TableRow>
            <TableCell className={classes.tableHeaders} >Item</TableCell>
            <TableCell className={classes.tableHeaders} >Size</TableCell>
            <TableCell className={classes.tableHeaders} >On Hand</TableCell>
            <TableCell className={classes.tableHeaders} >Acceptable Price</TableCell>
            <TableCell className={classes.tableHeaders} >Current Burn (Daily)</TableCell>
            <TableCell className={classes.tableHeaders} >Over Burn</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {menuItems.map(menuItem => (
            <TableRow key={menuItem.itemID}>
              <TableCell>
                  <ImageTooltip
                    title={
                      <React.Fragment>
                        <img src={menuItem.thumbItemImageURL ? menuItem.thumbItemImageURL : '/src/containers/App/styles/img/broken.png'} style={{height: 50, width: 50}} />
                      </React.Fragment>
                    }
                  >
                    <a onClick={e => handleLink(e, menuItem.itemID)} className={classes.linkText}>{`${menuItem.itemName}`}</a>
                  </ImageTooltip>
              </TableCell>
              <TableCell>
                  {
                      menuItem.quantities.length > 1
                      ? (
                        <FormControl margin="dense" className={classes.textField}>
                            <Select
                                // onChange={e => this.handleChange(e, null, 'itemType')}
                                value={stockPerItem[menuItem.itemID] && stockPerItem[menuItem.itemID].measurement.nickname !== null ? stockPerItem[menuItem.itemID].measurement.nickname : menuItem.quantities[0].measurement.nickname}
                                variant="outlined"
                                inputProps={{
                                    name: 'measurementName',
                                    id: 'measurementName',
                                }}
                            >
                                {menuItem.quantities.map(q => (<MenuItem key={q.measurement.nickname} value={q.measurement.nickname}>{q.measurement.nickname}</MenuItem>))}
                            </Select>
                            <div onClick={e => handleDeleteAction(e, employeeCode)} style={{color: 'red', cursor: 'pointer'}}>+ Add More</div>
                        </FormControl>
                      ) : menuItem.quantities[0].measurement.nickname
                  }
              </TableCell>
              <TableCell>
                  <TextField
                      placeholder="#/boxes"
                      label="#/boxes"
                      margin="dense"
                      type="number"
                      value={stockPerItem[menuItem.itemID] && stockPerItem[menuItem.itemID].stock !== 0 ? stockPerItem[menuItem.itemID].stock : ''}
                      style={{width: 100}}
                      onChange={e => handleChange(e, 'stock', menuItem)}
                  />
              </TableCell>
              <TableCell>
                  <TextField
                      placeholder="$/unit"
                      label="$/unit"
                      margin="dense"
                      type="number"
                      disabled={!approvedMenuItems.some(o => o.itemID === menuItem.itemID)}
                      // helperText={name_error_text}
                      value={stockPerItem[menuItem.itemID] && stockPerItem[menuItem.itemID].pricePerUnit !== 0 ? stockPerItem[menuItem.itemID].pricePerUnit : ''}
                      style={{width: 100}}
                      onChange={e => handleChange(e, 'pricePerUnit', menuItem)}
                      // FormHelperTextProps={{ classes: { root: classes.helperText } }}
                  />
              </TableCell>
              <TableCell>
                  <TextField
                      placeholder={`#/boxes`}
                      label={`#/boxes`}
                      margin="dense"
                      type="number"
                      disabled={!approvedMenuItems.some(o => o.itemID === menuItem.itemID)}
                      // helperText={name_error_text}
                      value={stockPerItem[menuItem.itemID] && stockPerItem[menuItem.itemID].burnQuantity !== 0 ? stockPerItem[menuItem.itemID].burnQuantity : ''}
                      style={{width: 75, paddingRight: 10}}
                      onChange={e => handleChange(e, 'burnQuantity', menuItem)}
                      // FormHelperTextProps={{ classes: { root: classes.helperText } }}
                  />
              </TableCell>
              <TableCell>
                  <TextField
                      placeholder={`#/days`}
                      label={`#/days`}
                      margin="dense"
                      type="number"
                      disabled={!approvedMenuItems.some(o => o.itemID === menuItem.itemID)}
                      // helperText={name_error_text}
                      value={stockPerItem[menuItem.itemID] && stockPerItem[menuItem.itemID].burnDays !== 0 ? stockPerItem[menuItem.itemID].burnDays : ''}
                      style={{width: 75, marginRight: 10}}
                      onChange={e => handleChange(e, 'burnDays', menuItem)}
                      // FormHelperTextProps={{ classes: { root: classes.helperText } }}
                  />
                  {stockPerItem[menuItem.itemID] ? formatNumbersWithCommas(calculateOverBurnStock(stockPerItem[menuItem.itemID])) : 'N/A'}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}



BetaMenuItemFormTable.propTypes = {
  menuItems: PropTypes.array.isRequired,
  approvedMenuItems: PropTypes.array.isRequired,
  stockPerItem: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(BetaMenuItemFormTable);
