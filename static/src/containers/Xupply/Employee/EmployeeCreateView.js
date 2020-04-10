/* eslint camelcase: 0, no-underscore-dangle: 0 */
import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import IconButton from '@material-ui/core/IconButton';
import Switch from '@material-ui/core/Switch';
import Button from '@material-ui/core/Button';

// import UploadMedia from '../../Global/Media/UploadMedia';
// import ChangeAdminUserDialog from '../../NotAuth/Registration/ChangeAdminUserDialog';

import { toNewEmployee } from '../../../services/employee/model';
import { saveNewEmployee } from '../../../services/employee/actions';
import {
  getKeys,
  validateString,
  validateEmail,
  validatePhone,
  roundUp,
} from '../../../utils/misc';
import { isMobileAndTablet } from '../../../utils/isMobileAndTablet';

function renderPermissionLevel() {
    const array = [];
    array.push(<MenuItem key={'owner'} value={'owner'}>Owner</MenuItem>);
    array.push(<MenuItem key={'admin'} value={'admin'}>Admin</MenuItem>);
    array.push(<MenuItem key={'user'} value={'user'}>User</MenuItem>);
    return array;
}

const styles = (theme) => ({
    root: {
        flexGrow: 1,
        padding: isMobileAndTablet() ? 0 : 30,
    },
    content: {
        paddingTop: 42,
        paddingBottom: 42,
        paddingLeft: 80,
        paddingRight: 80,
        backgroundColor: theme.palette.primary.appBar,
        borderRadius: 8,
    },
    outerCell: {
        marginBottom: 40,
    },
    headerCell: {
        marginBottom: 40,
        display: 'block',
    },
    headers: {
        display: 'inline-block',
        fontWeight: 500,
        fontSize: 28,
    },
    subHeaderCell: {
        marginBottom: 24,
        display: 'block',
    },
    subHeaders: {
        display: 'inline-block',
        fontWeight: 500,
        fontSize: 20,
    },
    childHeaderCell: {
        marginTop: 16,
        marginBottom: 16,
    },
    childHeaders: {
        display: 'inline-block',
        fontWeight: 500,
        fontSize: 16,
    },
    textField: {
        width: 450,
    },
    textCell: {
        marginBottom: 15,
    },
    inputLabel: {
        fontSize: 13,
        paddingBottom: 5,
        display: 'inline-block',
    },
    helperText: {
        fontSize: 12,
        color: '#d22323',
    },
    createButton: {
        color: '#ffffff',
        backgroundColor: theme.palette.primary.main,
        textTransform: 'none',
    },
});

function mapStateToProps(state) {
    return {
        pathname: state.router.location.pathname,
        idToken: state.app.idToken,
        employeeID: state.app.employeeID,
        accountID: state.app.accountID,
        employees: state.employeeData.employees,
        employee: state.employeeData.employee,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: {
            saveNewEmployee: bindActionCreators(saveNewEmployee, dispatch),
        },
    };
}

