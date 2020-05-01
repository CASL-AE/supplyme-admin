import history from '../../history';
import { db } from '../../store/firebase';
import { parseJSON, formatFirestoreDateString, validateString, validateKey } from '../../utils/misc';
import { apiBulkUploadRequests } from '../../utils/http_functions';
import { toNewRequest, parseRequest } from './model';
import { errorAlert, successAlert } from '../../utils/alerts';
import { xupplyAnalytic } from '../../utils/analytics';

export const addRequest = request => ({
    type: 'ADD_REQUEST',
    ...request,
});

export const startFetchingRequests = () => ({
    type: 'START_FETCHING_REQUESTS',
});

export const receivedRequests = () => ({
    type: 'RECEIVED_REQUESTS',
    receivedAt: Date.now(),
});
export const receiveRequests = querySnapshot => (dispatch) => {
    if (querySnapshot) {
        querySnapshot.forEach((doc) => {
            const request = doc.data();
            request.requestID = doc.id;
            dispatch(addRequest(request));
        });
        dispatch(receivedRequests());
    }
};

export const fetchRequests = (employeeID, accountID) => (dispatch) => {
    dispatch(startFetchingRequests());
    db()
        .collection('Requests')
        .onSnapshot((querySnapshot) => {
            setTimeout(() => {
                const requests = querySnapshot || [];
                dispatch(receiveRequests(requests));
            }, 0);
        }, (error) => {
            console.log(error);
        });
};

// Save New Request
//
// [START Save New Request]
export const saveNewRequestRequest = () => ({
    type: 'SAVE_NEW_REQUEST_REQUEST',
});


export const saveNewRequestSuccess = () => ({
    type: 'SAVE_NEW_REQUEST_SUCCESS',
});

export const saveNewRequestFailure = error => ({
    type: 'SAVE_NEW_REQUEST_FAILURE',
    payload: {
        status: error.response.status,
        statusText: error.response.statusText,
    },
});
export const saveNewRequest = (token, employeeID, accountID, request, redirectRoute) => (dispatch) => {
    dispatch(saveNewRequestRequest());

    const createdDate = new Date();

    const accountRef = db().collection("Accounts").doc(accountID);
    const newRequestRef = db().collection("Requests").doc();

    const requestInfo = request;
    const newEvent = {
        'employeeID': employeeID,
        'accountID': accountID,
        'time': createdDate,
        'action': 'created',
    }
    requestInfo.active = true;
    requestInfo.deleted = false;
    requestInfo.status.isStatus = 0;
    requestInfo.status.isStatusTime = createdDate;
    requestInfo.status.events = [newEvent];
    requestInfo.requestID = newRequestRef.id;

    return db().runTransaction((transaction) => {
        transaction.set(newRequestRef, parseRequest(requestInfo));
        return Promise.resolve(requestInfo);
    }).then((requestInfo) => {
        console.log("Transaction successfully committed!");
        dispatch(saveNewRequestSuccess());
        xupplyAnalytic('save_request_success', null);
        history.push(redirectRoute)
    }).catch((error) => {
        console.log("Transaction failed: ", error);
        xupplyAnalytic('save_request_failure', null);
        dispatch(saveNewRequestFailure({
            response: {
                status: 999,
                statusText: error.message,
            },
        }));
    });
};
// [END Save New Request]

// Update Request
// TODO: None
// [START Update Request]
export const updateRequestRequest = () => ({
    type: 'UPDATE_REQUEST_REQUEST',
});


export const updateRequestSuccess = request => ({
    type: 'UPDATE_REQUEST_SUCCESS',
    payload: {
        request,
    },
});

export const updateRequestFailure = error => ({
    type: 'UPDATE_REQUEST_FAILURE',
    payload: {
        status: error.response.status,
        statusText: error.response.statusText,
    },
});

