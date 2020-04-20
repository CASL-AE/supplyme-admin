import history from '../../history';
import { db, storage } from '../../store/firebase';
import { parseJSON, formatFirestoreDateString, validateString, validateKey } from '../../utils/misc';
import { apiBulkUploadMenuItems } from '../../utils/http_functions';
import { toNewMenuItem, getMenuItemFromSnapshot, getPublicMenuItemFromSnapshot } from './model';
import { errorAlert, successAlert } from '../../utils/alerts';
import { xupplyAnalytic } from '../../utils/analytics';

export const addMenuItem = menuItem => ({
    type: 'ADD_MENUITEM',
    ...menuItem,
});

export const startFetchingMenuItems = () => ({
    type: 'START_FETCHING_MENUITEMS',
});

export const receivedMenuItems = () => ({
    type: 'RECEIVED_MENUITEMS',
    receivedAt: Date.now(),
});
export const receiveMenuItems = querySnapshot => (dispatch) => {
    if (querySnapshot) {
        querySnapshot.forEach((doc) => {
            const menuItem = doc.data();
            menuItem.itemID = doc.id;
            dispatch(addMenuItem(menuItem));
        });
        dispatch(receivedMenuItems());
    }
};

export const fetchMenuItems = (employeeID, accountID) => (dispatch) => {
    console.log(employeeID)
    console.log(accountID)
    dispatch(startFetchingMenuItems());
    db()
        .collection('Accounts')
        .doc(accountID)
        .collection('MenuItems')
        .onSnapshot((querySnapshot) => {
            setTimeout(() => {
                const menuItems = querySnapshot || [];
                dispatch(receiveMenuItems(menuItems));
            }, 0);
        }, (error) => {
            console.log(error);
        });
};

export const addPublicMenuItem = menuItem => ({
    type: 'ADD_PUBLIC_MENUITEM',
    ...menuItem,
});

export const startFetchingPublicMenuItems = () => ({
    type: 'START_FETCHING_PUBLIC_MENUITEMS',
});

export const receivedPublicMenuItems = () => ({
    type: 'RECEIVED_PUBLIC_MENUITEMS',
    receivedAt: Date.now(),
});
export const receivePublicMenuItems = querySnapshot => (dispatch) => {
    if (querySnapshot) {
        querySnapshot.forEach((doc) => {
            const menuItem = doc.data();
            menuItem.itemID = doc.id;
            dispatch(addPublicMenuItem(menuItem));
        });
        dispatch(receivedPublicMenuItems());
    }
};

export const fetchPublicMenuItems = (employeeID, accountID) => (dispatch) => {
    dispatch(startFetchingPublicMenuItems());
    db().collection('MenuItems').onSnapshot((querySnapshot) => {
        setTimeout(() => {
            const menuItems = querySnapshot || [];
            dispatch(receivePublicMenuItems(menuItems));
        }, 0);
    }, (error) => {
        console.log(error);
    });
};

export const saveMenuItemMedia = (image, ref) => {
    const metadata = {
        contentType: image.type,
    };
    return new Promise((resolve, reject) => {
        const uploadTask = ref.put(image, metadata);
        uploadTask.on('state_changed', (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log(`Upload is ${progress}% done`);
            switch (snapshot.state) {
            case 'paused':
                console.log('Upload is paused');
                break;
            case 'running':
                console.log('Upload is running');
                break;
            default:
                console.log('default');
            }
        }, (error) => {
            switch (error.code) {
            case 'storage/unauthorized':
                console.log('User doesnt have permission to access the object');
                reject('User doesnt have permission to access the object');
                break;

            case 'storage/canceled':
                console.log('User canceled the upload');
                reject('User canceled the upload');
                break;

            case 'storage/unknown':
                console.log('Unknown error occurred, inspect error.serverResponse');
                reject();
                break;
            default:
                console.log('Default Error');

            }
        }, () => {
            uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                console.log('File available at', downloadURL);
                resolve(downloadURL);
            });
        });
    });
};


// Save New MenuItem
//
// [START Save New MenuItem]
export const saveNewMenuItemRequest = () => ({
    type: 'SAVE_NEW_MENUITEM_REQUEST',
});


export const saveNewMenuItemSuccess = () => ({
    type: 'SAVE_NEW_MENUITEM_SUCCESS',
});

