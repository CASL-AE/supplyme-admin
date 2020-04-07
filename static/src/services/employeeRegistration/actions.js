// import { Cookies } from 'react-cookie-banner';
import history from '../../history';
import { auth, db } from '../../store/firebase';
import { parseJSON } from '../../utils/misc';
import { toNewEmployee } from '../employee/model';
import { errorAlert } from '../../utils/alerts';
import { xupplyAnalytic } from '../../utils/analytics';
import { getLocationFromSnapshot } from '../location/model';
import { getEmployeeFromSnapshot } from '../employee/model';
import { getAccount } from '../../services/account/actions';

// Register Employee
//
// [START Register Employee]
export const registerEmployeeRequest = () => ({
    type: 'REGISTER_EMPLOYEE_REQUEST',
});


export const registerEmployeeSuccess = (userID, accountID, accountType, employee, idToken) => ({
    type: 'REGISTER_EMPLOYEE_SUCCESS',
    payload: {
        userID,
        accountID,
        accountType,
        employee,
        idToken,
    },
});


export const registerEmployeeFailure = error => ({
    type: 'REGISTER_EMPLOYEE_FAILURE',
    payload: {
        status: error.response.status,
        statusText: error.response.statusText,
    },
});

export const validateEmployeeActivationCode = (code) => {
  const codeRef = db().collection('EmployeeActivationCodes').doc(code);
  return codeRef.get().then((doc) => {
      if (doc.exists && doc.data().valid) {
        return doc.data();
      } else {
        console.log('Invalid Employee Activation Code');
        xupplyAnalytic('employee_activation_code_failure', null);
        return false;
      }
    })
    .catch((error) => {
      console.log('Employee Activation Code Ref Error: ' + error.message);
      xupplyAnalytic('employee_activation_code_ref_failure', null);
      return false;
    })
}

export const registerEmployee = (activationCode, email, firstName, lastName, location, password, redirectRoute) => (dispatch) => {
    console.log(activationCode)
    console.log(email)
    console.log(firstName)
    console.log(lastName)
    console.log(location)
    console.log(password)
    console.log(redirectRoute)
    dispatch(registerEmployeeRequest());
    return validateEmployeeActivationCode(activationCode).then((newEmployeeCode) => {
      if (!newEmployeeCode.activationCode) {
        throw 'Invalid Activation Code';
      }

      return auth().createUserWithEmailAndPassword(email, password).then((user) => {
          return db().runTransaction((transaction) => {
              return auth().currentUser.getIdToken().then((idToken) => {
                  const createdDate = new Date();

                  const employeeActivationCodeRef = db().collection('EmployeeActivationCodes').doc(newEmployeeCode.activationCode);

                  const newUserRef = db().collection('MasterUserList').doc(user.user.uid);
                  const accountRef = db().collection('Accounts').doc(newEmployeeCode.accountID);
                  const newEmployeeRef = accountRef.collection('Employees').doc(user.user.uid);
                  const oldTempEmployeeRef = accountRef.collection("Employees").doc(newEmployeeCode.activationCode)

                  const employeeInfo = toNewEmployee();
                  const newName = newEmployeeCode.ownerName.split(' ')
                  employeeInfo.firstName = newName[0];
                  employeeInfo.lastName = newName[1];
                  employeeInfo.phoneNumber = newEmployeeCode.phoneNumber;
                  employeeInfo.email = email;
                  employeeInfo.activationCode = activationCode;
                  employeeInfo.permissionLevel = newEmployeeCode.permissionLevel;
                  employeeInfo.createdTime = createdDate;
                  employeeInfo.updatedTime = createdDate;
                  employeeInfo.employeeID = user.user.uid;
                  employeeInfo.active = true;
                  employeeInfo.terms = true;
                  employeeInfo.privacy = true;

                  transaction.set(newUserRef, { accountID: accountRef.id, accountType: newEmployeeCode.accountType });
                  transaction.set(employeeActivationCodeRef, { valid: false });
                  transaction.set(newEmployeeRef, getEmployeeFromSnapshot(employeeInfo));
                  transaction.delete(oldTempEmployeeRef);

                  return {
                      employeeID: user.user.uid,
                      accountID: accountRef.id,
                      accountType: newEmployeeCode.accountType,
                      employeeInfo,
                      idToken
                  };
              })
              .catch((error) => {
                console.log(error)
                errorAlert(error.message);
                xupplyAnalytic('register_employee_failure', null);
                return null
                dispatch(registerEmployeeFailure({
                    response: {
                        status: 999,
                        statusText: error.message,
                    },
                }));
              })
          }).then((result) => {
              console.log("Transaction successfully committed!");
              console.log(result)
              dispatch(registerEmployeeSuccess(
                  result.employeeID,
                  result.accountID,
                  result.accountType,
                  result.employeeInfo,
                  result.idToken,
              ));
              dispatch(getAccount(result.accountID));
              xupplyAnalytic('register_employee_success', null);
              history.push(redirectRoute);
          }).catch((error) => {
              console.log("Transaction failed: ", error);
              errorAlert(error.message);
              xupplyAnalytic('register_employee_failure', null);
              dispatch(registerEmployeeFailure({
                  response: {
                      status: 999,
                      statusText: error.message,
                  },
              }));
          });
      }).catch((error) => {
          console.log(error)
          errorAlert(error.message);
          xupplyAnalytic('register_employee_failure', null);
          return dispatch(registerEmployeeFailure({
              response: {
                  status: 999,
                  statusText: error.message,
              },
          }));
      });
    })
};
