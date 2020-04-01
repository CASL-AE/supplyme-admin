import { parseFirestoreTimeStamp } from '../../utils/misc';
import { toNewLocation } from '../../services/location/model';
import { toNewMenuItem } from '../../services/menuItem/model';


/*
Request Types

Business To Consumer: b2c
Business To Business: b2b

*/

export function getRequestFromSnapshot(request) {
    return {
        requestID: request.requestID,
        active: request.active,
        deleted: request.deleted,
        priority: request.priority,
        budget: request.budget,
        requestType: request.requestType,
        requiredBy: parseFirestoreTimeStamp(request.requiredBy),
        status: request.status,
        location: request.location,
        menuItems: request.menuItems,
    };
}
export function toNewRequest() {
    return {
        requestID: null,
        active: false,
        deleted: false,
        priority: 'low',
        budget: 0,
        private: false,
        requestType: 'b2c',
        requiredBy: null,
        status: {
            isStatus: 0,
            isStatusTime: null,
            events: [],
        },
        location: toNewLocation(),
        menuItems: [],
    };
}
export function toNewRequestItem() {
    return {
        quantity: 0,
        item: toNewMenuItem(),
    };
}
export function requestRowObject(request) {
    return {
        index: request.requestID,
        id: request.requestID,
        active: request.active,
        deleted: request.deleted,
        budget: request.budget,
        priority: request.priority,
        requiredBy: request.requiredBy,
        isStatus: request.status.isStatus,
        isStatusTime: parseFirestoreTimeStamp(request.status.isStatusTime),
        locationName: request.location.name,
        items: request.menuItems.map(i => `${i.item.itemName}, `),
    };
}
export function requestMarkerObject(request) {
    console.log(request)
    return {
        index: request.requestID,
        id: request.requestID,
        active: request.active,
        budget: request.budget,
        priority: request.priority,
        requiredBy: request.requiredBy,
        items: request.menuItems.map(i => `${i.item.itemName}, `),
        location: request.location.address.location,
        img: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/info-i_maps.png',
    };
}
