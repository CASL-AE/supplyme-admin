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

import PublicRequestResultsTable from '../../../components/Xupply/Request/PublicRequestResultsTable';

import { validateString, dispatchNewRoute, filterBy } from '../../../utils/misc';
import { fetchPublicRequests } from '../../../services/request/actions';
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
        requests: state.requestData.publicRequests,
        receivedAt: state.requestData.receivedPublicRequestsAt,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: {
            fetchPublicRequests: bindActionCreators(fetchPublicRequests, dispatch),
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
            rows: [],
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
        const rows = filterBy(requests).map(e => requestRowObject(e));

        this.setState({
            rows,
        });
    }

    loadCompData = () => {
        const { actions } = this.props;
        actions.fetchPublicRequests();
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
            <div className={classes.outerCell}><h1>Search Requests</h1>
            </div>
        );

        return (
            <div className={classes.root}>
                <div className={classes.content}>
                    <div className={classes.headerCell}>
                        {GeneralContainer}
                    </div>
                    <PublicRequestResultsTable
                        type={'request'}
                        rows={rows}
                        handleLink={this.dispatchNewRequest}
                    />
                </div>
            </div>
        );
    }
}

PublicRequestListView.defaultProps = {
    accountID: '',
    employeeID: '',
    fetchPublicRequests: f => f,
};
PublicRequestListView.propTypes = {
    accountID: PropTypes.string,
    employeeID: PropTypes.string,
    fetchPublicRequests: PropTypes.func,
    classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(PublicRequestListView);

// {requestItems.length > 0
//   ? (
//     <div className={classes.block}>
//         <dl className={classes.detailList}>
//             <div className={classes.detailListFlex}>
//                 {orderItems.map(this.renderRequestMenuItems, this)}
//             </div>
//         </dl>
//     </div>
//   ) : null
// }
