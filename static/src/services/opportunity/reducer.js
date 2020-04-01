import { combineReducers } from 'redux';
import { getOpportunityFromSnapshot } from './model';

const addOpportunity = (state, action) => {
    switch (action.type) {
        case 'ADD_OPPORTUNITY':
          return getOpportunityFromSnapshot(action)
        default:
            return state
    }
}

const opportunities = (state = [], action) => {
    switch (action.type) {
        case 'ADD_OPPORTUNITY':
            if (state.map(opportunity => opportunity.opportunityID).includes(action.opportunityID)) {
              return [
                addOpportunity(undefined, action)
              ]
            }else{
                return [
                  ...state,
                  addOpportunity(undefined, action)
                ]
            }
        default:
            return state
    }
};

const receivedAt = (state = null, action) => {
    switch (action.type) {
    case 'UNMOUNT_OPPORTUNITIES_LISTENER_OPPORTUNITY':
        return null;
    case 'START_FETCHING_OPPORTUNITIES':
        return state;
    case 'ADD_OPPORTUNITY':
        return null;
    case 'RECEIVED_OPPORTUNITIES':
        return Date.now();

    default:
        return state;
    }
};

const opportunityData = combineReducers({
    opportunities,
    receivedAt,
});

export default opportunityData;
