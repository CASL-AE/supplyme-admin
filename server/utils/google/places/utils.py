# server/utils/google/places/utils.py
import logging

# Create Logger
logger = logging.getLogger('tabs.utils.google.places.utils.py')

from datetime import datetime
import time
import json
import os
import requests
import geohash
from server.config import Config

# Search Google Places API
# TODO: None
# [START Search Google Places API]
def search_google_places(type, text):
    google_url = 'https://maps.googleapis.com/maps/api/place/autocomplete/json?&input={}&key={}'.format(
        text,
        Config.get_env_var('GOOGLE_API_KEY'),
    )
    # google_url = 'https://maps.googleapis.com/maps/api/place/autoComplete/json?types=establishment&input={}&key={}'.format(
    #     text,
    #     Config.get_env_var('GOOGLE_API_KEY'),
    # )
    r = requests.get(url=google_url)
    if r.status_code == 200:
        print(r.json())
        return r.json()
    raise ValueError('Unknown/Not Finished Error Occured: {}'.format(r.text))
# [END Search Google Places API]

# Geocode Google Place
# TODO: None
# [START Geocode Google Place]
def geocode_google_place(address):
    google_url = 'https://maps.googleapis.com/maps/api/geocode/json?address={}&sensor=false&key={}'.format(
        address,
        Config.get_env_var('GOOGLE_API_KEY'),
    )
    r = requests.get(url=google_url)
    if r.status_code == 200:
        print(r.json())
        return r.json()
    raise ValueError('Unknown/Not Finished Error Occured: {}'.format(r.text))
# [END Geocode Google Place]

# Parse Geo Code Location
# TODO: None
# [START Parse Geo Code Location]
def parse_google_geocode(data):
    street_number = None
    route = None
    locality = None
    region = None
    country = None
    postal_code = None
    location = None
    geocode = data['results'][0]
    for result in geocode['address_components']:
        if 'street_number' in result['types']:
            street_number = result['short_name']
        if 'route' in result['types']:
            route = result['short_name']
        if 'locality' in result['types']:
            locality = result['short_name']
        if 'administrative_area_level_1' in result['types']:
            region = result['short_name']
        if 'country' in result['types']:
            country = result['short_name']
        if 'postal_code' in result['types']:
            postal_code = result['short_name']
    address = {
        'street1': '{} {}'.format(street_number, route),
        'street2': None,
        'locality': locality,
        'region': region,
        'country': country,
        'postal': postal_code,
    }

    location = geocode['geometry']['location']
    address['location'] = location
    address['geohash'] = geohash.encode(location['lat'], location['lng'], precision=12)
    return address
# [END Parse Geo Code Location]

# Get Google Directions
# TODO: None
# [START Get Google Directions]
def get_google_directions(origin, destination, waypoints):
    new_waypoints = ''
    for waypoint in waypoints:
        new_waypoints += '{}'.format(waypoint) + '|'
    print(new_waypoints)
    google_url = 'https://maps.googleapis.com/maps/api/directions/json?origin={}&destination={}&key={}'.format(
    # google_url = 'https://maps.googleapis.com/maps/api/directions/json?origin={}&destination={}&waypoints=optimize:true|{}&key={}'.format(
        origin,
        destination,
        # new_waypoints,
        Config.get_env_var('GOOGLE_API_KEY'),
    )
    r = requests.get(url=google_url)
    if r.status_code == 200:
        print(r.json())
        return r.json()
    raise ValueError('Unknown Google Directions Error Occured: {}'.format(r.text))
# [END Get Google Directions]
