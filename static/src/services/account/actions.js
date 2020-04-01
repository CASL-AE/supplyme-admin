import history from '../../history';
import { db } from '../../store/firebase';
import { errorAlert, successAlert } from '../../utils/alerts';
import { xupplyAnalytic } from '../../utils/analytics';
import {
  parseJSON,
  validateKey,
  validateString,
  validatePhone,
  validateAddress,
  validateMerchants,
} from '../../utils/misc';
import {
  apiActivateAccountCode,
  apiMigrateAccountSmartBnB,
} from '../../utils/http_functions';

import { getAccountFromSnapshot } from './model';

export const addAccount = account => ({
    type: 'ADD_ACCOUNT',
    ...account,
});

export const startFetchingAccounts = () => ({
    type: 'START_FETCHING_ACCOUNTS',
});

export const receivedAccounts = () => ({
    type: 'RECEIVED_ACCOUNTS',
    receivedAt: Date.now(),
});
export const receiveAccounts = querySnapshot => function (dispatch) {
    if (querySnapshot) {
        querySnapshot.forEach((doc) => {
            const account = doc.data();
            account.accountID = doc.id;
            dispatch(addAccount(account));
        });
        dispatch(receivedAccounts());
    }
};

export const fetchAccounts = () => function (dispatch) {
    dispatch(startFetchingAccounts());
    db()
        .collection('Accounts')
        .onSnapshot((querySnapshot) => {
            setTimeout(() => {
                const accounts = querySnapshot || [];
                dispatch(receiveAccounts(accounts));
            }, 0);
        }, (error) => {
            console.log(error);
        });
};

// Get Account Data
//
// [START Get Account Data]
export const getAccountRequest = () => ({
    type: 'FETCH_ACCOUNT_REQUEST',
});


export const getAccountSuccess = (account) => ({
    type: 'RECEIVE_ACCOUNT_SUCCESS',
    payload: {
        account,
    },
});

export const getAccountFailure = error => ({
    type: 'RECEIVE_ACCOUNT_FAILURE',
    payload: {
        status: error.response.status,
        statusText: error.response.statusText,
    },
});
export const getAccount = accountId => (dispatch) => {
    dispatch(getAccountRequest());
    const accountRef = db().collection('Accounts').doc(accountId);
    accountRef.onSnapshot((doc) => {
        if (doc.exists) {
            console.log('Document data:', doc.data());
            const account = doc.data();
            account.accountID = doc.id;
            dispatch(getAccountSuccess(account));
        } else {
            console.log('No such account document!');
            dispatch(getAccountFailure({
                response: {
                    status: 400,
                    statusText: 'No Account Account',
                },
            }));
        }
    });
};
// [END Get Account Data]

// Create Account Code
// TODO: None
// [START Create Account Code]
export const createAccountCodeRequest = () => ({
    type: 'CREATE_ACCOUNT_CODE_REQUEST',
});

export const createAccountCodeSuccess = () => ({
    type: 'CREATE_ACCOUNT_CODE_SUCCESS',
});

export const createAccountCodeFailure = error => ({
    type: 'CREATE_ACCOUNT_CODE_FAILURE',
    payload: {
        status: error.response.status,
        statusText: error.response.statusText,
    },
});
export const createAccountCode = (token, accountCode) => (dispatch) => {
      dispatch(createAccountCodeRequest());
      const codeRef = db().collection('ActivationCodes').doc()
      const creationDate = Date.now()
      accountCode.activationCode = codeRef.id;
      accountCode.creationDate = creationDate;
      accountCode.updatedDate = creationDate;
      codeRef.set(accountCode).then(() => {
            dispatch(createAccountCodeSuccess());
            dispatch(activateAccountCode(token, accountCode))
            // Analytics
          })
          .catch((error) => {
              // Analytics
              dispatch(createAccountCodeFailure({
                  response: {
                      status: 400,
                      statusText: error.message,
                  },
              }));
          });
};
// [END Create Account Code]


export const addAccountCode = accountCode => ({
    type: 'ADD_ACCOUNT_CODE',
    ...accountCode,
});

export const startFetchingAccountCodes = () => ({
    type: 'START_FETCHING_ACCOUNT_CODES',
});

export const receivedAccountCodes = () => ({
    type: 'RECEIVED_ACCOUNT_CODES',
    receivedAt: Date.now(),
});
export const receiveAccountCodes = querySnapshot => function (dispatch) {
    if (querySnapshot) {
        querySnapshot.forEach((doc) => {
            const accountCode = doc.data();
            accountCode.activationCode = doc.id;
            dispatch(addAccountCode(accountCode));
        });
        dispatch(receivedAccountCodes());
    }
};

