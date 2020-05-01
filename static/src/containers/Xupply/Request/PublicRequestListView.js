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
import IconButton from '@material-ui/core/IconButton';

import PublicRequestResultsTable from '../../../components/Xupply/Request/PublicRequestResultsTable';
import RequestCard from '../../../components/Xupply/Request/RequestCard';
import EmptyResults from '../../../components/Xupply/Base/EmptyResults';

import { validateString, dispatchNewRoute, filterBy } from '../../../utils/misc';
import { fetchRequests } from '../../../services/request/actions';
import { requestRowObject } from '../../../services/request/model';
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
        actions: {
            fetchRequests: bindActionCreators(fetchRequests, dispatch),
        },
    };
}

@connect(mapStateToProps, mapDispatchToProps)
class PublicRequestListView extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            request: {},
            showRequest: false,
            requests: [],
        };
    }

    componentDidMount() {
        console.log('Requests View Mounted');
        const { receivedAt, requests } = this.props;
        if (receivedAt === null) {
            this.loadCompData();
        } else {
            this.receiveRequests(requests);
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.receivedAt !== null && this.props.receivedAt === null) {
            this.receiveRequests(nextProps.requests);
        }
        // if (nextProps.request.isLoaded && this.props.request.isFetching) {
        //     this.handledClose();
        // }
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
        this.setState({
            requests: filterBy(requests),
        });
    }

    loadCompData = () => {
        const { actions } = this.props;
        actions.fetchRequests();
    }

    dispatchNewRequest = (e, requestID) => {
        e.preventDefault();
        const { accountID } = this.props;
        const route = `/accounts/${accountID}/requests/${requestID}`;
        dispatchNewRoute(route);
    }

    renderRequestCard = (request) => {
        return (
            <Grid item xs={isMobileAndTablet() ? 12 : 4}>
              <RequestCard request={request} />
            </Grid>
        )
    }

    render() {
        const { classes, accountID } = this.props;
        const {
            requests,
        } = this.state;

        console.log(requests)

        return requests.length > 0
        ? (
          <Grid container className={classes.root} spacing={2}>
              <PublicRequestResultsTable requests={requests} handleLink={this.dispatchNewRequest} />
          </Grid>
        ) : (
            <EmptyResults
              title={`There are currently no open requests...`}
              message={`You will see open requests appear here. Please check back soon...`}
            />
        )
    }
}

PublicRequestListView.defaultProps = {
    accountID: '',
    employeeID: '',
    fetchRequests: f => f,
};
PublicRequestListView.propTypes = {
    accountID: PropTypes.string,
    employeeID: PropTypes.string,
    fetchRequests: PropTypes.func,
    classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(PublicRequestListView);
