import history from '../../history';
import { db } from '../../store/firebase';
import { parseJSON, formatFirestoreDateString, validateString, validateKey } from '../../utils/misc';
import { apiBulkUploadLocations } from '../../utils/http_functions';
import { toNewLocation, getLocationFromSnapshot } from './model';
import { errorAlert, successAlert } from '../../utils/alerts';
import { xupplyAnalytic } from '../../utils/analytics';

export const addLocation = location => ({
    type: 'ADD_LOCATION',
    ...location,
});

export const startFetchingLocations = () => ({
    type: 'START_FETCHING_LOCATIONS',
});

export const receivedLocations = () => ({
    type: 'RECEIVED_LOCATIONS',
    receivedAt: Date.now(),
});
export const receiveLocations = querySnapshot => (dispatch) => {
    if (querySnapshot) {
        querySnapshot.forEach((doc) => {
            const location = doc.data();
            location.locationID = doc.id;
            dispatch(addLocation(location));
        });
        dispatch(receivedLocations());
    }
};

export const fetchLocations = (employeeID, accountID) => (dispatch) => {
    dispatch(startFetchingLocations());
    db()
        .collection('Accounts')
        .doc(accountID)
        .collection('Locations')
        .onSnapshot((querySnapshot) => {
            setTimeout(() => {
                const locations = querySnapshot || [];
                dispatch(receiveLocations(locations));
            }, 0);
        }, (error) => {
            console.log(error);
        });
};

// Save New Location
//
// [START Save New Location]
export const saveNewLocationRequest = () => ({
    type: 'SAVE_NEW_LOCATION_REQUEST',
});


export const saveNewLocationSuccess = () => ({
    type: 'SAVE_NEW_LOCATION_SUCCESS',
});

export const saveNewLocationFailure = error => ({
    type: 'SAVE_NEW_LOCATION_FAILURE',
    payload: {
        status: error.response.status,
        statusText: error.response.statusText,
    },
});
export const saveNewLocation = (token, employeeID, accountID, location, redirectRoute) => (dispatch) => {
    dispatch(saveNewLocationRequest());

    const createdDate = new Date()

    const accountRef = db().collection("Accounts").doc(accountID)
    const newAccountLocationRef = accountRef.collection("Locations").doc()

    const locationInfo = location;
    locationInfo.active = true;
    locationInfo.deleted = false;
    locationInfo.createdDate = createdDate;
    locationInfo.locationID = newAccountLocationRef.id;

    console.warn(locationInfo);

    return db().runTransaction((transaction) => {
        transaction.set(newAccountLocationRef, getLocationFromSnapshot(locationInfo));
        return Promise.resolve(locationInfo);
    }).then((locationInfo) => {
        console.log("Transaction successfully committed!");
        dispatch(saveNewLocationSuccess());
        xupplyAnalytic('save_location_success', null);
        // dispatch(addLocation(location))
        // Analytics
        history.push(redirectRoute)
    }).catch((error) => {
        console.log("Transaction failed: ", error);
        xupplyAnalytic('save_location_failure', null);
        dispatch(saveNewLocationFailure({
            response: {
                status: 999,
                statusText: error.message,
            },
        }));
    });
};
// [END Save New Location]

// Update Location
// TODO: None
// [START Update Location]
export const updateLocationRequest = () => ({
    type: 'UPDATE_LOCATION_REQUEST',
});


export const updateLocationSuccess = location => ({
    type: 'UPDATE_LOCATION_SUCCESS',
    payload: {
        location,
    },
});

export const updateLocationFailure = error => ({
    type: 'UPDATE_LOCATION_FAILURE',
    payload: {
        status: error.response.status,
        statusText: error.response.statusText,
    },
});

