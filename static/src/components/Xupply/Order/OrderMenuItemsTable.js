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

import MenuItemCell from '../MenuItem/MenuItemCell';

import {
  formatDateNoTime
} from '../../../utils/misc';

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



function OrderMenuItemsTable(props) {
  const { classes, menuItems } = props;
  console.log(menuItems);
  return (
    <Paper className={classes.root}>
      <Table size="small" className={classes.table}>
        <TableHead>
          <TableRow>
            <TableCell className={classes.tableHeaders} >Location</TableCell>
            <TableCell className={classes.tableHeaders} >Name</TableCell>
            <TableCell className={classes.tableHeaders} >Image</TableCell>
            <TableCell className={classes.tableHeaders} >Type</TableCell>
            <TableCell className={classes.tableHeaders} >Quantity</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {menuItems.map(menuItem => (
            <TableRow key={menuItem.item.itemID}>
              <TableCell>{menuItem.item.quantities[0].location.name}</TableCell>
              <TableCell><a onClick={e => handleLink(e, menuItem.item.itemID)} className={classes.linkText}>{menuItem.item.itemName || 'Unkown Name'}</a></TableCell>
              <TableCell style={{width: 100}}>
                  <MenuItemCell itemID={menuItem.item.itemID} itemImage={menuItem.item.thumbItemImageURL} />
              </TableCell>
              <TableCell>
                {menuItem.item.itemType}
              </TableCell>
              <TableCell>
                {menuItem.quantity}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}



OrderMenuItemsTable.propTypes = {
  menuItems: PropTypes.array.isRequired,
  classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(OrderMenuItemsTable);
