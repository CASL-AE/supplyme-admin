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
        totals: request.totals,
        requestType: request.requestType,
        status: request.status,
        location: request.location,
        items: request.items,
        stockPerItem: request.stockPerItem,
        orders: request.orders,
        transactions: request.transactions,
    };
}
export function toNewRequest() {
    return {
        requestID: null,
        active: false,
        deleted: false,
        totals: toNewTotals(),
        private: false,
        requestType: 'b2c',
        status: {
            isStatus: 0,
            isStatusTime: null,
            events: [],
        },
        location: toNewLocation(),
        items: [],
        stockPerItem: {},
        orders: [],
        transactions: [],
    };
}

export function toNewTotals() {
    return {
        discounts: 0,
        due: 0,
        items: 0,
        paid: 0,
        serviceCharges: 0,
        otherCharges: 0,
        subTotal: 0,
        tax: 0,
        total: 0,
    }
};

export function requestMarkerObject(request) {
    console.log(request)
    return {
        index: request.requestID,
        id: request.requestID,
        active: request.active,
        budget: request.budget,
        priority: request.priority,
        requiredBy: request.requiredBy,
        items: request.items.map(i => `${i.itemName}, `),
        due: request.totals.due,
        paid: request.totals.paid,
        location: request.location.address.location,
        img: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/info-i_maps.png',
    };
}
