

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
    const active = address.active;
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
    if (!active) {
        console.error('Address NOT Active');
        return false;
    }
    return true;
}
