import { parseFirestoreTimeStamp } from '../../utils/misc';

export function getEmployeeFromSnapshot(employee) {
    return {
        employeeID: employee.employeeID,
        permissionLevel: employee.permissionLevel,
        active: employee.active,
        deleted: employee.deleted,
        createdDate: parseFirestoreTimeStamp(employee.createdDate),
        updatedDate: parseFirestoreTimeStamp(employee.updatedDate),
        terms: employee.terms,
        termsTime: parseFirestoreTimeStamp(employee.termsTime),
        privacy: employee.privacy,
        privacyTime: parseFirestoreTimeStamp(employee.privacyTime),
        firstName: employee.firstName,
        lastName: employee.lastName,
        email: employee.email,
        phoneNumber: employee.phoneNumber,
        oldEmployeeRef: employee.oldEmployeeRef,
    };
}

export function toNewEmployee() {
    return {
        employeeID: null,
        permissionLevel: "owner",
        active: false,
        deleted: false,
        createdDate: null,
        updatedDate: null,
        terms: false,
        termsTime: null,
        privacy: false,
        privacyTime: null,
        firstName: null,
        lastName: null,
        email: null,
        phoneNumber: null,
        oldEmployeeRef: null,
    }
}

export function getEmployeeCodeFromSnapshot(employee) {
    return {
        activationCode: employee.activationCode,
        accountID: employee.accountID,
        ownerName: employee.ownerName,
        accountName: employee.accountName,
        accountType: employee.accountType,
        email: employee.email,
        permissionLevel: employee.permissionLevel,
        phoneNumber: employee.phoneNumber,
        valid: employee.valid,
        updatedDate: parseFirestoreTimeStamp(employee.updatedDate),
        createdDate: parseFirestoreTimeStamp(employee.createdDate),
    };
}
export function toNewEmployeeCode() {
    return {
        activationCode: null,
        accountID: null,
        ownerName: null,
        accountName: null,
        accountType: null,
        email: null,
        permissionLevel: 'owner',
        phoneNumber: null,
        valid: false,
        updatedDate: null,
        createdDate: null,
    };
}
export function employeeCodeRowObject(employeeCode) {
    return {
        index: employeeCode.activationCode,
        id: employeeCode.activationCode,
        accountID: employeeCode.accountID,
        ownerName: employeeCode.ownerName,
        accountName: employeeCode.accountName,
        email: employeeCode.email,
        permissionLevel: employeeCode.permissionLevel,
        phoneNumber: employeeCode.phoneNumber,
        valid: employeeCode.valid,
        updatedDate: employeeCode.updatedDate || new Date(),
        createdDate: employeeCode.createdDate || new Date(),
    };
}
