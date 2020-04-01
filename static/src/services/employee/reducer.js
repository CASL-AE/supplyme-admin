import { combineReducers } from 'redux';
import { getEmployeeFromSnapshot, getEmployeeCodeFromSnapshot } from './model';

const addEmployee = (state, action) => {
    switch (action.type) {
        case 'ADD_EMPLOYEE':
          return getEmployeeFromSnapshot(action)
        default:
            return state
    }
}

const employees = (state = [], action) => {
    switch (action.type) {
        case 'ADD_EMPLOYEE':
            if (state.map(employee => employee.employeeID).includes(action.employeeID)) {
              return [
                addEmployee(undefined, action)
              ]
            }else{
                return [
                  ...state,
                  addEmployee(undefined, action)
                ]
            }
        default:
            return state
    }
};

const receivedAt = (state = null, action) => {
    switch (action.type) {
    case 'UNMOUNT_EMPLOYEES_LISTENER_REQUEST':
        return null;
    case 'START_FETCHING_EMPLOYEES':
        return state;
    case 'ADD_EMPLOYEE':
        return null;
    case 'RECEIVED_EMPLOYEES':
        return Date.now();

    default:
        return state;
    }
};

const addEmployeeCode = (state, action) => {
    switch (action.type) {
        case 'ADD_EMPLOYEE_CODE':
          return getEmployeeCodeFromSnapshot(action);
        default:
            return state
    }
}

const employeeCodes = (state = [], action) => {
    switch (action.type) {
        case 'ADD_EMPLOYEE_CODE':
            if (state.map(employeeCode => employeeCode.activationCode).includes(action.activationCode)) {
              return [
                addEmployeeCode(undefined, action)
              ]
            }else{
                return [
                  ...state,
                  addEmployeeCode(undefined, action)
                ]
            }
        default:
            return state
    }
};

const codesReceivedAt = (state = null, action) => {
    switch (action.type) {
    case 'START_FETCHING_EMPLOYEE_CODES':
        return state;
    case 'ADD_EMPLOYEE_CODE':
        return null;
    case 'RECEIVED_EMPLOYEE_CODES':
        return Date.now();
    default:
        return state;
    }
};

const employeeData = combineReducers({
    employees,
    receivedAt,
    employeeCodes,
    codesReceivedAt,
});

export default employeeData;
