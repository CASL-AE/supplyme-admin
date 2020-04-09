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
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';

import OpportunityResultsTable from '../../../components/Xupply/Opportunity/OpportunityResultsTable';
import OpportunityCard from '../../../components/Xupply/Opportunity/OpportunityCard';
import EmptyResults from '../../../components/Xupply/Base/EmptyResults';

import { validateString, dispatchNewRoute, filterBy } from '../../../utils/misc';

// Opportunity Functions
import { fetchOpportunities } from '../../../services/opportunity/actions';
import { opportunityRowObject } from '../../../services/opportunity/model';
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
      fab: {
          position: 'absolute',
          bottom: theme.spacing(2),
          right: theme.spacing(2),
      },
});

function mapStateToProps(state) {
    return {
        opportunities: state.opportunityData.opportunities,
        receivedAt: state.opportunityData.receivedAt,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: {
            fetchOpportunities: bindActionCreators(fetchOpportunities, dispatch),
        },
    };
}

@connect(mapStateToProps, mapDispatchToProps)
class OpportunityListView extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            opportunities: [],
        };
    }

    componentDidMount() {
        console.log('Opportunity List View Mounted');
        const { receivedAt, opportunities } = this.props;
        if (receivedAt === null) {
            this.loadOpportunityCompData();
        } else {
            this.receiveOpportunitys(opportunities);
        }
    }

    componentWillReceiveProps(nextProps) {
        console.warn('Opportunity List View Recieved Props');
        if (nextProps.receivedAt !== null && this.props.receivedAt === null) {
            this.receiveOpportunitys(nextProps.opportunities);
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
        this.loadOpportunityCompData = undefined;
        this.receiveOpportunitys = undefined;
        this.render = undefined;
    }


    loadOpportunityCompData = () => {
        const { actions } = this.props;
        // actions.fetchOpportunities();
    }

    receiveOpportunitys = (opportunities) => {
        console.warn('Received Opportunitys');
        this.setState({
            opportunities: filterBy(opportunities),
        });
    }

    dispatchNewOpportunity = (e, opportunityID) => {
        e.preventDefault();
        const { accountID } = this.props;
        const route = `/accounts/${accountID}/opportunities/create/opportunities/${opportunityID}`;
        dispatchNewRoute(route);
    }

    renderOpportunityCard = (opportunity) => {
        return (
            <Grid item xs={isMobileAndTablet() ? 12 : 4}>
                <OpportunityCard opportunity={opportunity} />
            </Grid>
        )
    }

    render() {
        const { classes, accountID } = this.props;
        const {
            opportunities,
        } = this.state;

        return opportunities.length > 0
        ? (
            <section>
            <div className={classes.headerCell}>
                <Fab
                    aria-label={'Add'}
                    className={isMobileAndTablet() ? classes.fab : null}
                    color={'primary'}
                    onClick={e => dispatchNewRoute(`/accounts/${accountID}/opportunities/create/beta`)}
                >
                  <AddIcon />
                </Fab>
            </div>
            <Grid container className={classes.root} spacing={3}>
                {rows.map(this.renderOpportunityCard, this)}
            </Grid>
            </section>
        ) : (
          <div className={classes.headerCell}>
                <Fab
                    aria-label={'Add'}
                    className={isMobileAndTablet() ? classes.fab : null}
                    color={'primary'}
                    onClick={e => dispatchNewRoute(`/accounts/${accountID}/opportunities/create/beta`)}
                >
                  <AddIcon />
                </Fab>
                <EmptyResults
                    title={`You haven't created any opportunities...`}
                    message={`You will see active opportunities appear here. Create one to get started...`}
                />
            </div>
        )

    }
}

OpportunityListView.defaultProps = {
    fetchOpportunities: f => f,
};
OpportunityListView.propTypes = {
    fetchOpportunities: PropTypes.func,
    classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(OpportunityListView);
