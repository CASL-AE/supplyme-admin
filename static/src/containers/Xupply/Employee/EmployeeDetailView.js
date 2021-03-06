/* eslint camelcase: 0, no-underscore-dangle: 0 */
import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Fab from '@material-ui/core/Fab';
import EditIcon from '@material-ui/icons/Edit';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';

import { deleteEmployee } from '../../../services/employee/actions';
import { toNewEmployee } from '../../../services/employee/model';
import { getKeys, formatDateWTime, dispatchNewObject } from '../../../utils/misc';

const styles = (theme) => ({
    root: {
        flex: 1,
        height: '100vh'
    },
    display: {
        display: 'flex',
    },
    leftDetail: {
      flexBasis: 0,
      flexGrow: 1,
      marginRight: 30,
    },
    detailCard: {
      padding: '2.0rem',
      boxShadow: '0 8px 64px rgba(32, 32, 32, 0.08), 0 4px 16px rgba(32, 32, 32, 0.02)',
      backgroundColor: theme.palette.primary.appBar,
      borderRadius: 8,
    },
    detailTop: {
      marginBottom: 30,
      display: 'flex',
      alignItems: 'center',
      fontWeight: 500,
      color: theme.palette.primary.main,
    },
    detailTitle: {
        marginBottom: 30,
    },
    detailTitleText: {
      color: 'black',
      fontSize: 24,
      fontWeight: 600,
      lineHeight: 1.36,
      margin: 0,
    },
    detailActions: {
        display: 'flex',
    },
    button: {
        marginRight: 10,
        textTransform: 'none',
    },
    deleteButton: {
        backgroundColor: '#e02626',
        textTransform: 'none',
    },
    rightDetail: {
      flexGrow: 2,
      flexBasis: 0,
    },
    block: {
        marginBottom: 40,
    },
    section: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingBottom: 15,
      margin: 0,
    },
    detailList: {
      blocationTop: '1px solid #e6e6e6',
      display: 'block',
      backgroundColor: theme.palette.primary.appBar,
      borderRadius: 8,
      padding: 30,
    },
    editButton: {
        float: 'right',
        textTransform: 'none',
    },
    detailListDt: {
      minWidth: '30%',
      border: 0,
      padding: '.5rem 0',
      margin: 0,
    },
    detailListDd: {
      minWidth: '70%',
      border: 0,
      fontWeight: 500,
      padding: '.5rem 0',
      margin: 0,
    },
    detailListFlex: {
        display: 'flex',
    },
    img: {
        borderRadius: '50%',
        marginRight: 10,
    }
});

function mapStateToProps(state) {
    return {
        pathname: state.router.location.pathname,
        employeeID: state.app.employeeID,
        accountID: state.app.accountID,
        employees: state.employeeData.employees,
        receivedAt: state.employeeData.receivedAt,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: {
            deleteEmployee: bindActionCreators(deleteEmployee, dispatch)
        },
    };
}

@connect(mapStateToProps, mapDispatchToProps)
class EmployeeDetailView extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            employee: toNewEmployee()
        };
    }

    componentDidMount() {
      console.log('Employee Detail Mounted')
      this.loadCompData();
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.receivedAt !== null && this.props.receivedAt === null) {
            this.loadCompData(nextProps);
        }
    }

    componentWillUnmount() {
      console.log('Employee Detail UnMounted')
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (nextState === this.state) {
            return false;
        }
        return true;
    }

    loadCompData = () => {
        const { actions, accountID, employees, pathname } = this.props;
        const keys = getKeys(pathname);
        const employeeID = keys.second;
        if (employeeID && employeeID !== null) {
            employees.forEach((employee) => {
                if (employee.employeeID === employeeID) {
                    this.setState({employee});
                }
            })
        }
    }

    deleteActiveEmployee = (e) => {
        const {
            actions,
            idToken,
            employeeID,
            accountID,
        } = this.props;
        const { employee } = this.state;
        e.preventDefault();
        swal({
            title: `Delete this Employee?`,
            text: `Doing so will permanently delete the data for this Employee?.`,
            icon: 'warning',
            buttons: {
                cancel: 'Cancel',
                request: {
                    text: 'Delete',
                    value: 'delete',
                },
            },
        })
            .then((value) => {
                switch (value) {
                case 'delete':
                    console.log(`Delete Employee`);
                    actions.deleteEmployee(employeeID, accountID, employee);
                    break;
                default:
                    break;
                }
            });
    }

    render() {
        const { classes, accountID } = this.props;
        const { employee } = this.state;
        return (
          <div className={classes.root}>
              <div className={classes.display}>
                  <div className={classes.leftDetail}>
                      <div className={classes.detailCard}>
                          <div className={classes.detailTop}>
                            <img height='50' width='50' className={classes.img} src='/src/containers/App/styles/img/temp_anon.jpg' />
                            <span>{employee.permissionLevel && employee.permissionLevel.charAt(0).toUpperCase() + employee.permissionLevel.slice(1)}</span>
                          </div>
                          <div className={classes.detailTitle}>
                            <span className={classes.detailTitleText}>{`${employee.firstName} ${employee.lastName}`}</span>
                          </div>
                          <div className={classes.detailActions}>
                              <Fab
                                  aria-label={'Edit'}
                                  className={classes.deleteButton}
                                  color={'primary'}
                                  onClick={(e) => this.deleteActiveEmployee(e)}
                              >
                                <DeleteForeverIcon />
                              </Fab>
                          </div>
                      </div>
                  </div>
                  <div className={classes.rightDetail}>
                      <div className={classes.block}>
                          <div className={classes.section}>
                              <span className={classes.detailTitleText}>Details</span>
                              <Fab
                                  aria-label={'Edit'}
                                  className={classes.editButton}
                                  color={'primary'}
                                  onClick={(e) => dispatchNewObject(e, accountID, 'employee', employee.employeeID, 'edit')}
                              >
                                <EditIcon />
                              </Fab>
                          </div>
                          <dl className={classes.detailList}>
                              <div className={classes.detailListFlex}>
                              <dt className={classes.detailListDt}>
                                  ID
                              </dt>
                              <dd className={classes.detailListDd}>
                                  {employee.employeeID}
                              </dd>
                              </div>
                              <div className={classes.detailListFlex}>
                              <dt className={classes.detailListDt}>
                                  Created
                              </dt>
                              <dd className={classes.detailListDd}>
                                  {`${formatDateWTime(employee.creationDate)}`}
                              </dd>
                              </div>
                              <div className={classes.detailListFlex}>
                              <dt className={classes.detailListDt}>
                                  Email
                              </dt>
                              <dd className={classes.detailListDd}>
                                  {employee.email}
                              </dd>
                              </div>
                              <div className={classes.detailListFlex}>
                              <dt className={classes.detailListDt}>
                                  Phone
                              </dt>
                              <dd className={classes.detailListDd}>
                                  {employee.phoneNumber}
                              </dd>
                              </div>
                              <div className={classes.detailListFlex}>
                              <dt className={classes.detailListDt}>
                                  Employment Date
                              </dt>
                              <dd className={classes.detailListDd}>
                                  {`${formatDateWTime(employee.employmentDate)}`}
                              </dd>
                              </div>
                          </dl>
                      </div>
                  </div>
              </div>
          </div>
        );
    }
}

EmployeeDetailView.defaultProps = {
    router: PropTypes.object,
    deleteEmployee: PropTypes.func,
};

EmployeeDetailView.propTypes = {
    router: PropTypes.object,
    deleteEmployee: PropTypes.func,
};

export default withStyles(styles)(EmployeeDetailView);