export const updateLocation = (employeeID, accountID, location, redirectRoute) => (dispatch) => {
    dispatch(updateLocationRequest());
    const locationID = location.locationID;
    if (!validateKey(locationID)) {
        errorAlert('Invalid Location ID');
        dispatch(updateLocationFailure({
            response: {
                status: 403,
                statusText: 'Invalid Location ID',
            },
        }));
        return;
    }

    if (!validateKey(accountID)) {
        errorAlert('Invalid Account ID');
        return;
    }

    const currentLocationInfo = location;

    const accountRef = db().collection('Accounts').doc(accountID);
    const currentLocationRef = accountRef.collection('Locations').doc(locationID);
    let futureLegacyDocument = accountRef.collection('LegacyLocations').doc()

    const createdDate = new Date()

    return db().runTransaction(transaction => transaction.get(currentLocationRef).then((currentLocationSnapshot) => {
        if (!currentLocationSnapshot.exists) {
            throw 'Location Does Not Exists';
        }

        transaction.set(futureLegacyDocument, currentLocationSnapshot.data())
        transaction.set(futureLegacyDocument, {'active': false, 'newLocationRef': currentLocationRef}, {merge: true})
        const oldDocRef = currentLocationSnapshot.data()['oldLocationRef']
        if (oldDocRef) {
            transaction.update(oldDocRef, {'newLocationRef': futureLegacyDocument})
        }
        currentLocationInfo.updatedDate = createdDate
        currentLocationInfo.oldLocationRef = futureLegacyDocument
        transaction.set(currentLocationRef, getLocationFromSnapshot(currentLocationInfo));

        return Promise.resolve({ currentLocationRef, currentLocationInfo });

    })).then((result) => {
        console.log('Transaction successfully committed!');
        xupplyAnalytic('update_location_success', null);
        dispatch(updateLocationSuccess(result.currentLocationInfo));
        successAlert('Update Location Success!');
        history.push(`/accounts/${accountID}/locations`)
    }).catch((error) => {
        console.log('Transaction failed: ', error.message || error);
        console.log(error.message || error);
        errorAlert(error.message || error);
        xupplyAnalytic('update_location_failure', null);
        dispatch(updateLocationFailure({
            response: {
                status: 403,
                statusText: error.message || error,
            },
        }));
    });
};
// [END Update Location]

// Delete Location
// TODO: None
// [START Delete Location]
export const deleteLocationRequest = () => ({
    type: 'DELETE_LOCATION_REQUEST',
});


export const deleteLocationSuccess = location => ({
    type: 'DELETE_LOCATION_SUCCESS',
    payload: {
        location,
    },
});

export const deleteLocationFailure = error => ({
    type: 'DELETE_LOCATION_FAILURE',
    payload: {
        status: error.response.status,
        statusText: error.response.statusText,
    },
});

export const deleteLocation = (employeeID, accountID, location, redirectRoute) => (dispatch) => {

    dispatch(deleteLocationRequest());

    const locationID = location.locationID;
    if (!validateKey(locationID)) {
        errorAlert('Invalid Location ID');
        dispatch(updateLocationFailure({
            response: {
                status: 403,
                statusText: 'Invalid Location ID',
            },
        }));
        return;
    }

    if (!validateKey(accountID)) {
        errorAlert('Invalid Account ID');
        return;
    }

    const accountRef = db().collection('Accounts').doc(accountID);
    const docRef = accountRef.collection('Locations').doc(locationID);

    const updatedDate = Date.now();
    docRef.update({ "active": false, "deleted": true, "updatedDate": updatedDate }).then(() => {
        dispatch(deleteLocationSuccess());
        history.push(`/accounts/${accountID}/locations`)
        errorAlert('Delete Location Success');
        xupplyAnalytic('delete_location_success');
    }).catch((error) => {
        errorAlert(error.message);
        xupplyAnalytic('delete_location_failure');
        dispatch(deleteLocationFailure({
            response: {
                status: 400,
                statusText: error.message,
            },
        }));
    });
};
// [END Delete Location]
