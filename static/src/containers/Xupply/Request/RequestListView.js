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
import IconButton from '@material-ui/core/IconButton';

import RequestResultsTable from '../../../components/Xupply/Request/RequestResultsTable';

import { validateString, dispatchNewRoute, filterBy } from '../../../utils/misc';
import { fetchRequests } from '../../../services/request/actions';
import { requestRowObject } from '../../../services/request/model';

const styles = (theme) => ({
    root: {
        flex: 1,
        display: 'inline-block',
        width: '100%',
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
});

function mapStateToProps(state) {
    return {
        router: state.router,
        idToken: state.app.idToken,
        employeeID: state.app.employeeID,
        accountID: state.app.accountID,
        requests: state.requestData.requests,
        receivedAt: state.requestData.receivedAt,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: {},
    };
}

@connect(mapStateToProps, mapDispatchToProps)
class RequestListView extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            request: {},
            showRequestDialog: false,
            rows: [],
        };
    }

    componentDidMount() {
        console.log('Requests View Mounted');
        const { receivedAt, requests } = this.props;
        if (!receivedAt === null) {
            this.loadCompData();
        } else {
            this.receiveRequests(requests);
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.receivedAt !== null && !this.props.receivedAt === null) {
            this.receiveRequests(nextProps.requests);
        }
        const { accountID } = nextProps;
        if (nextProps.receivedAt !== null && nextProps.requests.length === 0) {
            const route = `/accounts/${accountID}/requests/create/beta`;
            dispatchNewRoute(route);
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (nextState === this.state) {
            return false;
        }
        return true;
    }

    componentDidUpdate() {
        console.log('Requests View Updated');
    }

    componentWillUnmount() {
        console.log('Requests View UnMounted');
        const { actions } = this.props;
        // actions.unmountRequestListener();
        this.receiveRequests = undefined;
        this.loadCompData = undefined;
        this.render = undefined;
    }

    receiveRequests = (requests) => {
        console.warn('Received Requests');
        const rows = filterBy(requests).map(e => requestRowObject(e));

        this.setState({
            rows,
        });
    }

    loadCompData = () => {
        const { actions, employeeID, accountID } = this.props;
        actions.fetchRequests(accountID);
    }

    dispatchNewRequest = (e, requestID) => {
        e.preventDefault();
        const { accountID } = this.props;
        const route = `/accounts/${accountID}/requests/${requestID}`;
        dispatchNewRoute(route);
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
              onClick={e => dispatchNewRoute(`/accounts/${accountID}/requests/create/beta`)}
            >
                {'+ New Request'}
            </Button>
            </div>
        );
        return (
            <div className={classes.root}>
                <div className={classes.content}>
                    <div className={classes.headerCell}>
                        {GeneralContainer}
                    </div>
                    <RequestResultsTable
                        type={'request'}
                        rows={rows}
                        handleLink={this.dispatchNewRequest}
                    />
                </div>
            </div>
        );
    }
}

RequestListView.defaultProps = {
    accountID: '',
    employeeID: '',
    fetchRequests: f => f,
    bulkUploadRequests: f => f,
};
RequestListView.propTypes = {
    accountID: PropTypes.string,
    employeeID: PropTypes.string,
    fetchRequests: PropTypes.func,
    bulkUploadRequests: PropTypes.func,
    classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(RequestListView);
