import { combineReducers } from 'redux';

// Initial App State
//
// [START Initial App State]
const initialState = {
    isFetching: false,
    isLoaded: false,
    statusText: null,
};
// [END Initial App State]

// Create Firebase State Reducer
//
// [START Firebase State Reducer]
const account = (state = initialState, action) => {
    switch (action.type) {
    case 'FETCH_ACCOUNT_REQUEST':
        return Object.assign({}, state, {
            isFetching: true,
        });
    case 'RECEIVE_ACCOUNT_SUCCESS':
        return Object.assign({}, state, {
            isFetching: false,
            isLoaded: true,
            accountID: action.payload.account.accountID,
            name: action.payload.account.name,
            accountType: action.payload.account.accountType,
            locations: action.payload.account.locations || [],
        });
    case 'RECEIVE_ACCOUNT_FAILURE':
        return Object.assign({}, state, {
            statusError: `Data Error: ${action.payload.status} ${action.payload.statusError}`,
            isFetching: false,
            isLoaded: false,
        });
    default:
        return state;
    }
};

const accountCode = (state = initialState, action) => {
    switch (action.type) {
    case 'FETCH_ACCOUNT_CODE_REQUEST':
        return Object.assign({}, state, {
            isFetching: true,
            isLoaded: false,
        });
    case 'RECEIVE_ACCOUNT_CODE_SUCCESS':
        return Object.assign({}, state, {
            isFetching: false,
            isLoaded: true,
            activationCode: action.payload.accountCode.activationCode,
            accountID: action.payload.accountCode.accountID || null,
            ownerName: action.payload.accountCode.ownerName|| null,
            accountName: action.payload.accountCode.accountName|| null,
            email: action.payload.accountCode.email|| null,
            phoneNumber: action.payload.accountCode.phoneNumber|| null,
            valid: action.payload.accountCode.valid,
            updatedDate: action.payload.accountCode.updatedDate|| null,
            creationDate: action.payload.accountCode.creationDate|| null,
        });
    case 'RECEIVE_ACCOUNT_CODE_FAILURE':
        return Object.assign({}, state, {
            statusError: `Data Error: ${action.payload.status} ${action.payload.statusError}`,
            isFetching: false,
            isLoaded: false,
        });
    default:
        return state;
    }
};


const addAccount = (state, action) => {
    switch (action.type) {
        case 'ADD_ACCOUNT':
          return getAccountFromSnapshot(action);
        default:
            return state
    }
}

const accounts = (state = [], action) => {
    switch (action.type) {
        case 'ADD_ACCOUNT':
            if (state.map(account => account.accountID).includes(action.accountID)) {
              return [
                addAccount(undefined, action)
              ]
            }else{
                return [
                  ...state,
                  addAccount(undefined, action)
                ]
            }
        default:
            return state
    }
};

const receivedAt = (state = null, action) => {
    switch (action.type) {
    case 'UNMOUNT_ACCOUNTS_LISTENER_REQUEST':
        return null;
    case 'START_FETCHING_ACCOUNTS':
        return state;
    case 'ADD_ACCOUNT':
        return null;
    case 'RECEIVED_ACCOUNTS':
        return Date.now();

    default:
        return state;
    }
};

const addAccountCode = (state, action) => {
    switch (action.type) {
        case 'ADD_ACCOUNT_CODE':
          return {
            activationCode: action.activationCode,
            accountID: action.accountID|| null,
            ownerName: action.ownerName|| null,
            accountName: action.accountName|| null,
            email: action.email|| null,
            phoneNumber: action.phoneNumber|| null,
            valid: action.valid,
            updatedDate: action.updatedDate|| null,
            creationDate: action.creationDate|| null,
          }
        default:
            return state
    }
}

const accountCodes = (state = [], action) => {
    switch (action.type) {
        case 'ADD_ACCOUNT_CODE':
            if (state.map(accountCode => accountCode.activationCode).includes(action.activationCode)) {
              return [
                addAccountCode(undefined, action)
              ]
            }else{
                return [
                  ...state,
                  addAccountCode(undefined, action)
                ]
            }
        default:
            return state
    }
};

const codesReceivedAt = (state = null, action) => {
    switch (action.type) {
    case 'START_FETCHING_ACCOUNT_CODES':
        return state;
    case 'ADD_ACCOUNT_CODE':
        return null;
    case 'RECEIVED_ACCOUNT_CODES':
        return Date.now();

    default:
        return state;
    }
};

const accountData = combineReducers({
    accounts,
    receivedAt,
    account,
    accountCodes,
    codesReceivedAt,
    accountCode,
});

export default accountData;
