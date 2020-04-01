import history from '../../history';
import { db } from '../../store/firebase';
import { parseJSON, formatFirestoreDateString, validateString, validateKey } from '../../utils/misc';
import { apiBulkUploadOpportunities } from '../../utils/http_functions';
import { toNewOpportunity, getOpportunityFromSnapshot } from './model';
import { errorAlert, successAlert } from '../../utils/alerts';
import { xupplyAnalytic } from '../../utils/analytics';

export const addOpportunity = opportunity => ({
    type: 'ADD_OPPORTUNITY',
    ...opportunity,
});

export const startFetchingOpportunities = () => ({
    type: 'START_FETCHING_OPPORTUNITIES',
});

export const receivedOpportunities = () => ({
    type: 'RECEIVED_OPPORTUNITIES',
    receivedAt: Date.now(),
});
export const receiveOpportunities = querySnapshot => (dispatch) => {
    if (querySnapshot) {
        querySnapshot.forEach((doc) => {
            const opportunity = doc.data();
            opportunity.opportunityID = doc.id;
            dispatch(addOpportunity(opportunity));
        });
        dispatch(receivedOpportunities());
    }
};

export const fetchOpportunities = (employeeID, accountID) => (dispatch) => {
    dispatch(startFetchingOpportunities());
    db()
        .collection('Accounts')
        .doc(accountID)
        .collection('Opportunities')
        .onSnapshot((querySnapshot) => {
            setTimeout(() => {
                const opportunities = querySnapshot || [];
                dispatch(receiveOpportunities(opportunities));
            }, 0);
        }, (error) => {
            console.log(error);
        });
};

// Save New Opportunity
//
// [START Save New Opportunity]
export const saveNewOpportunityOpportunity = () => ({
    type: 'SAVE_NEW_OPPORTUNITY_OPPORTUNITY',
});


export const saveNewOpportunitySuccess = () => ({
    type: 'SAVE_NEW_OPPORTUNITY_SUCCESS',
});

export const saveNewOpportunityFailure = error => ({
    type: 'SAVE_NEW_OPPORTUNITY_FAILURE',
    payload: {
        status: error.response.status,
        statusText: error.response.statusText,
    },
});
export const saveNewOpportunity = (token, employeeID, accountID, opportunity, redirectRoute) => (dispatch) => {
    dispatch(saveNewOpportunityOpportunity());

    const createdDate = new Date()

    const accountRef = db().collection("Accounts").doc(accountID)
    const newAccountOpportunityRef = accountRef.collection("Opportunities").doc()

    const opportunityInfo = opportunity;
    const newEvent = {
        'employeeID': employeeID,
        'accountID': accountID,
        'time': createdDate,
        'action': 'created',
    }
    opportunityInfo.active = true;
    opportunityInfo.deleted = false;
    opportunityInfo.status.isStatus = 1;
    opportunityInfo.status.isStatusTime = createdDate;
    opportunityInfo.status.events = newEvent;
    opportunityInfo.opportunityID = newAccountOpportunityRef.id;

    return db().runTransaction((transaction) => {
        transaction.set(newAccountOpportunityRef, getOpportunityFromSnapshot(opportunityInfo));
        return Promise.resolve(opportunityInfo);
    }).then((opportunityInfo) => {
        console.log("Transaction successfully committed!");
        dispatch(saveNewOpportunitySuccess());
        xupplyAnalytic('save_opportunity_success');
        // dispatch(addOpportunity(opportunity))
        history.push(redirectRoute)
    }).catch((error) => {
        console.log("Transaction failed: ", error);
        xupplyAnalytic('save_opportunity_failure');
        dispatch(saveNewOpportunityFailure({
            response: {
                status: 999,
                statusText: error.message,
            },
        }));
    });
};
// [END Save New Opportunity]

// Update Opportunity
// TODO: None
// [START Update Opportunity]
export const updateOpportunityOpportunity = () => ({
    type: 'UPDATE_OPPORTUNITY_OPPORTUNITY',
});


export const updateOpportunitySuccess = opportunity => ({
    type: 'UPDATE_OPPORTUNITY_SUCCESS',
    payload: {
        opportunity,
    },
});

export const updateOpportunityFailure = error => ({
    type: 'UPDATE_OPPORTUNITY_FAILURE',
    payload: {
        status: error.response.status,
        statusText: error.response.statusText,
    },
});