export const saveNewMenuItemFailure = error => ({
    type: 'SAVE_NEW_MENUITEM_FAILURE',
    payload: {
        status: error.response.status,
        statusText: error.response.statusText,
    },
});
export const saveNewMenuItem = (token, employeeID, accountID, menuItem, redirectRoute) => async (dispatch) => {
    dispatch(saveNewMenuItemRequest());

    const createdDate = new Date();

    const accountRef = db().collection("Accounts").doc(accountID)
    const newAccountMenuItemRef = accountRef.collection("MenuItems").doc()
    const newMenuItemRef = db().collection("MenuItems").doc(newAccountMenuItemRef.id)

    const menuItemInfo = menuItem;
    menuItemInfo.active = true;
    menuItemInfo.deleted = false;
    menuItemInfo.createdDate = createdDate;
    menuItemInfo.itemID = newAccountMenuItemRef.id;

    console.warn(menuItemInfo);

    const storageRef = storage().ref();
    const imgRef = storageRef.child(accountID + "/itemImage/" + menuItemInfo.itemID + ".png");

    if (menuItem.imageData !== null) {
      console.warn('MenuItem ID Image Found!! Saving...')
      const downloadURL = await saveMenuItemMedia(menuItem.imageData, imgRef);
      console.log(downloadURL)
      if (downloadURL !== null) {
          console.log(downloadURL)
          menuItemInfo.fullSizeItemImageURL = downloadURL;
          menuItemInfo.thumbItemImageURL = downloadURL;
      }
    }

    return db().runTransaction((transaction) => {
        transaction.set(newAccountMenuItemRef, getMenuItemFromSnapshot(menuItemInfo));
        if (!menuItemInfo.private) {
            transaction.set(newMenuItemRef, getPublicMenuItemFromSnapshot(menuItemInfo));
        }
        return Promise.resolve(menuItemInfo);
    }).then((menuItemInfo) => {
        console.log("Transaction successfully committed!");
        dispatch(saveNewMenuItemSuccess());
        // dispatch(addMenuItem(menuItem))
        xupplyAnalytic('save_menu_item_success');
        history.push(redirectRoute)
    }).catch((error) => {
        console.log("Transaction failed: ", error);
        xupplyAnalytic('save_menu_item_failure');
        dispatch(saveNewMenuItemFailure({
            response: {
                status: 999,
                statusText: error.message,
            },
        }));
    });
};
// [END Save New MenuItem]

// Save Beta MenuItem
// TODO: None
// [START Save Beta MenuItem]
export const saveBetaMenuItemRequest = () => ({
    type: 'SAVE_NEW_MENUITEM_MENUITEM',
});


export const saveBetaMenuItemSuccess = () => ({
    type: 'SAVE_NEW_MENUITEM_SUCCESS',
});

export const saveBetaMenuItemFailure = error => ({
    type: 'SAVE_NEW_MENUITEM_FAILURE',
    payload: {
        status: error.response.status,
        statusText: error.response.statusText,
    },
});
export const saveBetaMenuItem = (token, employeeID, accountID, menuItems, redirectRoute) => async (dispatch) => {
    dispatch(saveBetaMenuItemRequest());

    var batch = db().batch();

    const createdDate = new Date();

    const accountRef = db().collection("Accounts").doc(accountID);

    menuItems.forEach((menuItem) => {
          const newAccountMenuItemRef = accountRef.collection("MenuItems").doc(menuItem.itemID);
          const menuItemInfo = menuItem;
          menuItemInfo.active = true;
          menuItemInfo.deleted = false;
          menuItemInfo.createdDate = createdDate;
          batch.set(newAccountMenuItemRef, getMenuItemFromSnapshot(menuItemInfo));
    });

    return batch.commit().then(() => {
        console.log("Batch successfully committed!");
        dispatch(saveBetaMenuItemSuccess());
        // dispatch(addMenuItem(menuItem))
        xupplyAnalytic('beta_menu_items_success');
        history.push(redirectRoute)
    }).catch((error) => {
        console.log("Batch failed: ", error);
        xupplyAnalytic('beta_menu_items_failure');
        dispatch(saveBetaMenuItemFailure({
            response: {
                status: 999,
                statusText: error.message,
            },
        }));
    });
};
// [END Save Beta MenuItem]

// Update MenuItem
// TODO: None
// [START Update MenuItem]
export const updateMenuItemRequest = () => ({
    type: 'UPDATE_MENUITEM_REQUEST',
});


export const updateMenuItemSuccess = menuItem => ({
    type: 'UPDATE_MENUITEM_SUCCESS',
    payload: {
        menuItem,
    },
});

export const updateMenuItemFailure = error => ({
    type: 'UPDATE_MENUITEM_FAILURE',
    payload: {
        status: error.response.status,
        statusText: error.response.statusText,
    },
});