export const updateRequest = (employeeID, accountID, request, redirectRoute) => (dispatch) => {
    dispatch(updateRequestRequest());
    const requestID = request.requestID;
    if (!validateKey(requestID)) {
        errorAlert('Invalid Request ID');
        dispatch(updateRequestFailure({
            response: {
                status: 403,
                statusText: 'Invalid Request ID',
            },
        }));
        return;
    }

    if (!validateKey(accountID)) {
        errorAlert('Invalid Account ID');
        return;
    }

    const currentRequestInfo = request;

    const accountRef = db().collection('Accounts').doc(accountID);
    const currentRequestRef = accountRef.collection('Requests').doc(requestID);
    let futureLegacyDocument = accountRef.collection('LegacyRequests').doc()

    const createdDate = new Date()

    return db().runTransaction(transaction => transaction.get(currentRequestRef).then((currentRequestSnapshot) => {
        if (!currentRequestSnapshot.exists) {
            throw 'Request Does Not Exists';
        }

        transaction.set(futureLegacyDocument, currentRequestSnapshot.data())
        transaction.set(futureLegacyDocument, {'active': false, 'newRequestRef': currentRequestRef}, {merge: true})
        const oldDocRef = currentRequestSnapshot.data()['oldRequestRef']
        if (oldDocRef) {
            transaction.update(oldDocRef, {'newRequestRef': futureLegacyDocument})
        }
        currentRequestInfo.updatedDate = createdDate
        currentRequestInfo.oldRequestRef = futureLegacyDocument
        transaction.set(currentRequestRef, getRequestFromSnapshot(currentRequestInfo));

        return Promise.resolve({ currentRequestRef, currentRequestInfo });

    })).then((result) => {
        console.log('Transaction successfully committed!');
        xupplyAnalytic('update_request_success', null);
        dispatch(updateRequestSuccess(result.currentRequestInfo));
        successAlert('Update Request Success!');
        history.push(`/accounts/${accountID}/requests`)
    }).catch((error) => {
        console.log('Transaction failed: ', error.message || error);
        console.log(error.message || error);
        errorAlert(error.message || error);
        xupplyAnalytic('update_request_failure', null);
        dispatch(updateRequestFailure({
            response: {
                status: 403,
                statusText: error.message || error,
            },
        }));
    });
};
// [END Update Request]

// Delete Request
// TODO: None
// [START Delete Request]
export const deleteRequestRequest = () => ({
    type: 'DELETE_REQUEST_REQUEST',
});


export const deleteRequestSuccess = request => ({
    type: 'DELETE_REQUEST_SUCCESS',
    payload: {
        request,
    },
});

export const deleteRequestFailure = error => ({
    type: 'DELETE_REQUEST_FAILURE',
    payload: {
        status: error.response.status,
        statusText: error.response.statusText,
    },
});

export const deleteRequest = (employeeID, accountID, request, redirectRoute) => (dispatch) => {

    dispatch(deleteRequestRequest());

    const requestID = request.requestID;
    if (!validateKey(requestID)) {
        errorAlert('Invalid Request ID');
        dispatch(updateRequestFailure({
            response: {
                status: 403,
                statusText: 'Invalid Request ID',
            },
        }));
        return;
    }

    if (!validateKey(accountID)) {
        errorAlert('Invalid Account ID');
        return;
    }

    const accountRef = db().collection('Accounts').doc(accountID);
    const docRef = accountRef.collection('Requests').doc(requestID);

    const updatedDate = Date.now();
    docRef.update({ "active": false, "deleted": true, "updatedDate": updatedDate }).then(() => {
        dispatch(deleteRequestSuccess());
        history.push(`/accounts/${accountID}/requests`)
        errorAlert('Delete Menu Item Success');
        xupplyAnalytic('delete_request_failure', null);
    }).catch((error) => {
        errorAlert(error.message || error);
        xupplyAnalytic('delete_request_failure', null);
        dispatch(deleteRequestFailure({
            response: {
                status: 400,
                statusText: error.message,
            },
        }));
    });
};
// [END Delete Request]
