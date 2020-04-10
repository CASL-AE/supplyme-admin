/* eslint camelcase: 0, no-underscore-dangle: 0 */
import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Button from '@material-ui/core/Button';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import ClearAllIcon from '@material-ui/icons/ClearAll';

import EmployeeResultsTable from '../../../components/Xupply/Employee/EmployeeResultsTable';
import EmployeeCard from '../../../components/Xupply/Employee/EmployeeCard';
import EmptyResults from '../../../components/Xupply/Base/EmptyResults';

import { validateString, dispatchNewRoute, filterBy } from '../../../utils/misc';
import { fetchEmployees, sendEmployeeCodeEmail } from '../../../services/employee/actions';
import { employeeRowObject } from '../../../services/employee/model';
import { isMobileAndTablet } from '../../../utils/isMobileAndTablet';

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
    fab: {
        position: 'absolute',
        bottom: theme.spacing(2),
        right: theme.spacing(2),
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
            employees: [],
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
        this.setState({
            employees: filterBy(employees),
        });
    }

    loadCompData = () => {
        const { actions, employeeID, accountID } = this.props;
        actions.fetchEmployees(employeeID, accountID);
    }

    dispatchNewEmployee = (e, employeeID) => {
        e.preventDefault();
        console.log(employeeID)
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

    renderEmployeeCard = (employee) => {
        return (
            <Grid item xs={isMobileAndTablet() ? 12 : 4}>
                <EmployeeCard employee={employee} handleLink={this.dispatchNewEmployee} />
            </Grid>
        )
    }

    render() {
        const { classes, accountID } = this.props;
        const {
            employees,
        } = this.state;

        return (
            <section>
                <div className={classes.headerCell}>
                    <Fab
                        aria-label={'Add'}
                        className={isMobileAndTablet() ? classes.fab : null}
                        color={'primary'}
                        onClick={e => dispatchNewRoute(`/accounts/${accountID}/employees/codes/create`)}
                    >
                      <AddIcon />
                    </Fab>
                    <Fab
                        aria-label={'List'}
                        className={isMobileAndTablet() ? classes.fab : null}
                        color={'primary'}
                        onClick={e => dispatchNewRoute(`/accounts/${accountID}/employees/codes`)}
                        style={{marginLeft: 20}}
                    >
                      <ClearAllIcon />
                    </Fab>
                </div>
                <Grid container className={classes.root} spacing={3}>
                    {employees.map(this.renderEmployeeCard, this)}
                </Grid>
            </section>
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
