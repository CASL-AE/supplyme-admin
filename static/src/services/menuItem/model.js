import { parseFirestoreTimeStamp } from '../../utils/misc';
import { toNewLocation } from '../location/model';


/*
Quantites

Linear Measure

in
ft
yd
rd
fur
mi
league
statute
nauticalMile

Area Measure

sqft
sqyd
sqrd
acre
sqmi
section
township

Cubic Measure

cuft
cuyd

Liquid Measure

gill
pint
quart
gallon

Avoirdupois Weight

grain
dr: dram
oz
lb
cwt: hunderedweight
ton
grosscwt: gross hunderedweight

Other
ea: Each

*/

/*

Package Type
piece
weight

*/

export function getMenuItemFromSnapshot(menuItem) {
    return {
        itemID: menuItem.itemID,
        fullSizeItemImageURL: menuItem.fullSizeItemImageURL,
        active: menuItem.active,
        deleted: menuItem.deleted,
        itemID: menuItem.itemID,
        upcID: menuItem.upcID,
        brandName: menuItem.brandName,
        // tagLine: menuItem.tagLine,
        // manufacturerName: menuItem.manufacturerName,
        itemName: menuItem.itemName,
        itemType: menuItem.itemType,
        description: menuItem.description,
        oldItemRef: menuItem.oldItemRef,
        quantities: menuItem.quantities,
        // measurement: menuItem.measurement,
        // lwd: menuItem.lwd,
        thumbItemImageURL: menuItem.thumbItemImageURL,
        updatedDate: parseFirestoreTimeStamp(menuItem.updatedDate),
        createdDate: parseFirestoreTimeStamp(menuItem.createdDate),
        availableStockPerItem: menuItem.availableStockPerItem,
        unassignedStockPerItem: menuItem.unassignedStockPerItem,
        // supplies: menuItem.supplies,
        // supportingDocs: menuItem.supportingDocs,
        isFinished: menuItem.isFinished,
        // warningLabel: menuItem.warningLabel,
        madeInCountry: menuItem.madeInCountry,
    };
}
export function getPublicMenuItemFromSnapshot(menuItem) {
    return {
        itemID: menuItem.itemID,
        fullSizeItemImageURL: menuItem.fullSizeItemImageURL,
        active: menuItem.active,
        deleted: menuItem.deleted,
        itemID: menuItem.itemID,
        upcID: menuItem.upcID,
        brandName: menuItem.brandName,
        itemName: menuItem.itemName,
        itemType: menuItem.itemType,
        description: menuItem.description,
        oldItemRef: menuItem.oldItemRef,
        quantities: menuItem.quantities,
        thumbItemImageURL: menuItem.thumbItemImageURL,
        updatedDate: parseFirestoreTimeStamp(menuItem.updatedDate),
        createdDate: parseFirestoreTimeStamp(menuItem.createdDate),
        availableStockPerItem: menuItem.availableStockPerItem,
        unassignedStockPerItem: menuItem.unassignedStockPerItem,
        isFinished: menuItem.isFinished,
        madeInCountry: menuItem.madeInCountry,
    };
}
export function toNewMenuItem() {
    return {
        itemID: null,
        fullSizeItemImageURL: null,
        active: false,
        deleted: false,
        itemID: null,
        upcID: null,
        brandName: null,
        // tagLiacturerName: null,
        itemName: null,
        itemType: 'ppe',
        description: null,
        oldItemRef: null,
        quantities: [],
        // measurement: {
        //     label: null,
        //     units: 0,
        // },
        // lwd: {
        //     length: 0,
        //     width: 0,
        //     depth: 0,
        // },
        thumbItemImageURL: null,
        updatedDate: null,
        createdDate: null,
        availableStockPerItem: {},
        unassignedStockPerItem: {},
        // supplies: [],
        // supportingDocs: [],
        isFinished: false,
        // warningLabel: null,
        madeInCountry: 'USA',
        imageData: null,
    };
}
export function toNewQuantity() {
    return {
        location: toNewLocation(),
        packageQuantity: 1,
        packageType: 'piece',
        weightType: null,
        pricePerUnit: 0,
        stock: 0,
    };
}
export function menuItemRowObject(m, q) {
    return {
        index: m.itemID,
        id: m.itemID,
        active: m.active,
        deleted: m.deleted,
        brandName: m.brandName,
        upcID: m.upcID,
        itemName: m.itemName,
        itemType: m.itemType,
        madeInCountry: m.madeInCountry,
        isFinished: m.isFinished,
        thumbnail: m.thumbItemImageURL,
        updatedDate: m.updatedDate,
        createdDate: m.createdDate,
        // Quantity Details
        location: `${q.location.address.locality}, ${q.location.address.region}`,
        packageQuantity: q.packageQuantity,
        packageType: q.packageType,
        pricePerUnit: q.pricePerUnit,
    };
}
