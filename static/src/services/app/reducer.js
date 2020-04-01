
// Initial App State
//
// [START Initial App State]
const initialState = {
    isAuthenticated: false,
    isAuthenticating: false,
    isRegistered: false,
    isRegistering: false,
    statusText: null,
    accountID: null,
    accountType: null,
    employeeID: null,
    idToken: null,
    permissionLevel: null,
    email: null,
    displayName: null,
};
// [END Initial App State]


// Create Firebase State Reducer
//
// [START Firebase State Reducer]

const app = (state = initialState, action) => {
    switch (action.type) {
    case 'LOGIN_EMPLOYEE_REQUEST':
        return Object.assign({}, state, {
            isAuthenticating: true,
        });
    case 'LOGIN_EMPLOYEE_SUCCESS':
        return Object.assign({}, state, {
            isAuthenticating: false,
            isAuthenticated: true,
            statusText: 'You have been successfully logged in.',
            employeeID: action.payload.employeeID,
            idToken: action.payload.idToken,
            permissionLevel: action.payload.employee.permissionLevel,
            accountID: action.payload.accountID,
            accountType: action.payload.accountType,
            email: action.payload.employee.email,
            displayName: action.payload.employee.name,
        });
    case 'LOGIN_EMPLOYEE_FAILURE':
        return Object.assign({}, state, {
            isAuthenticating: false,
            isAuthenticated: false,
            statusText: `Authentication Error: ${action.payload.status} ${action.payload.statusText}`,
        });
    case 'REGISTER_ACCOUNT_REQUEST':
        return Object.assign({}, state, {
            isRegistering: true,
        });
    case 'REGISTER_ACCOUNT_SUCCESS':
        return Object.assign({}, state, {
            isRegistering: false,
            isRegistered: true,
            isAuthenticated: true,
            statusText: 'You have been successfully registered.',
            employeeID: action.payload.employeeID,
            idToken: action.payload.idToken,
            permissionLevel: action.payload.employee.permissionLevel,
            accountID: action.payload.accountID,
            accountType: action.payload.accountType,
            email: action.payload.employee.email,
            displayName: action.payload.employee.name,
        });
    case 'REGISTER_ACCOUNT_FAILURE':
        return Object.assign({}, state, {
            isRegistering: false,
            isRegistered: false,
            statusText: `Authentication Error: ${action.payload.status} ${action.payload.statusText}`,
        });
    case 'REGISTER_EMPLOYEE_REQUEST':
        return Object.assign({}, state, {
            isRegistering: true,
        });
    case 'REGISTER_EMPLOYEE_SUCCESS':
        return Object.assign({}, state, {
            isRegistering: false,
            isRegistered: true,
            isAuthenticated: true,
            statusText: 'You have been successfully registered.',
            employeeID: action.payload.employeeID,
            idToken: action.payload.idToken,
            permissionLevel: action.payload.employee.permissionLevel,
            accountID: action.payload.accountID,
            email: action.payload.employee.email,
            displayName: action.payload.employee.name,
        });
    case 'REGISTER_EMPLOYEE_FAILURE':
        return Object.assign({}, state, {
            isRegistering: false,
            isRegistered: false,
            statusText: `Authentication Error: ${action.payload.status} ${action.payload.statusText}`,
        });
    case 'LOGOUT_EMPLOYEE_SUCCESS':
        return Object.assign({}, state, {
            isAuthenticating: false,
            isAuthenticated: false,
            statusText: 'You have been successfully logged out.',
        });
    case 'LOGOUT_EMPLOYEE_FAILURE':
        return Object.assign({}, state, {
            isAuthenticating: false,
            isAuthenticated: false,
            statusText: `Logout Error: ${action.payload.status} ${action.payload.statusText}`,
        });
    default:
        return state;
    }

};

export default app;
