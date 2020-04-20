import { parseFirestoreTimeStamp } from '../../utils/misc';

export function getLocationFromSnapshot(location) {
    return {
        locationID: location.locationID,
        active: location.active,
        deleted: location.deleted,
        name: location.name,
        licenseID: location.licenseID,
        locationType: location.locationType,
        contactInfo: location.contactInfo,
        address: location.address,
        updatedDate: parseFirestoreTimeStamp(location.updatedDate),
        createdDate: parseFirestoreTimeStamp(location.createdDate),
    };
}
export function toNewLocation() {
    return {
        locationID: null,
        active: false,
        deleted: false,
        address: {
            locality: null,
            country: null,
            region: null,
            street1: null,
            street2: null,
            postal: null,
            location: null,
            geohash: null,
            placeID: null,
        },
        name: null,
        licenseID: null,
        locationType: 'medical',
        contactInfo: {
            name: null,
            phoneNumber: null,
            email: null,
        },
        updatedDate: null,
        createdDate: null,
    };
}
