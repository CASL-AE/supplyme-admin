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

import OpportunityResultsTable from '../../../components/Xupply/Opportunity/OpportunityResultsTable';

import { validateString, dispatchNewRoute, filterBy } from '../../../utils/misc';

// Request Functions
import { fetchPublicRequests } from '../../../services/request/actions';
import { requestRowObject } from '../../../services/request/model';

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
});

function mapStateToProps(state) {
    return {
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
class OpportunityListView extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            rows: [],
        };
    }

    componentDidMount() {
        console.log('Opportunity List View Mounted');
        const { receivedAt, requests } = this.props;
        if (receivedAt === null) {
            this.loadRequestCompData();
        } else {
            this.receiveRequests(requests);
        }
    }

    componentWillReceiveProps(nextProps) {
        console.warn('Opportunity List View Recieved Props');
        if (nextProps.receivedAt !== null && this.props.receivedAt === null) {
            this.receiveRequests(nextProps.requests);
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        console.warn('Opportunity List View Should Update');
        if (nextState === this.state) {
            return false;
        }
        return true;
    }

    componentDidUpdate() {
        console.warn('Opportunity List View Updated');
    }

    componentWillUnmount() {
        console.warn('Opportunity List View UnMounted');
        this.loadRequestCompData = undefined;
        this.receiveRequests = undefined;
        this.render = undefined;
    }


    loadRequestCompData = () => {
        const { actions } = this.props;
        actions.fetchPublicRequests();
    }

    receiveRequests = (requests) => {
        console.warn('Received Requests');
        const rows = filterBy(requests).map(e => requestRowObject(e));
        this.setState({
            rows,
        });
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
                    <OpportunityResultsTable
                        rows={rows}
                        handleLink={this.dispatchNewRequest}
                        handleAction={this.dispatchNewRequest}
                    />
                </div>
            </div>
        );
    }
}

OpportunityListView.defaultProps = {
    fetchPublicRequests: f => f,
};
OpportunityListView.propTypes = {
    fetchPublicRequests: PropTypes.func,
    classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(OpportunityListView);
