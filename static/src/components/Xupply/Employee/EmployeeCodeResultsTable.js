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

import { formatDateWTime } from '../../../utils/misc';

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

function EmployeeCodeResultsTable(props) {
  const { classes, employeeCodes, handleLink, handleEmailAction, handleDeleteAction } = props;
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const emptyRows = rowsPerPage - Math.min(rowsPerPage, employeeCodes.length - page * rowsPerPage);
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
            <TableCell className={classes.tableHeaders} align="right">Activation Code ID</TableCell>
            <TableCell className={classes.tableHeaders} align="left">Permissions</TableCell>
            <TableCell className={classes.tableHeaders} align="left">Name</TableCell>
            <TableCell className={classes.tableHeaders} align="left">Email</TableCell>
            <TableCell className={classes.tableHeaders} align="left">Phone</TableCell>
            <TableCell className={classes.tableHeaders} align="left">Updated</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {(rowsPerPage > 0
            ? employeeCodes.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            : employeeCodes
          ).map(employeeCode => (
            <TableRow key={employeeCode.id}>
              <TableCell align="right"><a onClick={e => handleLink(e, employeeCode.activationCode)} className={classes.linkText}>{employeeCode.activationCode}</a></TableCell>
              <TableCell>
                {employeeCode.permissionLevel}
              </TableCell>
              <TableCell>
                {employeeCode.ownerName}
              </TableCell>
              <TableCell>
                {employeeCode.email || 'No Current Email'}
                <div onClick={e => handleEmailAction(e, employeeCode)} style={{color: 'blue', cursor: 'pointer'}}>Resend Invite</div>
              </TableCell>
              <TableCell>
                {employeeCode.phoneNumber || 'No Current Phone'}
              </TableCell>
              <TableCell>
                {formatDateWTime(employeeCode.updatedDate ? employeeCode.updatedDate : employeeCode.creationDate)}
                <div onClick={e => handleDeleteAction(e, employeeCode)} style={{color: 'red', cursor: 'pointer'}}>Delete</div>
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
              count={employeeCodes.length}
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


EmployeeCodeResultsTable.propTypes = {
    type: PropTypes.string.isRequired,
    employeeCodes: PropTypes.array.isRequired,
    handleLink: PropTypes.func.isRequired,
    handleEmailAction: PropTypes.func.isRequired,
    handlePasswordAction: PropTypes.func.isRequired,
    handleDeleteAction: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(EmployeeCodeResultsTable);
