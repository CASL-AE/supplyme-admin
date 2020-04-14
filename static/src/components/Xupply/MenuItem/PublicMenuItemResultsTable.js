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

import TablePaginationActions from '../../TablePaginationActions';

import {
    formatDateWTime,
    formatAddress,
    formatDateNoTime,
    formatNumbersWithCommas
} from '../../../utils/misc';

const styles = (theme) => ({
  root: {
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


function PublicMenuItemResultsTable(props) {
  const { classes, menuItems, approvedMenuItems, handleCheckBox } = props;
  console.warn(menuItems)
  return (
    <Paper className={classes.root}>
      <Table size="small" className={classes.table}>
        <TableHead>
          <TableRow>
            <TableCell className={classes.tableHeaders} >Name</TableCell>
            <TableCell className={classes.tableHeaders} >Package Details</TableCell>
            <TableCell className={classes.tableHeaders} >Package Price</TableCell>
            <TableCell className={classes.tableHeaders} >Brand Name</TableCell>
            <TableCell className={classes.tableHeaders} >UPC ID</TableCell>
            <TableCell style={{textAlign: 'center'}} className={classes.tableHeaders} >Will Accept</TableCell>
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
                    <a onClick={e => handleLink(e, menuItem.itemID)} className={classes.linkText}>{`${menuItem.itemName} - ${menuItem.measurement.nickname}`}</a>
                  </ImageTooltip>
              </TableCell>
              <TableCell>
                  <LocationTooltip
                    title={
                      <React.Fragment>
                      <em>
                          {`${menuItem.quantities[0].location.address.locality}, ${menuItem.quantities[0].location.address.region}`}
                      </em>
                      </React.Fragment>
                    }
                  >
                    <span className={classes.linkText}>{`${menuItem.quantities[0].packageQuantity} / ${menuItem.quantities[0].packageType}`}</span>
                  </LocationTooltip>
              </TableCell>
              <TableCell>
                {menuItem.quantities[0].pricePerUnit > 0 ? `$ ${formatNumbersWithCommas(menuItem.quantities[0].pricePerUnit)}` : 'donation'}
              </TableCell>
              <TableCell>
                {menuItem.brandName}
              </TableCell>
              <TableCell>
                {menuItem.upcID || 'None'}
              </TableCell>
              <TableCell style={{textAlign: 'center'}}>
              <Checkbox
                  checked={approvedMenuItems.some(o => o.itemID === menuItem.itemID)}
                  onChange={e => handleCheckBox(e, menuItem)}
                  color="primary"
              />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}



PublicMenuItemResultsTable.propTypes = {
  menuItems: PropTypes.array.isRequired,
  approvedMenuItems: PropTypes.array.isRequired,
  handleCheckBox: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(PublicMenuItemResultsTable);
