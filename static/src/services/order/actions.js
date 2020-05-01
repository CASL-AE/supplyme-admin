import history from '../../history';
import { db } from '../../store/firebase';
import { parseJSON, formatFirestoreDateString, validateString, validateKey } from '../../utils/misc';
import { apiBulkUploadOrders } from '../../utils/http_functions';
import { toNewOrder, parseOrder } from './model';
import { getRequestFromSnapshot } from '../request/model';
import { errorAlert, successAlert } from '../../utils/alerts';
import { xupplyAnalytic } from '../../utils/analytics';

export const addOrder = order => ({
    type: 'ADD_ORDER',
    ...order,
});

export const startFetchingOrders = () => ({
    type: 'START_FETCHING_ORDERS',
});

export const receivedOrders = () => ({
    type: 'RECEIVED_ORDERS',
    receivedAt: Date.now(),
});
export const receiveOrders = querySnapshot => (dispatch) => {
    if (querySnapshot) {
        querySnapshot.forEach((doc) => {
            const order = doc.data();
            order.orderID = doc.id;
            dispatch(addOrder(order));
        });
        dispatch(receivedOrders());
    }
};

export const fetchOrders = (employeeID, accountID) => (dispatch) => {
    dispatch(startFetchingOrders());
    db()
        .collection('Accounts')
        .doc(accountID)
        .collection('Orders')
        .onSnapshot((querySnapshot) => {
            setTimeout(() => {
                const orders = querySnapshot || [];
                dispatch(receiveOrders(orders));
            }, 0);
        }, (error) => {
            console.log(error);
        });
};

// Save New Order
//
// [START Save New Order]
export const saveNewOrderOrder = () => ({
    type: 'SAVE_NEW_ORDER_ORDER',
});


export const saveNewOrderSuccess = () => ({
    type: 'SAVE_NEW_ORDER_SUCCESS',
});

export const saveNewOrderFailure = error => ({
    type: 'SAVE_NEW_ORDER_FAILURE',
    payload: {
        status: error.response.status,
        statusText: error.response.statusText,
    },
});
export const saveNewOrder = (token, employeeID, accountID, order, redirectRoute) => (dispatch) => {
    dispatch(saveNewOrderOrder());

    const createdDate = new Date();

    const manuRef = db().collection("Accounts").doc(accountID);
    const newManuOrderRef = manuRef.collection("Orders").doc();

    // TODO: Validate retailAccountID && requestID
    const requestID = order.request.requestID;
    const retailerAccountID = order.request.status.events[0].accountID;
    const retailerRef = db().collection("Accounts").doc(retailerAccountID);
    const newRetailerOrderRef = retailerRef.collection("Orders").doc(newManuOrderRef.id)
    const currentRequestRef = retailerRef.collection("Requests").doc(requestID)


    const orderInfo = order;
    const newEvent = {
        'employeeID': employeeID,
        'accountID': accountID,
        'time': createdDate,
        'action': 'created',
    }
    orderInfo.deleted = false;
    orderInfo.status.isStatus = 0;
    orderInfo.status.isStatusTime = createdDate;
    orderInfo.status.events = [newEvent];
    orderInfo.orderID = newManuOrderRef.id;

    return db().runTransaction(transaction => {
        transaction.set(newManuOrderRef, parseOrder(orderInfo, currentRequestRef));
        transaction.set(newRetailerOrderRef, parseOrder(orderInfo, currentRequestRef));
        return Promise.resolve(orderInfo);
    }).then((orderInfo) => {
        console.log("Transaction successfully committed!");
        dispatch(saveNewOrderSuccess());
        xupplyAnalytic('save_order_success');
        // dispatch(addOrder(order))
        history.push(redirectRoute)
    }).catch((error) => {
        console.log("Transaction failed: ", error);
        xupplyAnalytic('save_order_failure');
        dispatch(saveNewOrderFailure({
            response: {
                status: 999,
                statusText: error.message,
            },
        }));
    });
};
// [END Save New Order]

// Update Order
// TODO: None
// [START Update Order]
export const updateOrderOrder = () => ({
    type: 'UPDATE_ORDER_ORDER',
});


export const updateOrderSuccess = order => ({
    type: 'UPDATE_ORDER_SUCCESS',
    payload: {
        order,
    },
});

export const updateOrderFailure = error => ({
    type: 'UPDATE_ORDER_FAILURE',
    payload: {
        status: error.response.status,
        statusText: error.response.statusText,
    },
});

