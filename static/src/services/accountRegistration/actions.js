import history from '../../history';
import { auth, db } from '../../store/firebase';
import { parseJSON } from '../../utils/misc';
import { errorAlert } from '../../utils/alerts';
import { xupplyAnalytic } from '../../utils/analytics';
import { toNewAccount } from '../account/model';
import { getAccount } from '../../services/account/actions';
import { toNewEmployee } from '../employee/model';
import { apiSendEmailRegisteredAccount } from '../../utils/http_functions';

// Register Account
// TODO: None
// [START Register Account]
export const registerAccountRequest = () => ({
    type: 'REGISTER_ACCOUNT_REQUEST',
});


export const registerAccountSuccess = (employeeID, accountID, employee, idToken) => ({
    type: 'REGISTER_ACCOUNT_SUCCESS',
    payload: {
        employeeID,
        accountID,
        employee,
        idToken,
    },
});


export const registerAccountFailure = error => ({
    type: 'REGISTER_ACCOUNT_FAILURE',
    payload: {
        status: error.response.status,
        statusText: error.response.statusText,
    },
});

export const validateActivationCode = (code) => {
  const codeRef = db().collection('ActivationCodes').doc(code);
  return codeRef.get().then((doc) => {
      if (doc.exists && doc.data().valid) {
        return true;
      } else {
        xupplyAnalytic('activation_code_failure', null);
        return false;
      }
    }).catch((error) => {
      console.log(error);
      xupplyAnalytic('activation_code_ref_failure', null);
      return false;
    })
}

export const registerAccount = (accountCode, password, redirectRoute) => (dispatch) => {
    console.log(accountCode)
    console.log(password)
    console.log(redirectRoute)
    dispatch(registerAccountRequest());
    return validateActivationCode(accountCode.activationCode).then((response) => {
        if (!response) {
          console.log('Error Validating Auth Code');
          errorAlert('Error Validating Auth Code')
          xupplyAnalytic('register_account_failure', null);
          dispatch(registerAccountFailure({
              response: {
                  status: 403,
                  statusText: "Error Validating Auth Code",
              },
          }));
          return;
        }
        const accountRef = db().collection('Accounts').doc();
        const activationCodeRef = db().collection('ActivationCodes').doc(accountCode.activationCode);
        const employeeActivationCodeRef = db().collection('EmployeeActivationCodes').doc(accountCode.activationCode);

        const accountInfo = toNewAccount()
        accountInfo.name = accountCode.ownerName;
        accountInfo.accountType = accountCode.accountType;
        accountInfo.accountID = accountRef.id;
        return auth().createUserWithEmailAndPassword(accountCode.email, password).then((user) => {
            return db().runTransaction((transaction) => {
                return auth().currentUser.getIdToken().then((idToken) => {

                  const createdDate = new Date()

                  const newUserRef = db().collection('MasterUserList').doc(user.user.uid);
                  transaction.set(newUserRef, { accountID: accountRef.id, accountType: accountCode.accountType });

                  transaction.set(accountRef, accountInfo );
                  transaction.set(activationCodeRef, { accountID: accountRef.id, valid: false, updatedDate: createdDate });
                  transaction.set(employeeActivationCodeRef, { valid: false });


                  const newEmployeeRef = accountRef.collection('Employees').doc(user.user.uid);
                  const employeeInfo = toNewEmployee();
                  employeeInfo.name = accountCode.ownerName;
                  employeeInfo.phoneNumber = accountCode.phoneNumber;
                  employeeInfo.email = accountCode.email;
                  employeeInfo.activationCode = accountCode.activationCode;
                  employeeInfo.permissionLevel = 'owner';
                  employeeInfo.createdDate = createdDate;
                  employeeInfo.updatedDate = createdDate;
                  employeeInfo.employeeID = user.user.uid;
                  employeeInfo.active = true;
                  employeeInfo.deleted = false;
                  employeeInfo.terms = true;
                  employeeInfo.termsTime = createdDate;
                  employeeInfo.privacy = true;
                  employeeInfo.privacyTime = createdDate;
                  transaction.set(newEmployeeRef, employeeInfo);
                  return {
                      employeeID: user.user.uid,
                      accountID: accountRef.id,
                      employeeInfo,
                      idToken,
                  };
                }).catch((error) => {
                  console.log(error)
                  errorAlert(error.message);
                  xupplyAnalytic('register_account_failure', null);
                  dispatch(registerAccountFailure({
                      response: {
                          status: 999,
                          statusText: error.message,
                      },
                  }));
                  throw (error)
                })
            }).then((result) => {
                console.log("Transaction successfully committed!");
                console.log(result)
                dispatch(registerAccountSuccess(
                  result.employeeID,
                  result.accountID,
                  result.employeeInfo,
                  result.idToken,
                ));
                dispatch(getAccount(result.accountID));
                xupplyAnalytic('register_account_success', null);
                history.push(redirectRoute);
            }).catch((error) => {
                console.log("Transaction failed: ", error);
                errorAlert(error.message);
                xupplyAnalytic('register_account_failure', null);
                dispatch(registerAccountFailure({
                    response: {
                        status: 999,
                        statusText: error.message,
                    },
                }));
            });
        }).catch((error) => {
            console.log(error)
            errorAlert(error.message);
            xupplyAnalytic('register_account_failure', null);
            return dispatch(registerAccountFailure({
                response: {
                    status: 999,
                    statusText: error.message,
                },
            }));
        });
    });
};
// [END Register Account]
