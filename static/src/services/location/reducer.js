import { combineReducers } from 'redux';
import { getLocationFromSnapshot } from './model';



const addLocation = (state, action) => {
    switch (action.type) {
        case 'ADD_LOCATION':
          return getLocationFromSnapshot(action)
        default:
            return state
    }
}



const locations = (state = [], action) => {
    switch (action.type) {
        case 'ADD_LOCATION':
            if (state.map(location => location.locationID).includes(action.locationID)) {
              return [
                addLocation(undefined, action)
              ]
            }else{
                return [
                  ...state,
                  addLocation(undefined, action)
                ]
            }
        default:
            return state
    }
};

const receivedAt = (state = null, action) => {
    switch (action.type) {
    case 'UNMOUNT_LOCATIONS_LISTENER_REQUEST':
        return null;
    case 'START_FETCHING_LOCATIONS':
        return state;
    case 'ADD_LOCATION':
        return null;
    case 'RECEIVED_LOCATIONS':
        return Date.now();

    default:
        return state;
    }
};

const locationData = combineReducers({
    locations,
    receivedAt,
});

export default locationData;