export const updateOpportunity = (employeeID, accountID, opportunity, redirectRoute) => (dispatch) => {
    dispatch(updateOpportunityOpportunity());
    const opportunityID = opportunity.opportunityID;
    if (!validateKey(opportunityID)) {
        errorAlert('Invalid Opportunity ID');
        dispatch(updateOpportunityFailure({
            response: {
                status: 403,
                statusText: 'Invalid Opportunity ID',
            },
        }));
        return;
    }

    if (!validateKey(accountID)) {
        errorAlert('Invalid Account ID');
        return;
    }

    const currentOpportunityInfo = opportunity;

    const accountRef = db().collection('Accounts').doc(accountID);
    const currentOpportunityRef = accountRef.collection('Opportunities').doc(opportunityID);
    let futureLegacyDocument = accountRef.collection('LegacyOpportunities').doc()

    const createdDate = new Date()

    return db().runTransaction(transaction => transaction.get(currentOpportunityRef).then((currentOpportunitySnapshot) => {
        if (!currentOpportunitySnapshot.exists) {
            throw 'Opportunity Does Not Exists';
        }

        transaction.set(futureLegacyDocument, currentOpportunitySnapshot.data())
        transaction.set(futureLegacyDocument, {'active': false, 'newOpportunityRef': currentOpportunityRef}, {merge: true})
        const oldDocRef = currentOpportunitySnapshot.data()['oldOpportunityRef']
        if (oldDocRef) {
            transaction.update(oldDocRef, {'newOpportunityRef': futureLegacyDocument})
        }
        currentOpportunityInfo.updatedDate = createdDate
        currentOpportunityInfo.oldOpportunityRef = futureLegacyDocument
        transaction.set(currentOpportunityRef, getOpportunityFromSnapshot(currentOpportunityInfo));

        return Promise.resolve({ currentOpportunityRef, currentOpportunityInfo });

    })).then((result) => {
        console.log('Transaction successfully committed!');
        xupplyAnalytic('update_opportunity_success', null);
        dispatch(updateOpportunitySuccess(result.currentOpportunityInfo));
        successAlert('Update Opportunity Success!');
        history.push(`/accounts/${accountID}/opportunities`)
    }).catch((error) => {
        console.log('Transaction failed: ', error.message || error);
        console.log(error.message || error);
        errorAlert(error.message || error);
        xupplyAnalytic('update_opportunity_failure', null);
        dispatch(updateOpportunityFailure({
            response: {
                status: 403,
                statusText: error.message || error,
            },
        }));
    });
};
// [END Update Opportunity]

// Delete Opportunity
// TODO: None
// [START Delete Opportunity]
export const deleteOpportunityOpportunity = () => ({
    type: 'DELETE_OPPORTUNITY_OPPORTUNITY',
});


export const deleteOpportunitySuccess = opportunity => ({
    type: 'DELETE_OPPORTUNITY_SUCCESS',
    payload: {
        opportunity,
    },
});

export const deleteOpportunityFailure = error => ({
    type: 'DELETE_OPPORTUNITY_FAILURE',
    payload: {
        status: error.response.status,
        statusText: error.response.statusText,
    },
});

export const deleteOpportunity = (employeeID, accountID, opportunity, redirectRoute) => (dispatch) => {

    dispatch(deleteOpportunityOpportunity());

    const opportunityID = opportunity.opportunityID;
    if (!validateKey(opportunityID)) {
        errorAlert('Invalid Opportunity ID');
        dispatch(updateOpportunityFailure({
            response: {
                status: 403,
                statusText: 'Invalid Opportunity ID',
            },
        }));
        return;
    }

    if (!validateKey(accountID)) {
        errorAlert('Invalid Account ID');
        return;
    }

    const accountRef = db().collection('Accounts').doc(accountID);
    const docRef = accountRef.collection('Opportunities').doc(opportunityID);

    const updatedDate = Date.now();
    docRef.update({ "active": false, "deleted": true, "updatedDate": updatedDate }).then(() => {
        dispatch(deleteOpportunitySuccess());
        history.push(`/accounts/${accountID}/opportunities`)
        errorAlert('Delete Menu Item Success');
        xupplyAnalytic('delete_opportunity_success', null);
    }).catch((error) => {
        errorAlert(error.message || error);
        xupplyAnalytic('delete_opportunity_failure', null);
        dispatch(deleteOpportunityFailure({
            response: {
                status: 400,
                statusText: error.message,
            },
        }));
    });
};
// [END Delete Opportunity]
