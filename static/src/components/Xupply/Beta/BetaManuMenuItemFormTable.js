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

function renderLeadTimeType() {
    const array = [];
    array.push(<MenuItem key={'default'} value={'default'} disabled>Lead Time</MenuItem>);
    array.push(<MenuItem key={'1'} value={'1'}>1 Day</MenuItem>);
    array.push(<MenuItem key={'7'} value={'7'}>1 Week</MenuItem>);
    array.push(<MenuItem key={'21'} value={'21'}>3 Weeks</MenuItem>);
    array.push(<MenuItem key={'28'} value={'28'}>1 Month</MenuItem>);
    array.push(<MenuItem key={'56'} value={'56'}>2 Months</MenuItem>);
    return array;
}

import {
    formatDateWTime,
    formatAddress,
    formatDateNoTime,
    formatNumbersWithCommas
} from '../../../utils/misc';

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


function BetaManuMenuItemFormTable(props) {
  const { classes, menuItems, approvedMenuItems, stockPerItem, handleCheckBox, handleChange } = props;
  const leadTimeTypes = renderLeadTimeType();
  return (
    <Paper className={classes.root}>
      <Table size="small" className={classes.table}>
        <TableHead>
          <TableRow>
            <TableCell className={classes.tableHeaders} >Item</TableCell>
            <TableCell className={classes.tableHeaders} >Size</TableCell>
            <TableCell className={classes.tableHeaders} >On Hand</TableCell>
            <TableCell className={classes.tableHeaders} >Max Price</TableCell>
            <TableCell className={classes.tableHeaders} >Resupply</TableCell>
            <TableCell className={classes.tableHeaders} >Total Value</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {menuItems.map((menuItem) => {
            const selectItems = menuItem.quantities.map(q => (<MenuItem key={q.measurement.nickname} value={q.measurement.nickname}>{q.measurement.nickname}</MenuItem>));
            const checked = approvedMenuItems.some(o => o.itemID === menuItem.itemID);
            return (
              <TableRow key={menuItem.itemID}>
                <TableCell>
                    <Checkbox
                        checked={checked}
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
                      <a onClick={e => handleLink(e, menuItem.itemID)} className={classes.linkText}>{`${menuItem.itemName}`}</a>
                    </ImageTooltip>
                </TableCell>
                <TableCell>
                    {
                        menuItem.quantities.length > 1
                        ? (
                          <FormControl margin="dense" className={classes.textField}>
                              <Select
                                  onChange={e => this.handleChange(e, 'packageType', menuItem.itemID)}
                                  value={stockPerItem[menuItem.itemID] && stockPerItem[menuItem.itemID].measurement.nickname !== null ? stockPerItem[menuItem.itemID].measurement.nickname : menuItem.quantities[0].measurement.nickname}
                                  variant="outlined"
                                  inputProps={{
                                      name: 'measurementName',
                                      id: 'measurementName',
                                  }}
                              >
                                  {selectItems}
                              </Select>
                              <div onClick={e => handleDeleteAction(e, employeeCode)} style={{color: 'red', cursor: 'pointer'}}>+ Add More</div>
                          </FormControl>
                        ) : menuItem.quantities[0].measurement.nickname
                    }
                </TableCell>
                <TableCell>
                    <TextField
                        placeholder="#/qty"
                        label="#/qty"
                        margin="dense"
                        type="number"
                        disabled={!checked}
                        // helperText={name_error_text}
                        value={stockPerItem[menuItem.itemID] && stockPerItem[menuItem.itemID].stock !== 0 ? stockPerItem[menuItem.itemID].stock : ''}
                        style={{width: 100}}
                        onChange={e => handleChange(e, 'stock', menuItem.itemID)}
                        // FormHelperTextProps={{ classes: { root: classes.helperText } }}
                    />
                </TableCell>
                <TableCell>
                    <TextField
                        placeholder="$/unit"
                        label="$/unit"
                        margin="dense"
                        type="number"
                        disabled={!checked}
                        // helperText={name_error_text}
                        value={stockPerItem[menuItem.itemID] && stockPerItem[menuItem.itemID].pricePerUnit !== 0 ? stockPerItem[menuItem.itemID].pricePerUnit : ''}
                        style={{width: 100}}
                        onChange={e => handleChange(e, 'pricePerUnit', menuItem.itemID)}
                        // FormHelperTextProps={{ classes: { root: classes.helperText } }}
                    />
                </TableCell>
                <TableCell>
                <TextField
                    placeholder="#/qty"
                    label="#/qty"
                    margin="dense"
                    type="number"
                    disabled={!checked}
                    // helperText={name_error_text}
                    value={stockPerItem[menuItem.itemID] && stockPerItem[menuItem.itemID].leadQuantity !== 0 ? stockPerItem[menuItem.itemID].leadQuantity : ''}
                    style={{width: 75, paddingRight: 10}}
                    onChange={e => handleChange(e, 'leadQuantity', menuItem.itemID)}
                    // FormHelperTextProps={{ classes: { root: classes.helperText } }}
                />
                <TextField
                    placeholder="#/days"
                    label="#/days"
                    margin="dense"
                    type="number"
                    disabled={!checked}
                    // helperText={name_error_text}
                    value={stockPerItem[menuItem.itemID] && stockPerItem[menuItem.itemID].leadDays !== 0 ? stockPerItem[menuItem.itemID].leadDays : ''}
                    style={{width: 75}}
                    onChange={e => handleChange(e, 'leadTime', menuItem.itemID)}
                    // FormHelperTextProps={{ classes: { root: classes.helperText } }}
                />
                </TableCell>
                <TableCell>
                  {stockPerItem[menuItem.itemID] && stockPerItem[menuItem.itemID].pricePerUnit !== 0 ? formatNumbersWithCommas(stockPerItem[menuItem.itemID].pricePerUnit * stockPerItem[menuItem.itemID].stock) : 'N/A'}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </Paper>
  );
}



BetaManuMenuItemFormTable.propTypes = {
  menuItems: PropTypes.array.isRequired,
  approvedMenuItems: PropTypes.array.isRequired,
  stockPerItem: PropTypes.object.isRequired,
  handleCheckBox: PropTypes.func.isRequired,
  handleChange: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(BetaManuMenuItemFormTable);