export const updateOrder = (employeeID, accountID, order, redirectRoute) => (dispatch) => {
    dispatch(updateOrderOrder());
    const orderID = order.orderID;
    if (!validateKey(orderID)) {
        errorAlert('Invalid Order ID');
        dispatch(updateOrderFailure({
            response: {
                status: 403,
                statusText: 'Invalid Order ID',
            },
        }));
        return;
    }

    if (!validateKey(accountID)) {
        errorAlert('Invalid Account ID');
        return;
    }

    const currentOrderInfo = order;

    const accountRef = db().collection('Accounts').doc(accountID);
    const currentOrderRef = accountRef.collection('Orders').doc(orderID);
    let futureLegacyDocument = accountRef.collection('LegacyOrders').doc()

    const createdDate = new Date()

    return db().runTransaction(transaction => transaction.get(currentOrderRef).then((currentOrderSnapshot) => {
        if (!currentOrderSnapshot.exists) {
            throw 'Order Does Not Exists';
        }

        transaction.set(futureLegacyDocument, currentOrderSnapshot.data())
        transaction.set(futureLegacyDocument, {'active': false, 'newOrderRef': currentOrderRef}, {merge: true})
        const oldDocRef = currentOrderSnapshot.data()['oldOrderRef']
        if (oldDocRef) {
            transaction.update(oldDocRef, {'newOrderRef': futureLegacyDocument})
        }
        currentOrderInfo.updatedDate = createdDate
        currentOrderInfo.oldOrderRef = futureLegacyDocument
        transaction.set(currentOrderRef, getOrderFromSnapshot(currentOrderInfo));

        return Promise.resolve({ currentOrderRef, currentOrderInfo });

    })).then((result) => {
        console.log('Transaction successfully committed!');
        xupplyAnalytic('update_order_success', null);
        dispatch(updateOrderSuccess(result.currentOrderInfo));
        successAlert('Update Order Success!');
        history.push(`/accounts/${accountID}/orders`)
    }).catch((error) => {
        console.log('Transaction failed: ', error.message || error);
        console.log(error.message || error);
        errorAlert(error.message || error);
        xupplyAnalytic('update_order_failure', null);
        dispatch(updateOrderFailure({
            response: {
                status: 403,
                statusText: error.message || error,
            },
        }));
    });
};
// [END Update Order]

// Approve Order
// TODO: None
// [START Approve Order]
export const approveOrderOrder = () => ({
    type: 'APPROVE_ORDER_ORDER',
});


export const approveOrderSuccess = order => ({
    type: 'APPROVE_ORDER_SUCCESS',
    payload: {
        order,
    },
});

export const approveOrderFailure = error => ({
    type: 'APPROVE_ORDER_FAILURE',
    payload: {
        status: error.response.status,
        statusText: error.response.statusText,
    },
});

