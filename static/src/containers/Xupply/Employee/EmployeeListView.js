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

import EmployeeResultsTable from '../../../components/Xupply/Employee/EmployeeResultsTable';

import { validateString, dispatchNewRoute, filterBy } from '../../../utils/misc';
import { fetchEmployees, sendEmployeeCodeEmail } from '../../../services/employee/actions';
import { employeeRowObject } from '../../../services/employee/model';

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
        employeeID: state.app.employeeID,
        accountID: state.app.accountID,
        employee: state.employeeData.employee,
        employees: state.employeeData.employees,
        receivedAt: state.employeeData.receivedAt,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: {
            fetchEmployees: bindActionCreators(fetchEmployees, dispatch),
            sendEmployeeCodeEmail: bindActionCreators(sendEmployeeCodeEmail, dispatch),
        },
    };
}

@connect(mapStateToProps, mapDispatchToProps)
class EmployeeListView extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            employee: {},
            showEmployeeDialog: false,
            rows: [],
        };
    }

    componentDidMount() {
        console.log('Employees View Mounted');
        const { receivedAt, employees } = this.props;
        if (receivedAt === null) {
            this.loadCompData();
        } else {
            this.receiveEmployees(employees);
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.receivedAt !== null && this.props.receivedAt === null) {
            this.receiveEmployees(nextProps.employees);
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (nextState === this.state) {
            return false;
        }
        return true;
    }

    componentDidUpdate() {
        console.log('Employees View Updated');
    }

    componentWillUnmount() {
        console.log('Employees View UnMounted');
        const { actions } = this.props;
        // actions.unmountEmployeeListener();
        this.receiveEmployees = undefined;
        this.loadCompData = undefined;
        this.render = undefined;
    }

    receiveEmployees = (employees) => {
        console.warn('Received Employees');
        const rows = filterBy(employees).map(e => employeeRowObject(e));
        this.setState({
            rows,
        });
    }

    loadCompData = () => {
        const { actions, employeeID, accountID } = this.props;
        actions.fetchEmployees(employeeID, accountID);
    }

    dispatchNewEmployee = (e, employeeID) => {
        e.preventDefault();
        const { accountID } = this.props;
        const route = `/accounts/${accountID}/employees/${employeeID}`
        dispatchNewRoute(route);
    }

    handleEmployeeCodeAction = (e, action, employeeCode) => {
        const { actions, idToken, employeeID, accountID } = this.props;
        employeeCode.activationCode = employeeCode.id;
        employeeCode.id = null;
        employeeCode.index = null;
        actions.sendEmployeeCodeEmail(idToken, employeeCode);
    }

    render() {
        const { classes, accountID } = this.props;
        const {
            rows,
        } = this.state;

        const GeneralContainer = (
            <div className={classes.outerCell}>
            <Button
              variant="contained"
              disableRipple
              disableFocusRipple
              className={classes.firstButton}
              classes={{ label: classes.buttonLabel }}
              onClick={e => dispatchNewRoute(`/accounts/${accountID}/employees/codes/create`)}
            >
                {'+ New Activation Code'}
            </Button>
            <Button
              variant="contained"
              disableRipple
              disableFocusRipple
              className={classes.secondButton}
              classes={{ label: classes.buttonLabel }}
              onClick={e => dispatchNewRoute(`/accounts/${accountID}/employees/codes`)}
            >
                {'List Active Codes'}
            </Button>
            </div>
        );
        return (
            <div className={classes.root}>
                <div className={classes.content}>
                    <div className={classes.headerCell}>
                        {GeneralContainer}
                    </div>
                    <EmployeeResultsTable
                        type={'employee'}
                        rows={rows}
                        handleLink={this.dispatchNewEmployee}
                        handleAction={this.handleEmployeeCodeAction}
                    />
                </div>
            </div>
        );
    }
}

EmployeeListView.defaultProps = {
    accountID: '',
    employeeID: '',
    fetchEmployees: f => f,
    sendEmployeeCodeEmail: f => f,
};
EmployeeListView.propTypes = {
    accountID: PropTypes.string,
    employeeID: PropTypes.string,
    fetchEmployees: PropTypes.func,
    sendEmployeeCodeEmail: PropTypes.func,
    classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(EmployeeListView);
