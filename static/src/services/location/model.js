import { parseFirestoreTimeStamp } from '../../utils/misc';

export function getLocationFromSnapshot(location) {
    return {
        locationID: location.locationID,
        active: location.active,
        deleted: location.deleted,
        name: location.name,
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
        contactInfo: {
            name: null,
            phoneNumber: null,
            email: null,
        },
        updatedDate: null,
        createdDate: null,
    };
}
export function locationRowObject(location) {
    return {
        index: location.locationID,
        id: location.locationID,
        active: location.active,
        deleted: location.deleted,
        address: `${location.address.locality} ${location.address.region}, ${location.address.country}`,
        name: location.name,
        placeID: location.address.placeID,
        phoneNumber: location.contactInfo.phoneNumber,
        updatedDate: location.updatedDate,
        createdDate: location.createdDate,
    };
}