export const approveOrder = (employeeID, accountID, order, redirectRoute) => (dispatch) => {
    dispatch(approveOrderOrder());
    const orderID = order.orderID;
    if (!validateKey(orderID)) {
        errorAlert('Invalid Order ID');
        dispatch(approveOrderFailure({
            response: {
                status: 403,
                statusText: 'Invalid Order ID',
            },
        }));
        return;
    }

    if (!validateKey(accountID)) {
        errorAlert('Invalid Account ID');
        return;
    }

    const currentOrderInfo = order;

    const requestID = order.request.requestID;
    const currentRequestRef = retailerRef.collection("Requests").doc(requestID);

    const retailerRef = db().collection('Accounts').doc(accountID);
    const currentRetailerOrderRef = retailerRef.collection('Orders').doc(orderID);

    const manuAccountID = order.status.events[0].accountID;
    const manuRef = db().collection("Accounts").doc(manuAccountID);
    const currentManuOrderRef = manuRef.collection('Orders').doc(orderID);

    let futureRetailerDocument = retailerRef.collection('LegacyOrders').doc();
    let futureManuDocument = manuRef.collection('LegacyOrders').doc();

    const createdDate = new Date()

    const approvedEvent = {
        'employeeID': employeeID,
        'accountID': accountID,
        'time': createdDate,
        'action': 'approved',
    }
    orderInfo.active = true;
    orderInfo.status.isStatus = 1;
    orderInfo.status.isStatusTime = createdDate;
    orderInfo.status.events.push(approvedEvent);

    // Update Request Orders
    orderInfo.items.forEach((item) => {
          const itemID = item.itemID;
          const dict = {};
          dict[newManuOrderRef.id] = orderInfo.stockPerItem[itemID];
          orderInfo.request.ordersPerItem[itemID] = dict;
    });

    return db().runTransaction(transaction => transaction.get(currentRetailerOrderRef).then((currentRetailerOrderSnapshot) => transaction.get(currentManuOrderRef).then((currentManuOrderSnapshot) => transaction.get(currentRequestRef).then((currentRequestSnapshot) => {

        // Update Manufacturer Order
        if (!currentRetailerOrderSnapshot.exists) {
            throw 'Retailer Order Does Not Exists';
        }

        transaction.set(futureRetailerDocument, currentRetailerOrderSnapshot.data())
        transaction.set(futureRetailerDocument, {'active': false, 'newOrderRef': currentRetailerOrderRef}, {merge: true})
        const oldRetailerDocRef = currentRetailerOrderSnapshot.data()['oldOrderRef']
        if (oldRetailerDocRef) {
            transaction.approve(oldRetailerDocRef, {'newOrderRef': futureRetailerDocument})
        }
        currentRetailerOrderInfo.updatedDate = createdDate
        currentRetailerOrderInfo.oldOrderRef = futureLegacyDocument
        transaction.set(currentRetailerOrderRef, parseOrder(currentRetailerOrderInfo));

        // Update Manufacturer Order
        if (!currentManuOrderSnapshot.exists) {
            throw 'Manu Order Does Not Exists';
        }

        transaction.set(futureManuDocument, currentManuOrderSnapshot.data())
        transaction.set(futureManuDocument, {'active': false, 'newOrderRef': currentManuOrderRef}, {merge: true})
        const oldManuDocRef = currentManuOrderSnapshot.data()['oldOrderRef']
        if (oldManuDocRef) {
            transaction.approve(oldManuDocRef, {'newOrderRef': futureManuDocument})
        }
        currentManuOrderInfo.updatedDate = createdDate
        currentManuOrderInfo.oldOrderRef = futureLegacyDocument
        transaction.set(currentManuOrderRef, parseOrder(currentManuOrderInfo));


        // Update Request
        if (!currentRequestSnapshot.exists) {
            throw 'Manu Order Does Not Exists';
        }

        transaction.update(currentRequestRef, parseRequest(orderInfo.request));

        return Promise.resolve({
            currentRetailerOrderRef,
            currentRetailerOrderInfo,
            currentManuOrderInfo,
            currentManuOrderInfo,
        });

    })).then((result) => {
        console.log('Transaction successfully committed!');
        xupplyAnalytic('approve_order_success', null);
        dispatch(approveOrderSuccess(result.currentOrderInfo));
        successAlert('Update Order Success!');
        history.push(`/accounts/${accountID}/orders`)
    }).catch((error) => {
        console.log('Transaction failed: ', error.message || error);
        console.log(error.message || error);
        errorAlert(error.message || error);
        xupplyAnalytic('approve_order_failure', null);
        dispatch(approveOrderFailure({
            response: {
                status: 403,
                statusText: error.message || error,
            },
        }));
    })));
};
// [END Update Order]

// Delete Order
// TODO: None
// [START Delete Order]
export const deleteOrderOrder = () => ({
    type: 'DELETE_ORDER_ORDER',
});


export const deleteOrderSuccess = order => ({
    type: 'DELETE_ORDER_SUCCESS',
    payload: {
        order,
    },
});

export const deleteOrderFailure = error => ({
    type: 'DELETE_ORDER_FAILURE',
    payload: {
        status: error.response.status,
        statusText: error.response.statusText,
    },
});

export const deleteOrder = (employeeID, accountID, order, redirectRoute) => (dispatch) => {

    dispatch(deleteOrderOrder());

    const orderID = order.orderID;
    if (!validateKey(orderID)) {
        errorAlert('Invalid Order ID');
        dispatch(deleteOrderFailure({
            response: {
                status: 403,
                statusText: 'Invalid Order ID',
            },
        }));
        return;
    }

    if (!validateKey(accountID)) {
        errorAlert('Invalid Account ID');
        return;
    }

    const accountRef = db().collection('Accounts').doc(accountID);
    const docRef = accountRef.collection('Orders').doc(orderID);

    const updatedDate = Date.now();
    docRef.update({ "active": false, "deleted": true, "updatedDate": updatedDate }).then(() => {
        dispatch(deleteOrderSuccess());
        history.push(`/accounts/${accountID}/orders`)
        errorAlert('Delete Menu Item Success');
        xupplyAnalytic('delete_order_success', null);
    }).catch((error) => {
        errorAlert(error.message || error);
        xupplyAnalytic('delete_order_failure', null);
        dispatch(deleteOrderFailure({
            response: {
                status: 400,
                statusText: error.message,
            },
        }));
    });
};
// [END Delete Order]
