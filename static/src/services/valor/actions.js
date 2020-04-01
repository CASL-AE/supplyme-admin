import history from '../../history';
import { db, storage } from '../../store/firebase';
import { parseJSON } from '../../utils/misc';
import { apiActivateValorCode } from '../../utils/http_functions';
import { toNewValor } from './model';
import { xupplyAnalytic } from '../../utils/analytics';

export const addValor = valor => ({
    type: 'ADD_VALOR',
    ...valor,
});

export const startFetchingValors = () => ({
    type: 'START_FETCHING_VALORS',
});

export const receivedValors = () => ({
    type: 'RECEIVED_VALORS',
    receivedAt: Date.now(),
});
export const receiveValors = querySnapshot => (dispatch) => {
    if (querySnapshot) {
        querySnapshot.forEach((doc) => {
            const valor = doc.data();
            valor.valorID = doc.id;
            dispatch(addValor(valor));
        });
        dispatch(receivedValors());
    }
};

export const fetchValors = () =>  (dispatch) => {
    dispatch(startFetchingValors());
    db().collection('Valors').get().then((querySnapshot) => {
          setTimeout(() => {
              const valors = querySnapshot || [];
              dispatch(receiveValors(valors));
          }, 0);
      }, (error) => {
          console.log(error);
      });
};

export const saveValorMedia = (image, ref) => {
    const metadata = {
        contentType: 'text/image',
    };
    return new Promise((resolve, reject) => {
        if (image === null) {
            resolve(null);
        }
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

// Save New Valor
//
// [START Save New Valor]
export const saveNewValorRequest = () => ({
    type: 'SAVE_NEW_VALOR_REQUEST',
});


export const saveNewValorSuccess = () => ({
    type: 'SAVE_NEW_VALOR_SUCCESS',
});

export const saveNewValorFailure = error => ({
    type: 'SAVE_NEW_VALOR_FAILURE',
    payload: {
        status: error.response.status,
        statusText: error.response.statusText,
    },
});
export const saveNewValor = (valorInfo, redirectRoute) => (dispatch) => {
    dispatch(saveNewValorRequest());

    const createdTime = new Date()

    const newValorDocRef = db().collection("Valors").doc();
    const storageRef = storage().ref();
    const valorImgRef = storageRef.child("valorImages/" + newValorDocRef.id + ".png")

    const valorID = newValorDocRef.id;
    valorInfo.active = true
    valorInfo.createdTime = createdTime
    valorInfo.updatedTime = createdTime
    valorInfo.valorID = valorID;

    saveValorMedia(valorInfo.imageData, valorImgRef).then((downloadURL) => {
          console.warn('Valor Image Saved!!')
          valorInfo.avatar = downloadURL;
          return db().runTransaction((transaction) => {
            transaction.set(newValorDocRef, valorInfo);
            return Promise.resolve({ valorID });
          }).then((valorID) => {
              console.log("Transaction successfully committed!");
              dispatch(saveNewValorSuccess());
              xupplyAnalytic('save_valor_success', null);
              history.push(redirectRoute);
          }).catch((error) => {
              console.log("Transaction failed: ", error);
              xupplyAnalytic('save_valor_failure', null);
              dispatch(saveNewValorFailure({
                  response: {
                      status: 999,
                      statusText: error.message,
                  },
              }));
          });
    });
};
// [END Save New Valor]
