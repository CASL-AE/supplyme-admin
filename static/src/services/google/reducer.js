import { combineReducers } from 'redux';

const initialState = {
    placeData: [],
    isPlacesFetching: false,
    isPlacesLoaded: false,
    statusText: null,
};

const google = (state = initialState, action) => {
    switch (action.type) {
    case 'FETCH_GOOGLE_PLACES_REQUEST':
        return Object.assign({}, state, {
            isPlacesFetching: true,
            placeData: [],
            isPlacesLoaded: false,
        });
    case 'RECEIVE_GOOGLE_PLACES_SUCCESS':
        return Object.assign({}, state, {
            isPlacesFetching: false,
            isPlacesLoaded: true,
            placeData: action.places,
        });
    case 'RECEIVE_GOOGLE_PLACES_FAILURE':
        return Object.assign({}, state, {
            statusText: `Data Error: ${action.payload.status} ${action.payload.statusText}`,
            isPlacesFetching: false,
            isPlacesLoaded: false,
            placeData: [],
        });
    default:
        return state;
    }
};

const googleData = combineReducers({
    google,
});

export default googleData;
