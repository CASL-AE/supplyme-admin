/* eslint camelcase: 0, no-underscore-dangle: 0 */
import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Button from '@material-ui/core/Button';

import EmployeeCodeResultsTable from '../../../components/Xupply/Employee/EmployeeCodeResultsTable';

import { validateString, dispatchNewRoute } from '../../../utils/misc';
import { fetchEmployeeCodes, sendEmployeeCodeEmail, deleteEmployeeCode } from '../../../services/employee/actions';
import { employeeCodeRowObject } from '../../../services/employee/model';

const styles = (theme) => ({
    root: {
        flex: 1,
        display: 'inline-block',
        width: '100%',
        backgroundColor: theme.palette.primary.background,
    },
    content: {
        paddingTop: 42,
        paddingBottom: 42,
        paddingLeft: 80,
        paddingRight: 80,
    },
    outerCell: {
        marginBottom: 80,
    },
    headerCell: {
        marginBottom: 40,
        display: 'block',
    },
    firstButton: {
        marginTop: 28,
        color: '#ffffff',
        backgroundColor: theme.palette.primary.main,
        textTransform: 'none',
    },
    buttonLabel: {
        padding: 3,
    },
    secondButton: {
        marginTop: 28,
        marginLeft: 10,
        color: '#656565',
        backgroundColor: '#d4d4d4',
        textTransform: 'none',
    },
});

function mapStateToProps(state) {
    return {
        router: state.router,
        idToken: state.app.idToken,
        accountID: state.app.accountID,
        employeeID: state.app.employeeID,
        employeeCodes: state.employeeData.employeeCodes,
        receivedAt: state.employeeData.codesReceivedAt,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: {
            fetchEmployeeCodes: bindActionCreators(fetchEmployeeCodes, dispatch),
            sendEmployeeCodeEmail: bindActionCreators(sendEmployeeCodeEmail, dispatch),
            deleteEmployeeCode: bindActionCreators(deleteEmployeeCode, dispatch),
        },
    };
}

@connect(mapStateToProps, mapDispatchToProps)
class EmployeeCodeListView extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            employeeCodes: [],
        };
    }

    componentDidMount() {
        console.log('Accounts View Mounted');
        const { receivedAt, employeeCodes } = this.props;
        if (receivedAt === null) {
            this.loadCompData();
        } else {
            this.receiveEmployeeCodes(employeeCodes);
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.receivedAt && !this.props.receivedAt) {
            this.receiveEmployeeCodes(nextProps.employeeCodes);
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (nextState === this.state) {
            return false;
        }
        return true;
    }

    componentDidUpdate() {
        console.log('Accounts View Updated');
    }

    componentWillUnmount() {
        console.log('Accounts View UnMounted');
        const { actions } = this.props;
        // actions.unmountEmployeeListener();
        this.receiveAccounts = undefined;
        this.loadCompData = undefined;
        this.render = undefined;
    }

    receiveEmployeeCodes = (employeeCodes) => {
        console.warn('Received Employee Codes');
        this.setState({
            employeeCodes,
        });
    }

    loadCompData = () => {
        const { actions, accountID, employeeID } = this.props;
        actions.fetchEmployeeCodes(accountID);
    }

    handleEmailAction = (e, employeeCode) => {
        const { actions, idToken, accountID, employeeID } = this.props;
        actions.sendEmployeeCodeEmail(idToken, employeeCode);
    }

    handleDeleteAction = (e, employeeCode) => {
        const { actions, idToken, accountID, employeeID } = this.props;
        actions.sendEmployeeCodeEmail(idToken, employeeCode);
    }

    handleDeleteAction = (e, employeeCode) => {
        const {
            actions,
            idToken,
            employeeID,
            accountID,
        } = this.props;
        const { redirectRoute } = this.state;
        e.preventDefault();
        swal({
            title: `Delete this Employee Code?`,
            text: `Doing so will permanently delete the data for this Employee Code?.`,
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
                        console.log(`Delete Employee Code`);
                        actions.deleteEmployeeCode(employeeID, accountID, employeeCode, redirectRoute);
                        break;
                    default:
                        break;
                }
            });
    }

    render() {
        const { classes, accountID } = this.props;
        const {
            employeeCodes,
        } = this.state;

        const GeneralContainer = (
            <div className={classes.outerCell}>
            <Button
              variant="contained"
              disableRipple
              disableFocusRipple
              className={classes.secondButton}
              classes={{ label: classes.buttonLabel }}
              onClick={e => dispatchNewRoute(`/accounts/${accountID}/employees`)}
            >
                {'List Employees'}
            </Button>
            </div>
        );
        return (
            <div className={classes.root}>
                <div className={classes.content}>
                    <div className={classes.headerCell}>
                        {GeneralContainer}
                    </div>
                    <EmployeeCodeResultsTable
                        type={'employee_code'}
                        employeeCodes={employeeCodes}
                        handleLink={this.dispatchNewEmployeeCode}
                        handleEmailAction={this.handleEmailAction}
                        handleDeleteAction={this.handleDeleteAction}
                    />
                </div>
            </div>
        );
    }
}

EmployeeCodeListView.defaultProps = {
    idToken: '',
    accountID: '',
    employeeID: '',
    fetchEmployeeCodes: f => f,
    sendEmployeeCodeEmail: f => f,
    sendEmployeeCodePhone: f => f,
    deleteEmployeeCode: f => f,
};
EmployeeCodeListView.propTypes = {
    idToken: PropTypes.string,
    accountID: PropTypes.string,
    employeeID: PropTypes.string,
    fetchEmployeeCodes: PropTypes.func,
    sendEmployeeCodeEmail: PropTypes.func,
    sendEmployeeCodePhone: PropTypes.func,
    deleteEmployeeCode: PropTypes.func,
    classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(EmployeeCodeListView);
