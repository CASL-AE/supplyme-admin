

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

export function validateAddress(address) {
    const street = address.street;
    const locality = address.locality;
    const region = address.region;
    const postal = address.postal;
    const country = address.country;
    const location = address.location;
    const geohash = address.geohash;
    if (!validateString(street)) {
        console.error('Invalid Address Street');
        return false;
    }
    if (!validateString(locality)) {
        console.error('Invalid Address Locality');
        return false;
    }
    if (!validateString(region)) {
        console.error('Invalid Address Region');
        return false;
    }
    if (!validateString(country)) {
        console.error('Invalid Address Country');
        return false;
    }
    if (!validateLocation(location)) {
        console.error('Invalid Address Location');
        return false;
    }
    if (!validateVarChar(geohash)) {
        console.error('Invalid Address GeoHash');
        return false;
    }
    return true;
}

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
  const re = /^[-]?[0-9].*$/;
  return re.test(string);
}