export const fetchAccountCodes = () => function (dispatch) {
    dispatch(startFetchingAccountCodes());
    db()
        .collection('ActivationCodes')
        .onSnapshot((querySnapshot) => {
            setTimeout(() => {
                const accountCodes = querySnapshot || [];
                dispatch(receiveAccountCodes(accountCodes));
            }, 0);
        }, (error) => {
            console.log(error);
            // Handle Error
        });
};

// Activate Account Code
// TODO: None
// [START Activate Account Code]
export const activateAccountCodeRequest = () => ({
    type: 'ACTIVATE_ACCOUNT_CODE_REQUEST',
});

export const activateAccountCodeSuccess = () => ({
    type: 'ACTIVATE_ACCOUNT_CODE_SUCCESS',
});

export const activateAccountCodeFailure = error => ({
    type: 'ACTIVATE_ACCOUNT_CODE_FAILURE',
    payload: {
        status: error.response.status,
        statusText: error.response.statusText,
    },
});
export const activateAccountCode = (token, accountCode) => (dispatch) => {
        dispatch(activateAccountCodeRequest());
        db().collection('ActivationCodes').doc(accountCode.activationCode).update({
            valid: true,
        }).then((response) => {
          return apiActivateAccountCode(token, accountCode).then(parseJSON).then((response) => {
                  dispatch(activateAccountCodeSuccess());
                  history.push('/admin/accounts/codes')
                  // Add Analytics
                  // Add Swal Alert
              })
              .catch((error) => {
                  // Add Analytics
                  dispatch(activateAccountCodeFailure({
                      response: {
                          status: error.response.status,
                          statusText: error.response.data.statusText,
                      },
                  }));
              });
        }).catch((error) => {
            // Add Analytics
            dispatch(activateAccountCodeFailure({
                response: {
                    status: error.response.status,
                    statusText: error.response.data.statusText,
                },
            }));
        });
};
// [END Activate Account Code]

// Activate Account
// TODO: None
// [START Activate Account]
export const updateAccountRequest = () => ({
    type: 'UPDATE_ACCOUNT_REQUEST',
});

export const updateAccountSuccess = () => ({
    type: 'UPDATE_ACCOUNT_SUCCESS',
});

export const updateAccountFailure = error => ({
    type: 'UPDATE_ACCOUNT_FAILURE',
    payload: {
        status: error.response.status,
        statusText: error.response.statusText,
    },
});
export const updateAccount = (employeeID, accountID, account, redirectRoute) => (dispatch) => {
        dispatch(updateAccountRequest());
        const accountID = account.accountID;
        if (!validateKey(accountID)) {
            errorAlert('Invalid Account ID');
            return;
        }
        // Transaction that updates account & geolocation
        console.log(account)

        const currentAccountInfo = account;

        const currentAccountRef = db().collection('Accounts').doc(accountID);
        const futureLegacyAccount = db().collection('LegacyAccounts').doc()

        const updatedTime = new Date();

        return db().runTransaction(transaction => transaction.get(currentAccountRef).then((currentAccountSnapshot) =>{
            if (!currentAccountSnapshot.exists) {
                throw 'Account Does Not Exists';
            }

            // Update Account Information
            transaction.set(futureLegacyAccount, currentAccountSnapshot.data())
            transaction.set(futureLegacyAccount, {'active': false, 'newAccountRef': currentAccountRef}, {merge: true})
            const oldDocRef = currentAccountSnapshot.data()['oldAccountRef']
            if (oldDocRef) {
                transaction.update(oldDocRef, {'newAccountRef': futureLegacyAccount})
            }
            currentAccountInfo.active = true
            currentAccountInfo.deleted = false
            currentAccountInfo.updatedTime = updatedTime
            currentAccountInfo.oldAccountRef = futureLegacyAccount
            transaction.set(currentAccountRef, getAccountFromSnapshot(currentAccountInfo));

            return Promise.resolve({ currentAccountRef, currentAccountInfo });

        })).then((result) => {
            console.log('Transaction successfully committed!');
            dispatch(updateAccountSuccess());
            successAlert('update Account Success!');
            xupplyAnalytic('update_account_success', null);
            history.push(redirectRoute)
        }).catch((error) => {
            console.log('Transaction failed: ', error.message || error);
            console.log(error.message || error);
            errorAlert(error.message || error);
            xupplyAnalytic('update_account_failure', null);
            dispatch(updateAccountFailure({
                response: {
                    status: 403,
                    statusText: error.message || error,
                },
            }));
        });
};
// [END Activate Account]
