import { combineReducers } from 'redux';
import { getRequestFromSnapshot } from './model';

const addRequest = (state, action) => {
    switch (action.type) {
        case 'ADD_REQUEST':
          return getRequestFromSnapshot(action)
        default:
            return state
    }
}

const requests = (state = [], action) => {
    switch (action.type) {
        case 'ADD_REQUEST':
            if (state.map(request => request.requestID).includes(action.requestID)) {
              return [
                addRequest(undefined, action)
              ]
            }else{
                return [
                  ...state,
                  addRequest(undefined, action)
                ]
            }
        default:
            return state
    }
};

const receivedAt = (state = null, action) => {
    switch (action.type) {
    case 'UNMOUNT_REQUESTS_LISTENER_REQUEST':
        return null;
    case 'START_FETCHING_REQUESTS':
        return state;
    case 'ADD_REQUEST':
        return null;
    case 'RECEIVED_REQUESTS':
        return Date.now();

    default:
        return state;
    }
};

const addPublicRequest = (state, action) => {
    switch (action.type) {
        case 'ADD_PUBLIC_REQUEST':
          return getRequestFromSnapshot(action)
        default:
            return state
    }
}

const publicRequests = (state = [], action) => {
    switch (action.type) {
        case 'ADD_PUBLIC_REQUEST':
            if (state.map(request => request.requestID).includes(action.requestID)) {
              return [
                addPublicRequest(undefined, action)
              ]
            }else{
                return [
                  ...state,
                  addPublicRequest(undefined, action)
                ]
            }
        default:
            return state
    }
};

const receivedPublicRequestsAt = (state = null, action) => {
    switch (action.type) {
    case 'UNMOUNT_PUBLIC_REQUESTS_LISTENER_REQUEST':
        return null;
    case 'START_FETCHING_PUBLIC_REQUESTS':
        return state;
    case 'ADD_PUBLIC_REQUEST':
        return null;
    case 'RECEIVED_PUBLIC_REQUESTS':
        return Date.now();

    default:
        return state;
    }
};

const requestData = combineReducers({
    requests,
    receivedAt,
    publicRequests,
    receivedPublicRequestsAt,
});

export default requestData;
