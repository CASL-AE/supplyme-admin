import history from '../../history';
import { db } from '../../store/firebase';
import { parseJSON, formatFirestoreDateString, validateString, validateKey } from '../../utils/misc';
import { apiBulkUploadRequests } from '../../utils/http_functions';
import { toNewRequest, getRequestFromSnapshot } from './model';
import { errorAlert, successAlert } from '../../utils/alerts';
import { supplyMeAnalytic } from '../../utils/analytics';

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
        .collection('Accounts')
        .doc(accountID)
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

export const addPublicRequest = request => ({
    type: 'ADD_PUBLIC_REQUEST',
    ...request,
});

export const startFetchingPublicRequests = () => ({
    type: 'START_FETCHING_PUBLIC_REQUESTS',
});

export const receivedPublicRequests = () => ({
    type: 'RECEIVED_PUBLIC_REQUESTS',
    receivedAt: Date.now(),
});
export const receivePublicRequests = querySnapshot => (dispatch) => {
    if (querySnapshot) {
        querySnapshot.forEach((doc) => {
            const request = doc.data();
            request.requestID = doc.id;
            dispatch(addPublicRequest(request));
        });
        dispatch(receivedPublicRequests());
    }
};

export const fetchPublicRequests = () => (dispatch) => {
    dispatch(startFetchingPublicRequests());
    db().collection('Requests').onSnapshot((querySnapshot) => {
        setTimeout(() => {
            const requests = querySnapshot || [];
            dispatch(receivePublicRequests(requests));
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

    const createdDate = new Date()

    const accountRef = db().collection("Accounts").doc(accountID)
    const newAccountRequestRef = accountRef.collection("Requests").doc()
    const newRequestRef = db().collection("Requests").doc(newAccountRequestRef.id)

    const requestInfo = request;
    const newEvent = {
        'employeeID': employeeID,
        'accountID': accountID,
        'time': createdDate,
        'action': 'created',
    }
    requestInfo.active = true;
    requestInfo.deleted = false;
    requestInfo.status.isStatus = 1;
    requestInfo.status.isStatusTime = createdDate;
    requestInfo.status.events = newEvent;
    requestInfo.requestID = newAccountRequestRef.id;

    return db().runTransaction((transaction) => {
        transaction.set(newAccountRequestRef, getRequestFromSnapshot(requestInfo));
        if (!requestInfo.private) {
            transaction.set(newRequestRef, getRequestFromSnapshot(requestInfo));
        }
        return Promise.resolve(requestInfo);
    }).then((requestInfo) => {
        console.log("Transaction successfully committed!");
        dispatch(saveNewRequestSuccess());
        // dispatch(addRequest(request))
        // Analytics
        history.push(redirectRoute)
    }).catch((error) => {
        console.log("Transaction failed: ", error);
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
        // supplyMeAnalytic('update_request_success', null);
        dispatch(updateRequestSuccess(result.currentRequestInfo));
        successAlert('Update Request Success!');
        history.push(`/accounts/${accountID}/requests`)
    }).catch((error) => {
        console.log('Transaction failed: ', error.message || error);
        console.log(error.message || error);
        errorAlert(error.message || error);
        // supplyMeAnalytic('update_request_failure', null);
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
        // errorAlert(200, 'Delete Menu Item Success');
        // supplyMeAnalytic(employeeID, 'request', 'deleteRequestSuccess');
    }).catch((error) => {
        // errorAlert(400, error.message || error);
        // supplyMeAnalytic(employeeID, 'request', 'deleteRequestFailure');
        dispatch(deleteRequestFailure({
            response: {
                status: 400,
                statusText: error.message,
            },
        }));
    });
};
// [END Delete Request]
