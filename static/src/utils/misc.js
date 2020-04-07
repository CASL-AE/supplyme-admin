/* eslint max-len: 0, no-param-reassign: 0 */

import history from '../history';

// Dispatch Route with history
export function dispatchNewRoute(route) {
    history.push(route);
}

export function parseJSON(response) {
    return response.data;
}

/*

Time Functions

*/

export function formatDateWTime(date) {
    if (!validateDate(date)) {
        return 'Invalid Date';
    }
    // console.log(date);
    let hours = date.getHours();
    let minutes = date.getMinutes();
    var monthNames = [
        "Jan", "Feb", "March",
        "April", "May", "June", "July",
        "Aug", "Sept", "Oct",
        "Nov", "Dec"
    ];
    const ampm = hours >= 12 ? 'pm' : 'am';
    hours %= 12;
    hours = hours || 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? `0${minutes}` : minutes;
    const strTime = `${hours}:${minutes} ${ampm}`;
    return `${monthNames[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}  ${strTime}`;
}

export function formatDateNoTime(date) {
    if (!validateDate(date)) {
        return 'Invalid Date';
    }
    let hours = date.getHours();
    let minutes = date.getMinutes();
    var monthNames = [
        "Jan", "Feb", "March",
        "April", "May", "June", "July",
        "Aug", "Sept", "Oct",
        "Nov", "Dec"
    ];
    return `${monthNames[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}

export function parseFirestoreTimeStamp(stamp) {
    if (stamp && stamp.seconds) {
        return stamp.toDate();
    }
    return stamp;
}

export function getKeys(pathname) {
    const path = pathname.split('/');
    const firstID = path[2];
    const secondID = path[4];
    const thirdID = path[6];
    const fourthID = path[8];
    return {
        first: firstID,
        second: secondID,
        third: thirdID,
        fourth: fourthID,
    }
}

export function getRegistrationSearch(search) {
    if (!search) {
        return {
            demo: null,
            code: null,
            type: null,
            error: null,
        }
    }
    const results = search.split('?').pop(-1);
    const _results = results.split('&');
    let demo = null;
    let code = null;
    let type = null;
    let error = null;
    _results.forEach((result) => {
        const key = result.split('=').shift();
        const value = result.split('=').pop();
        switch (key) {
            case 'demo':
                demo = value;
                break;
            case 'code':
                code = value;
                break;
            case 'type':
                type = value;
                break;
            case 'error':
                error = value;
                break;
            default:
                break;
        }
    });
    return {
        demo: demo,
        code: code,
        type: type,
        error: error,
    }
}

// Validation
export function validateVarChar(string) {
    if (typeof string === 'string' || string instanceof String && string !== null && string !== ''){
        return true;
    }
    return false;
}

export function validateKey(string) {
    const re = /^^(?!\.\.?$)(?!.*__.*__)([^/]{1,1500})$/;
    return re.test(string);
}

export function validateDate(date) {
    return date && Object.prototype.toString.call(date) === "[object Date]" && !isNaN(date);
}

export function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

export function validatePhone(name) {
    const re = /^[\+]?[0-9]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
    return re.test(name);
}

export function validateString(string) {
    const re = /^[A-Za-z].*$/;
    return re.test(string);
}
export function validateNumber(string) {
    const re = /^[0-9].*$/;
    return re.test(string);
}

export function validateLocation(location) {
    const lat = location.lat;
    const lng = location.lng;
    if (!validateNumber(lat)) {
        console.error('Invalid Location Latitude');
        return false;
    }
    if (!validateNumber(lng)) {
        console.error('Invalid Location Longitude');
        return false;
    }
    return true
}

export function base64ToArrayBuffer(base64) {
    var binary_string = window.atob(base64);
    var len = binary_string.length;
    var bytes = new Uint8Array(len);
    for (var i = 0; i < len; i++) {
        bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
}

export function arrayBufferToBase64(buffer) {
    var binary = '';
    var bytes = new Uint8Array( buffer );
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
        binary += String.fromCharCode( bytes[ i ] );
    }
    return window.btoa( binary );
}

/*

Sorts & Filters

*/

export function filterBy(items) {
    return items.filter((i) => {
        return (i.active);
    });
}

/// RANDOM ///

export function parseLabel(label) {
    var finalLabel = '';
    const splitLabel = label.split('_');
    splitLabel.forEach((newLabel) => {
        finalLabel += newLabel.charAt(0).toUpperCase() + newLabel.slice(1) + ' '
    })
    return finalLabel
}

export function dispatchNewObject(e, accountID, objectType, objectID, subObjectType) {
    var route = '';
    if (subObjectType) {
        route = `/accounts/${accountID}/${objectType}s/${objectID}/${subObjectType}`;
    } else {
        route = `/accounts/${accountID}/${objectType}s/${objectID}`
    }
    dispatchNewRoute(route);
}

/*

Integer / Currency Functions

*/

export function roundUp(value, precision) {
    precision = Math.pow(10, precision);
    return Math.ceil(value * precision) / precision;
}

export function formatNumbersWithCommas(value) {
    if (!roundUp(value, 2)) {
        return value;
    }
    return roundUp(value, 2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}