export const updateMenuItem = (employeeID, accountID, menuItem, redirectRoute) => (dispatch) => {
    dispatch(updateMenuItemRequest());
    const menuItemID = menuItem.menuItemID;
    if (!validateKey(menuItemID)) {
        errorAlert('Invalid MenuItem ID');
        dispatch(updateMenuItemFailure({
            response: {
                status: 403,
                statusText: 'Invalid MenuItem ID',
            },
        }));
        return;
    }

    if (!validateKey(accountID)) {
        errorAlert('Invalid Account ID');
        return;
    }

    const currentMenuItemInfo = menuItem;

    const accountRef = db().collection('Accounts').doc(accountID);
    const currentMenuItemRef = accountRef.collection('MenuItems').doc(menuItemID);
    let futureLegacyDocument = accountRef.collection('LegacyMenuItems').doc()

    const createdDate = new Date()

    return db().runTransaction(transaction => transaction.get(currentMenuItemRef).then((currentMenuItemSnapshot) => {
        if (!currentMenuItemSnapshot.exists) {
            throw 'MenuItem Does Not Exists';
        }

        transaction.set(futureLegacyDocument, currentMenuItemSnapshot.data())
        transaction.set(futureLegacyDocument, {'active': false, 'newMenuItemRef': currentMenuItemRef}, {merge: true})
        const oldDocRef = currentMenuItemSnapshot.data()['oldMenuItemRef']
        if (oldDocRef) {
            transaction.update(oldDocRef, {'newMenuItemRef': futureLegacyDocument})
        }
        currentMenuItemInfo.updatedDate = createdDate
        currentMenuItemInfo.oldMenuItemRef = futureLegacyDocument
        transaction.set(currentMenuItemRef, getMenuItemFromSnapshot(currentMenuItemInfo));

        return Promise.resolve({ currentMenuItemRef, currentMenuItemInfo });

    })).then((result) => {
        console.log('Transaction successfully committed!');
        xupplyAnalytic('update_menu_item_success', null);
        dispatch(updateMenuItemSuccess(result.currentMenuItemInfo));
        successAlert('Update MenuItem Success!');
        history.push(`/accounts/${accountID}/menuItems`)
    }).catch((error) => {
        console.log('Transaction failed: ', error.message || error);
        console.log(error.message || error);
        errorAlert(error.message || error);
        xupplyAnalytic('update_menu_item_failure', null);
        dispatch(updateMenuItemFailure({
            response: {
                status: 403,
                statusText: error.message || error,
            },
        }));
    });
};
// [END Update MenuItem]

// Delete MenuItem
// TODO: None
// [START Delete MenuItem]
export const deleteMenuItemRequest = () => ({
    type: 'DELETE_MENUITEM_REQUEST',
});


export const deleteMenuItemSuccess = menuItem => ({
    type: 'DELETE_MENUITEM_SUCCESS',
    payload: {
        menuItem,
    },
});

export const deleteMenuItemFailure = error => ({
    type: 'DELETE_MENUITEM_FAILURE',
    payload: {
        status: error.response.status,
        statusText: error.response.statusText,
    },
});

export const deleteMenuItem = (employeeID, accountID, menuItem, redirectRoute) => (dispatch) => {

    dispatch(deleteMenuItemRequest());

    const itemID = menuItem.itemID;
    if (!validateKey(itemID)) {
        errorAlert('Invalid menu item ID');
        dispatch(updateMenuItemFailure({
            response: {
                status: 403,
                statusText: 'Invalid MenuItem ID',
            },
        }));
        return;
    }

    if (!validateKey(accountID)) {
        errorAlert('Invalid Account ID');
        return;
    }

    const accountRef = db().collection('Accounts').doc(accountID);
    const docRef = accountRef.collection('MenuItems').doc(itemID);

    const updatedDate = Date.now();
    docRef.update({ "active": false, "deleted": true, "updatedDate": updatedDate }).then(() => {
        dispatch(deleteMenuItemSuccess());
        history.push(`/accounts/${accountID}/menuItems`)
        errorAlert('Delete Menu Item Success');
        xupplyAnalytic('delete_menu_item_success');
    }).catch((error) => {
        errorAlert(error.message || error);
        xupplyAnalytic('delete_menu_item_failure');
        dispatch(deleteMenuItemFailure({
            response: {
                status: 400,
                statusText: error.message,
            },
        }));
    });
};
// [END Delete MenuItem]
