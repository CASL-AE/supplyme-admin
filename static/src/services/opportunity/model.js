import { parseFirestoreTimeStamp } from '../../utils/misc';
import { toNewLocation } from '../../services/location/model';
import { toNewRequest } from '../../services/request/model';
import { toNewMenuItem } from '../../services/menuItem/model';

export function getOpportunityFromSnapshot(opportunity) {
    return {
        opportunityID: opportunity.opportunityID,
        active: opportunity.active,
        deleted: opportunity.deleted,
        status: opportunity.status,
        request: opportunity.request,
        menuItems: opportunity.menuItems,
        total: opportunity.total,
        stockPerItem: opportunity.stockPerItem,
    };
}
export function toNewOpportunity() {
    return {
        opportunityID: null,
        active: false,
        deleted: false,
        status: {
            isStatus: 0,
            isStatusTime: null,
            events: [],
        },
        request: toNewRequest(),
        menuItems: [],
        total: 0,
        stockPerItem: {},
    };
}
export function toNewOpportunityItem() {
    return {
        quantity: 0,
        item: toNewMenuItem(),
    };
}
export function opportunityRowObject(opportunity) {
    return {
        index: opportunity.opportunityID,
        id: opportunity.opportunityID,
        active: opportunity.active,
        deleted: opportunity.deleted,
        isStatus: opportunity.status.isStatus,
        deliveryTo: 'Null',
        requiredBy: parseFirestoreTimeStamp(opportunity.request.requiredBy),
        updatedDate: parseFirestoreTimeStamp(opportunity.status.isStatusTime),
    };
}
