import {
    apiSearchGooglePlaces,
    apiGeocodeGooglePlace,
} from '../../utils/http_functions';

import { errorAlert } from '../../utils/alerts';
// import { veridocAnalytic } from '../../utils/analytics';
import { parseJSON } from '../../utils/misc';

// Search Google Hospitals
// TODO: None
// [START Search Google Hospitals]
export const googleHospitalsRequest = () => ({
    type: 'FETCH_GOOGLE_PLACES_REQUEST',
});

export const googleHospitalsSuccess = places => ({
    type: 'RECEIVE_GOOGLE_PLACES_SUCCESS',
    places,
});

export const googleHospitalsFailure = error => ({
    type: 'RECEIVE_GOOGLE_PLACES_FAILURE',
    payload: {
        status: error.response.status,
        statusText: error.response.statusText,
    },
});
export const searchGoogleHospitals = (query) => (dispatch) => {
    dispatch(googleHospitalsRequest());
    return apiSearchGooglePlaces(query, 'hospital')
        .then(parseJSON)
        .then((response) => {
            console.log(response)
            // veridocAnalytic('google_places_success', null);
            dispatch(googleHospitalsSuccess(response.data.data));
        })
        .catch((error) => {
            console.log(error);
            errorAlert(error.response.data.statusText);
            dispatch(googleHospitalsFailure({
                response: {
                    status: 403,
                    statusText: 'User with that email already exists',
                },
            }));
        });
};
// [END Search Google Hospitals]

// Geocode Google Place
// TODO: None
// [START Geocode Google Place]
export const geocodeGooglePlace = (token, accountID, place) => {
    return apiGeocodeGooglePlace(token, accountID, place)
        .then(parseJSON)
        .then((response) => {
            // generalAnalytic(employeeID, 'google', 'googlePlacesSuccess');
            return response.data.data
        })
        .catch((error) => {
            console.log(error);
            // generalAlert(400, error.response.data.statusText);
            // generalAnalytic(employeeID, 'google', 'googlePlacesFailure');
        });
};
// [END Geocode Google Place]