import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableFooter from '@material-ui/core/TableFooter';
import Paper from '@material-ui/core/Paper';
import Pagination from './Pagination';

export const styles = (theme) => ({
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
  textField: {
      width: 150,
  },
  textCell: {
      marginBottom: 15,
  },
});

function PublicMenuItemResultsTable(props) {
  const { classes, setHitsPerPage, hitsPerPage } = props;

  const handleChangeRowsPerPage = (e, cb) => {
    let number= parseInt(e.target.value, 10);
    setHitsPerPage(number);
    cb(number);
  };
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
            <TableCell style={{textAlign: 'center'}} className={classes.tableHeaders} >Add</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.children}
        </TableBody>
        <TableFooter>
          <TableRow>
            <Pagination {...{handleChangeRowsPerPage, hitsPerPage}}/>
          </TableRow>
        </TableFooter>
      </Table>
    </Paper>
  );
}



PublicMenuItemResultsTable.propTypes = {
  menuItems: PropTypes.array.isRequired,
  handleAction: PropTypes.func.isRequired,
  handleChange: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(PublicMenuItemResultsTable);
