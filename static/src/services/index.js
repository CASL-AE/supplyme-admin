import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import { LOGOUT_EMPLOYEE_SUCCESS } from '../constants/index';

/* App Reducer Files */
import app from './app/reducer';
import accountData from './account/reducer';
import employeeData from './employee/reducer';
import locationData from './location/reducer';
import googleData from './google/reducer';
import requestData from './request/reducer';
import menuItemData from './menuItem/reducer';
import orderData from './order/reducer';
import opportunityData from './opportunity/reducer';

/* Public Reducer Files */
import valorData from './valor/reducer';

const appReducer = history => {
    return combineReducers({
        // Public
        router: connectRouter(history),
        valorData,
        // Private
        app,
        accountData,
        employeeData,
        locationData,
        googleData,
        requestData,
        menuItemData,
        orderData,
        opportunityData,
    });
}

const rootReducer = history => (state, action) => {
    if (action.type === LOGOUT_EMPLOYEE_SUCCESS) {
        state = undefined;
    }
    return appReducer(history)(state, action);
};

export default rootReducer;