@connect(mapStateToProps, mapDispatchToProps)
class EmployeeCreateView extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            employee: toNewEmployee(),
            name_error_text: null,
            email_error_text: null,
            phoneNumber_error_text: null,
            showDialog: false,
            disabled: true,
        };
    }

    componentDidMount() {
      console.log('Employee Create Mounted')
      // this.loadCompData();
    }

    componentWillReceiveProps(nextProps) {
        console.log(nextProps.employee)
    }

    componentWillUnmount() {
      console.log('Employee Create UnMounted')
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (nextState === this.state) {
            return false;
        }
        return true;
    }

    // loadCompData = (props = this.props) => {
    //     const { actions, accountID, employee, employees, pathname } = props;
    //     const keys = getKeys(pathname);
    //     const employeeID = keys.second;
    //     if (employee.isLoaded && employee.employeeID === employeeID) {
    //         const next_state = this.state;
    //         next_state.employee = employee;
    //         console.log('Setting Employee State')
    //         this.setState(next_state, () => {
    //             this.isEmployeeDisabled();
    //         });
    //     } else {
    //         if (employeeID && employeeID !== null) {
    //             var found = false;
    //             employees.forEach((employee) => {
    //                 if (employee.employeeID === employeeID) {
    //                     const next_state = this.state;
    //                     next_state.employee = props.employee;
    //                     console.log('Setting Employee State')
    //                     this.setState(next_state, () => {
    //                         this.isEmployeeDisabled();
    //                     });
    //                     found = true;
    //                 }
    //             })
    //             if (found === false) {
    //                 if (employee.isLoaded && employee.employeeID === employeeID) {
    //                     const next_state = this.state;
    //                     next_state.employee = employee;
    //                     console.log('Setting Employee State')
    //                     this.setState(next_state, () => {
    //                         this.isEmployeeDisabled();
    //                     });
    //                 } else {
    //                     actions.getEmployee(accountID, employeeID);
    //                 }
    //             }
    //         }
    //     }
    // }

    handleChange = (e, parent, name) => {
        const { value } = e.target;
        const next_state = this.state;
        if (parent) {
          next_state.employee[parent][name] = value;
        } else {
          next_state.employee[name] = value;
        }
        this.setState(next_state, () => {
            this.isEmployeeDisabled();
        });
    }

    isEmployeeDisabled() {
        this.setState({
            disabled: true,
        });
        let name_is_valid = false;
        let email_is_valid = false;
        let phoneNumber_is_valid = false;

        // Validate Employee Name
        if (this.state.employee.name === null || this.state.employee.name === '') {
            this.setState({
                name_error_text: null,
            });
        } else if (validateString(this.state.employee.name) && this.state.employee.name.length < 20){
            name_is_valid = true;
            this.setState({
                name_error_text: null,
            });
        } else {
            this.setState({
                name_error_text: `The employee first name must be < ${20} characters.`,
            });
        }

        // Validate Employee Email
        if (this.state.employee.email === null || this.state.employee.email === '') {
            this.setState({
                email_error_text: null,
            });
        } else if (validateEmail(this.state.employee.email) && this.state.employee.email.length < 20){
            email_is_valid = true;
            this.setState({
                email_error_text: null,
            });
        } else {
            this.setState({
                email_error_text: 'Please enter a valid email address.',
            });
        }

        // Validate Employee Phone Number
        if (this.state.employee.phoneNumber === null || this.state.employee.phoneNumber === '') {
            console.error(this.state.employee.phoneNumber)
            this.setState({
                phoneNumber_error_text: null,
            });
        } else if (validatePhone(this.state.employee.phoneNumber)){
            phoneNumber_is_valid = true;
            this.setState({
                phoneNumber_error_text: null,
            });
        } else {
            this.setState({
                phoneNumber_error_text: 'Please enter a valid phone number.',
            });
        }

        console.warn(this.state.employee)
        console.warn(name_is_valid)
        console.warn(email_is_valid)
        console.warn(phoneNumber_is_valid)

        if (
          name_is_valid &&
          email_is_valid ||
          phoneNumber_is_valid
        ) {
            this.setState({
                disabled: false,
            });
        }
    }

    createNewEmployee = () => {
        const { actions, idToken, employeeID, accountID } = this.props;
        actions.saveNewEmployee(idToken, employeeID, accountID, this.state.employee);
    }

    togglePasswordDialog = (showPasswordDialog) => {
        console.log(showPasswordDialog);
        this.setState({
            showPasswordDialog: showPasswordDialog,
        });
    }

    toggleEmailDialog = (showEmailDialog) => {
        console.log(showEmailDialog);
        this.setState({
            showEmailDialog: showEmailDialog,
        });
    }

    updatePasswordPressed = (e) => {
        const { actions } = this.props;
        const { email } = this.state;
        e.preventDefault();
        actions.updatePassword(email)
    }

    render() {
        const { classes } = this.props;
        const {
            employee,
            name_error_text,
            email_error_text,
            phoneNumber_error_text,
            disabled,
            showPasswordDialog,
            showEmailDialog,
        } = this.state;

        const permissionLevels = renderPermissionLevel();

        console.log(employee)

        const NameContainer = (
            <div className={classes.outerCell}>
            <div className={classes.subHeaderCell}>
              <div className={classes.subHeaders}>
                  Employee Information
              </div>
            </div>
            <div className={classes.childHeaderCell}>
              <div className={classes.childHeaders}>
                  Enter the employee name and contact information.
              </div>
            </div>
            <label className={classes.inputLabel}>* Full Name</label>
            <div className={classes.textCell}>
                <TextField
                  placeholder="Ex. John Doe"
                  margin="dense"
                  variant="outlined"
                  helperText={name_error_text}
                  defaultValue={employee.name}
                  className={classes.textField}
                  onChange={e => this.handleChange(e, null, 'name')}
                  FormHelperTextProps={{ classes: { root: classes.helperText } }}
                  autoComplete=""
                />
            </div>
            <label className={classes.inputLabel}>* Password</label>
            <div className={classes.textCell}>
                <TextField
                  placeholder="Ex. ********"
                  margin="dense"
                  variant="outlined"
                  helperText={'password_error_text'}
                  defaultValue={'********'}
                  className={classes.textField}
                  disabled={true}
                  onClick={e => this.togglePasswordDialog(!this.state.showDialog)}
                  FormHelperTextProps={{ classes: { root: classes.helperText } }}
                  autoComplete=""
                />
            </div>
            <label className={classes.inputLabel}>* Email</label>
            <div className={classes.textCell}>
                <TextField
                  placeholder="Ex. example@example.com"
                  margin="dense"
                  variant="outlined"
                  helperText={email_error_text}
                  defaultValue={employee.email}
                  className={classes.textField}
                  disabled={true}
                  onClick={e => this.toggleEmailDialog(!this.state.showDialog)}
                  FormHelperTextProps={{ classes: { root: classes.helperText } }}
                  autoComplete=""
                />
            </div>
            <label className={classes.inputLabel}>Phone Number</label>
            <div className={classes.textCell}>
                <TextField
                  placeholder="Ex. (949) 545-2522"
                  margin="dense"
                  variant="outlined"
                  helperText={phoneNumber_error_text}
                  defaultValue={employee.phoneNumber}
                  className={classes.textField}
                  onChange={e => this.handleChange(e, null, 'phoneNumber')}
                  FormHelperTextProps={{ classes: { root: classes.helperText } }}
                  autoComplete=""
                />
            </div>
            <label className={classes.inputLabel}>* Permission Level</label>
            <div className={classes.textCell}>
                <Select
                  onChange={e => this.handleChange(e, null, 'permissionLevel')}
                    value={employee.permissionLevel}
                    variant="outlined"
                    inputProps={{
                        name: 'permissionLevel',
                        id: 'permissionLevel',
                    }}
                >
                    {permissionLevels}
                </Select>
            </div>
            </div>
        );

        const CreateContainer = (
          <div className={classes.outerCell}>
              <div className={classes.textCell}>
                  <Button
                    variant="contained"
                    disableRipple
                    disableFocusRipple
                    disabled={disabled}
                    onClick={this.createNewEmployee}
                    className={classes.createButton}
                  >
                      {employee.isLoaded ? 'Update Employee' : 'Create Employee'}
                  </Button>
              </div>
          </div>
        )

        return (
          <div className={classes.root}>
              <div className={classes.content}>
                  <div className={classes.headerCell}>
                      <div className={classes.headers}>
                          {employee.isLoaded ? 'Edit Employee' : 'New Employee'}
                      </div>
                  </div>
                  {NameContainer}
                  {CreateContainer}
              </div>
          </div>
        );
    }
}

EmployeeCreateView.defaultProps = {
    getEmployee: f => f,
    saveNewEmployee: f => f,
};
EmployeeCreateView.propTypes = {
    getEmployee: PropTypes.func,
    saveNewEmployee: PropTypes.func,
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(EmployeeCreateView);

// <ChangeAdminUserDialog type={'password'} open={showPasswordDialog} handleClose={e => this.togglePasswordDialog(e)} handleAction={e => this.updatePasswordPressed(e)} />
// <ChangeAdminUserDialog type={'email'} open={showEmailDialog} handleClose={e => this.toggleEmailDialog(e)} handleAction={e => this.updateEmailPressed(e)} />
