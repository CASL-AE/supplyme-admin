import { combineReducers } from 'redux';
import { getOrderFromSnapshot } from './model';

const addOrder = (state, action) => {
    switch (action.type) {
        case 'ADD_ORDER':
          return getOrderFromSnapshot(action)
        default:
            return state
    }
}

const orders = (state = [], action) => {
    switch (action.type) {
        case 'ADD_ORDER':
            if (state.map(order => order.orderID).includes(action.orderID)) {
              return [
                addOrder(undefined, action)
              ]
            }else{
                return [
                  ...state,
                  addOrder(undefined, action)
                ]
            }
        default:
            return state
    }
};

const receivedAt = (state = null, action) => {
    switch (action.type) {
    case 'UNMOUNT_ORDERS_LISTENER_ORDER':
        return null;
    case 'START_FETCHING_ORDERS':
        return state;
    case 'ADD_ORDER':
        return null;
    case 'RECEIVED_ORDERS':
        return Date.now();

    default:
        return state;
    }
};

const orderData = combineReducers({
    orders,
    receivedAt,
});

export default orderData;
