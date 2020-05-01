/* eslint camelcase: 0, no-underscore-dangle: 0 */
import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import Fade from '@material-ui/core/Fade';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';

import RequestResultsTable from '../../../components/Xupply/Request/RequestResultsTable';
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
        marginBottom: 20,
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
    paper: {
      padding: theme.spacing(2),
      textAlign: 'center',
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
        requests: state.requestData.publicRequests,
        receivedAt: state.requestData.receivedPublicRequestsAt,
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
            requests: [],
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
        console.warn('Requests View Received Props')
        if (nextProps.receivedAt !== null && this.props.receivedAt === null) {
            this.receiveRequests(nextProps.requests);
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
        const _requests = [];
        filterBy(requests).forEach((request) => {
              request.items.forEach((i) => {
                    request.item = i;
                    _requests.push(request);
              });
        });
        this.setState({requests: _requests});
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

    deleteActiveRequest = (e, request) => {
        const {
            actions,
            idToken,
            employeeID,
            accountID,
        } = this.props;
        const { redirectRoute } = this.state;
        e.preventDefault();
        swal({
            title: `Delete this Request?`,
            text: `Doing so will permanently delete the data for this Request?.`,
            icon: 'warning',
            buttons: {
                cancel: 'Cancel',
                request: {
                    text: 'Delete',
                    value: 'delete',
                },
            },
        }).then((value) => {
            switch (value) {
                case 'delete':
                    console.log(`Delete Request`);
                    actions.deleteRequest(employeeID, accountID, request, redirectRoute);
                    break;
                default:
                    break;
            }
        });
    }

    renderRequestCard = (request) => {
        return (
            <Grid key={request.requestID} item xs={isMobileAndTablet() ? 12 : 4}>
                <RequestCard request={request} handleLink={this.dispatchNewRequest} handleDelete={this.deleteActiveRequest} />
            </Grid>
        )
    }

    render() {
        const { classes, accountID } = this.props;
        const {
            requests,
        } = this.state;

        console.error(requests)

        return requests.length > 0
        ? (
          <Fade
              in={true}
              style={{ transformOrigin: '0 0 0' }}
              {...(true ? { timeout: 1000 } : {})}
          >
          <section>
              <div className={classes.headerCell}>
                  <Fab
                      aria-label={'Add'}
                      className={isMobileAndTablet() ? classes.fab : null}
                      color={'primary'}
                      onClick={e => dispatchNewRoute(`/accounts/${accountID}/requests/create/beta`)}
                  >
                    <CloudUploadIcon />
                  </Fab>
              </div>
              <Grid container className={classes.root} spacing={2}>
                  <RequestResultsTable requests={requests} handleLink={this.dispatchNewRequest} />
              </Grid>
          </section>
          </Fade>
        ) : (
            <div className={classes.headerCell}>
                <EmptyResults
                    header={'Xupply Requests'}
                    title={'Create a request based on your inventory and we will match it with other Xupply Manufacturers'}
                    emptyType={'requests'}
                    handleLink={e => dispatchNewRoute(`/accounts/${accountID}/requests/create/beta`)}
                    startedLink={f=>f}
                    hiwLink={f=>f}
                    whatLink={f=>f}
                />
            </div>
        )
    }
}

// {requests.map(this.renderRequestCard, this)}

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
