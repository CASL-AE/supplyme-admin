import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import { LOGOUT_USER } from '../constants/index';

/* Admin Reducer Files */
import app from './app/reducer';
import accountData from './account/reducer';
import employeeData from './employee/reducer';
import locationData from './location/reducer';
import googleData from './google/reducer';
import requestData from './request/reducer';
import menuItemData from './menuItem/reducer';

const appReducer = history => combineReducers({
    router: connectRouter(history),
    app,
    accountData,
    employeeData,
    locationData,
    googleData,
    requestData,
    menuItemData,
});

export const rootReducer = history => (state, action) => {
    if (action.type === LOGOUT_USER) {
        state = undefined;
    }
    return appReducer(history, state, action);
};

export default appReducer;
