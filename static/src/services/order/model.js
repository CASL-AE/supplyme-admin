import { parseFirestoreTimeStamp } from '../../utils/misc';
import { toNewLocation } from '../../services/location/model';
import { toNewRequest, toNewTotals } from '../../services/request/model';
import { toNewMenuItem } from '../../services/menuItem/model';

export function getOrderFromSnapshot(order) {
    return {
        orderID: order.orderID,
        active: order.active,
        deleted: order.deleted,
        status: order.status,
        request: toNewRequest(),
        items: order.items,
        totals: order.totals,
        stockPerItem: order.stockPerItem,
    };
}

export function parseOrder(order, requestRef) {
    return {
        orderID: order.orderID,
        active: order.active,
        deleted: order.deleted,
        status: order.status,
        requestRef: requestRef,
        items: order.items,
        totals: order.totals,
        stockPerItem: order.stockPerItem,
    };
}

export function toNewOrder() {
    return {
        orderID: null,
        active: false,
        deleted: false,
        status: {
            isStatus: 0,
            isStatusTime: null,
            events: [],
        },
        request: toNewRequest(),
        items: [],
        totals: toNewTotals(),
        stockPerItem: {},
    };
}
export function orderRowObject(order) {
    return {
        index: order.orderID,
        id: order.orderID,
        active: order.active,
        deleted: order.deleted,
        isStatus: order.status.isStatus,
        deliveryTo: 'Null',
        requiredBy: parseFirestoreTimeStamp(order.request.requiredBy),
        updatedDate: parseFirestoreTimeStamp(order.status.isStatusTime),
    };
}
