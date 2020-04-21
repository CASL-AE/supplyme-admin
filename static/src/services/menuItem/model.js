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
        skuID: menuItem.skuID,
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
        // materials: menuItem.materials,
        supportingDocs: menuItem.supportingDocs,
        isDIY: menuItem.isDIY,
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
        skuID: menuItem.skuID,
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
        // materials: menuItem.materials,
        supportingDocs: menuItem.supportingDocs,
        isDIY: menuItem.isDIY,
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
        skuID: null,
        brandName: null,
        itemName: null,
        itemType: 'product', // Product or Material
        description: null,
        oldItemRef: null,
        quantities: [],
        thumbItemImageURL: null,
        updatedDate: null,
        createdDate: null,
        availableStockPerItem: {},
        unassignedStockPerItem: {},
        // materials: [
        //     item: null, // Menu Item
        //     measurement: {
        //         label: null,
        //         units: 0,
        //     },
        // ],
        supportingDocs: [],
        isDIY: false,
        madeInCountry: 'USA',
        imageData: null,
    };
}
export function toNewQuantity() {
    return {
        location: toNewLocation(),
        packageQuantity: 1,
        packageType: 'piece', // piece/box/carton/case/pallet
        weightType: null, // grain/dram/ounce/pound/cwt/ton/lcwt
        weight: 0,
        pricePerUnit: 0,
        stock: 0,
        size: {
            length: 0,
            width: 0,
            depth: 0,
        },
        measurement: {
            nickname: null,
            label: null,
            units: 0,
        },
        leadQuantity: 0,
        leadDays: 0,
        leadStartTime: 0,
        moq: 0,
        burnQuantity: 0,
        burnDays: 14, // Hold For Beta
        burnVariable: 0
    };
}

// Document Types

/*
Label
Instructions
Design
*/

export function toNewSupportingDoc() {
    return {
        name: null,
        doc: null,
        docType: 'label',
        uploadDate: null,
        metaData: null,
    };
}
