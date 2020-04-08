import history from '../../history';
import { auth, db } from '../../store/firebase';
import { parseJSON } from '../../utils/misc';
import { errorAlert } from '../../utils/alerts';
import { xupplyAnalytic } from '../../utils/analytics';
import { toNewAccount } from '../account/model';
import { getAccount } from '../../services/account/actions';
import { toNewEmployee } from '../employee/model';
import { getLocationFromSnapshot } from '../location/model';

// Register Account
// TODO: None
// [START Register Account]
export const registerAccountRequest = () => ({
    type: 'REGISTER_ACCOUNT_REQUEST',
});


export const registerAccountSuccess = (employeeID, accountID, accountType, employee, idToken) => ({
    type: 'REGISTER_ACCOUNT_SUCCESS',
    payload: {
        employeeID,
        accountID,
        accountType,
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

export const registerAccount = (accountType, email, firstName, lastName, location, password, redirectRoute) => (dispatch) => {
    console.log(accountType)
    console.log(email)
    console.log(firstName)
    console.log(lastName)
    console.log(location)
    console.log(password)
    console.log(redirectRoute)
    dispatch(registerAccountRequest());
    const accountRef = db().collection('Accounts').doc();
    const employeeActivationCodeRef = db().collection('EmployeeActivationCodes').doc();
    const locationRef = accountRef.collection('Locations').doc();

    return auth().createUserWithEmailAndPassword(email, password).then((user) => {
        return db().runTransaction((transaction) => {
            return auth().currentUser.getIdToken().then((idToken) => {

              const newUserRef = db().collection('MasterUserList').doc(user.user.uid);
              const newEmployeeRef = accountRef.collection('Employees').doc(user.user.uid);

              const createdDate = new Date();

              const accountInfo = toNewAccount()
              accountInfo.name = `${firstName} ${lastName}`;
              accountInfo.accountType = accountType;
              accountInfo.accountID = accountRef.id;

              const locationInfo = location;
              locationInfo.active = true;
              locationInfo.deleted = false;
              locationInfo.contactInfo.name = `${firstName} ${lastName}`;
              locationInfo.contactInfo.email = email;
              locationInfo.createdDate = createdDate;
              locationInfo.locationID = locationRef.id;

              const employeeInfo = toNewEmployee();
              employeeInfo.firstName = firstName;
              employeeInfo.phoneNumber = null;
              employeeInfo.email = email;
              employeeInfo.activationCode = employeeActivationCodeRef.id;
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

              transaction.set(newUserRef, { accountID: accountRef.id, accountType: accountType });
              transaction.set(accountRef, accountInfo );
              transaction.set(employeeActivationCodeRef, { valid: false });
              transaction.set(locationRef, getLocationFromSnapshot(locationInfo));
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
              result.accountType,
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
};
// [END Register Account]
