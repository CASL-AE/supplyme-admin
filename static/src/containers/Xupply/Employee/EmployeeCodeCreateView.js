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

import PhoneTextInput from '../../../components/Xupply/Misc/PhoneTextInput';

import { toNewEmployeeCode } from '../../../services/employee/model';
import { saveNewEmployee } from '../../../services/employee/actions';
import {
  validateString,
  validateEmail,
  validatePhone,
} from '../../../utils/misc';

function renderPermissionLevel() {
    const array = [];
    array.push(<MenuItem key={'owner'} value={'owner'}>Owner</MenuItem>);
    array.push(<MenuItem key={'admin'} value={'admin'}>Admin</MenuItem>);
    array.push(<MenuItem key={'user'} value={'user'}>User (Read Only)</MenuItem>);
    return array;
}

const styles = (theme) => ({
    root: {
        flex: 1,
        backgroundColor: theme.palette.primary.background,
    },
    content: {
        paddingTop: 42,
        paddingBottom: 42,
        paddingLeft: 80,
        paddingRight: 80,
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
        // fontFamily: 'AvenirNext-DemiBold',
    },
    subHeaderCell: {
        marginBottom: 24,
        display: 'block',
    },
    subHeaders: {
        display: 'inline-block',
        fontWeight: 500,
        fontSize: 20,
        // fontFamily: 'AvenirNext-DemiBold',
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
        width: 250,
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
        height: 40,
    },
    permissionSelect: {
        width: 100,
    },
});

function mapStateToProps(state) {
    return {
        router: state.router,
        idToken: state.app.idToken,
        accountID: state.app.accountID,
        accountName: state.accountData.account.name,
        employeeID: state.app.employeeID,
        employeeCode: state.employeeData.employeeCode,
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
class EmployeeCodeCreateView extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            employeeCode: toNewEmployeeCode(),
            ownerName_error_text: null,
            email_error_text: null,
            phoneNumber_error_text: null,
        };
    }

    componentDidMount() {
        console.log('Employee Code Create Mounted')
        const { accountID, accountName } = this.props;
        const employeeCode = this.state.employeeCode;
        employeeCode.accountID = accountID;
        employeeCode.accountName = accountName;
        this.setState({
            employeeCode,
        });
    }

    componentWillUnmount() {
        console.log('Employee Code Create UnMounted')
    }

    handleChange = (e, parent, name) => {
        const { value } = e.target;
        const next_state = this.state;
        if (parent) {
          next_state.employeeCode[parent][name] = value;
        } else {
          next_state.employeeCode[name] = value;
        }
        this.setState(next_state, () => {});
    }

    handlePhoneChange = (e, name) => {
        const { value } = e.target;
        const next_state = this.state;
        next_state.employeeCode[name] = value;
        this.setState(next_state, () => {});
    }

    isEmployeeDisabled = () => {
        let ownerName_is_valid = false;
        let email_is_valid = false;
        let phoneNumber_is_valid = false;

        // Validate Employee Name
        if (this.state.employeeCode.ownerName === null || this.state.employeeCode.ownerName === '') {
            this.setState({
                ownerName_error_text: `The please enter an Employee Name`,
            });
        } else if (validateString(this.state.employeeCode.ownerName) && this.state.employeeCode.ownerName.length < 80){
            ownerName_is_valid = true;
            this.setState({
                ownerName_error_text: null,
            });
        } else {
            this.setState({
                ownerName_error_text: `The employee name must be less than ${80} characters.`,
            });
        }

        // Validate Employee Code Email
        if (this.state.employeeCode.email === null || this.state.employeeCode.email === '') {
            this.setState({
                email_error_text: 'Please enter a valid email address.',
            });
        } else if (validateEmail(this.state.employeeCode.email)){
            email_is_valid = true;
            this.setState({
                email_error_text: null,
            });
        } else {
            this.setState({
                email_error_text: 'The email address is invalid.',
            });
        }

        console.error(this.state.employeeCode)
        console.error(ownerName_is_valid)
        console.error(email_is_valid)

        if (
          ownerName_is_valid &&
          email_is_valid
        ) {
            this.createNewEmployeeCode();
        }
    }

    createNewEmployeeCode = () => {
        const { actions, idToken, accountID, employeeID } = this.props;
        actions.saveNewEmployee(idToken, this.state.employeeCode);
    }

    render() {
        const { classes } = this.props;
        const {
            employeeCode,
            ownerName_error_text,
            email_error_text,
            phoneNumber_error_text,
            disabled,
        } = this.state;

        const permissionLevels = renderPermissionLevel();

        const GeneralContainer = (
            <div className={classes.outerCell}>
            <div className={classes.subHeaderCell}>
              <div className={classes.subHeaders}>
                  Overview Information
              </div>
            </div>
            <div className={classes.childHeaderCell}>
              <div className={classes.childHeaders}>
                  Enter the information about the employee to send an activation code to the new employee email.
              </div>
            </div>
            <label className={classes.inputLabel}>* Legal Employee Name</label>
            <div className={classes.textCell}>
                <TextField
                  placeholder="Ex. John Doe"
                  multiline
                  rows={1}
                  margin="dense"
                  variant="outlined"
                  helperText={ownerName_error_text}
                  defaultValue={employeeCode.ownerName}
                  className={classes.textField}
                  onChange={e => this.handleChange(e, null, 'ownerName')}
                  FormHelperTextProps={{ classes: { root: classes.helperText } }}
                  autoComplete="name"
                  type="text"
                />
            </div>
            <label className={classes.inputLabel}>Email</label>
            <div className={classes.textCell}>
                <TextField
                  placeholder="Ex. example@example.com"
                  margin="dense"
                  variant="outlined"
                  helperText={email_error_text}
                  defaultValue={employeeCode.email || ''}
                  className={classes.textField}
                  onChange={e => this.handleChange(e, null, 'email')}
                  FormHelperTextProps={{ classes: { root: classes.helperText } }}
                  autoComplete="email"
                  type="email"
                />
            </div>
            <label className={classes.inputLabel}>Mobile Phone Number</label>
            <div className={classes.textCell}>
                <PhoneTextInput phoneNumber={employeeCode.phoneNumber} error_text={phoneNumber_error_text} handleChange={this.handlePhoneChange}/>
            </div>
            <label className={classes.inputLabel}>* Permission Level</label>
            <div className={classes.textCell}>
                <Select
                    className={classes.permissionSelect}
                    onChange={e => this.handleChange(e, null, 'permissionLevel')}
                    value={employeeCode.permissionLevel}
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
                    onClick={this.isEmployeeDisabled}
                    className={classes.createButton}
                  >
                      {'Create & Activate Employee Code'}
                  </Button>
              </div>
          </div>
        )

        return (
          <div className={classes.root}>
              <div className={classes.content}>
                  <div className={classes.headerCell}>
                      <div className={classes.headers}>
                          New Employee Code
                      </div>
                  </div>
                  {GeneralContainer}
                  {CreateContainer}
              </div>
          </div>
        );
    }
}

EmployeeCodeCreateView.defaultProps = {
    idToken: '',
    accountID: '',
    employeeID: '',
    saveNewEmployee: f => f,
};
EmployeeCodeCreateView.propTypes = {
    idToken: PropTypes.string,
    accountID: PropTypes.string,
    employeeID: PropTypes.string,
    saveNewEmployee: PropTypes.func,
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(EmployeeCodeCreateView);
