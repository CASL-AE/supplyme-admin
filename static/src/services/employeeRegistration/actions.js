// import { Cookies } from 'react-cookie-banner';
import history from '../../history';
import { auth, db } from '../../store/firebase';
import { parseJSON } from '../../utils/misc';
import { toNewEmployee } from '../employee/model';
import { xupplyAnalytic } from '../utils/analytics';

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

export const registerEmployee = (employeeCode, password, redirectRoute) => (dispatch) => {
    console.log(employeeCode)
    console.log(password)
    console.log(redirectRoute)
    dispatch(registerEmployeeRequest());
    return validateEmployeeActivationCode(employeeCode.activationCode).then((newEmployeeCode) => {
      if (!employeeCode) {
        return;
      }
      const employeeActivationCodeRef = db().collection('EmployeeActivationCodes').doc(newEmployeeCode.activationCode);
      return db().runTransaction((transaction) => {
          return auth().createUserWithEmailAndPassword(employeeCode.email, password).then((user) => {
              try {
                  auth().currentUser.getIdToken().then((idToken) => {

                    const createdTime = new Date();

                    const newUserRef = db().collection('MasterUserList').doc(user.user.uid);
                    const accountRef = db().collection('Accounts').doc(newEmployeeCode.accountID);
                    transaction.set(newUserRef, { accountID: accountRef.id });
                    transaction.set(employeeActivationCodeRef, { valid: false });

                    const newEmployeeRef = dispensaryRef.collection('Employees').doc(user.user.uid);
                    const employeeInfo = toNewEmployee();
                    const newName = accountCode.ownerName.split(' ')
                    employeeInfo.firstName = newName[0]
                    employeeInfo.lastName = newName[1]
                    employeeInfo.name = employeeCode.ownerName;
                    employeeInfo.phoneNumber = employeeCode.phoneNumber;
                    employeeInfo.email = employeeCode.email;
                    employeeInfo.activationCode = newEmployeeCode.activationCode;
                    employeeInfo.permissionLevel = newEmployeeCode.permissionLevel;
                    employeeInfo.createdTime = createdTime;
                    employeeInfo.updatedTime = createdTime;
                    employeeInfo.employeeID = user.user.uid;
                    employeeInfo.active = true
                    employeeInfo.terms = true
                    employeeInfo.privacy = true
                    transaction.set(newEmployeeRef, employeeInfo);
                    const oldTempEmployeeRef = accountRef.collection("Employees").doc(newEmployeeCode.activationCode)
                    transaction.delete(oldTempEmployeeRef)

                    return {
                        employeeID: user.user.uid,
                        accountID: accountRef.id,
                        accountType: 'account',
                        employeeInfo,
                        idToken
                    }
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
              } catch (error) {
                  console.log(error)
                  errorAlert(error.message);
                  xupplyAnalytic('register_employee_failure', null);
                  dispatch(registerEmployeeFailure({
                      response: {
                          status: 999,
                          statusText: error.message,
                      },
                  }));
              }
          })
          .catch((error) => {
              console.log(error)
              errorAlert(error.message);
              xupplyAnalytic('register_employee_failure', null);
              dispatch(registerEmployeeFailure({
                  response: {
                      status: 999,
                      statusText: error.message,
                  },
              }));
          });
      }).then((result) => {
          console.log("Transaction successfully committed!");
          console.log(result)
          if (result === null) {
              return;
          }
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
    })
};
