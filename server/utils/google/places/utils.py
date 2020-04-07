# server/utils/google/places/utils.py
import logging

# Create Logger
logger = logging.getLogger('tabs.utils.google.places.utils.py')

from datetime import datetime
import time
import json
import os
import re
import requests
import geohash
from server.config import Config
from bs4 import BeautifulSoup

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
    if r.status_code != 200:
        raise ValueError('Unknown/Not Finished Error Occured: {}'.format(r.text))
    return r.json()
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
    if r.status_code != 200:
        raise ValueError('Unknown/Not Finished Error Occured: {}'.format(r.text))
    return r.json()
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
    county = None
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
        if 'administrative_area_level_2' in result['types']:
            county = result['short_name']
    address = {
        'street1': '{} {}'.format(street_number, route),
        'street2': None,
        'locality': locality,
        'region': region,
        'country': country,
        'county': county,
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

# Get Population Density
# TODO: None
# [START Get Population Density]
def get_pop_density(state):
    zip_url = 'http://zipatlas.com/us/{}/city-comparison/median-age.htm'.format(
        state
    )
    r = requests.get(url=zip_url)
    if r.status_code != 200:
        raise ValueError('Unknown Population Density Error Occured: {}'.format(r.text))
    return r.json()
# [END Get Population Density]

def get_start(s):
    i = 0
    for si in s:
        print(si)
        if si == b'National Rank':
            return i
        i += 1
def get_end(s):
    i = 0
    for si in s:
        print(si)
        if si == b'1' and s[i+1] == b'-':
            return i
        i += 1

# Get Population Median Age
# TODO: None
# [START Get Population Median Age]
def get_pop_age(state, county):
    zip_url = 'http://zipatlas.com/us/{}/city-comparison/median-age.htm'.format(
        state
    )
    sentences = soupit(zip_url)
    start = get_start(sentences)
    end = get_end(sentences)
    print(start)
    print(end)
    sentences = sentences[start:end]
    list_of_groups = zip(*(iter(sentences),) * 8)
    print(list_of_groups)
    for group in list_of_groups:
        print(group)
    # print(r)
    # print(r.text)

    raise ValueError('Unknown Population Median Age Error Occured: {}'.format(r.text))
# [END Get Population Median Age]

# Get Hospital Rank
# TODO: None
# [START Get Hospital Rank]
def get_hospital_rank(address):
    # Get County from Address
    geocode = geocode_google_place(address)
    geocode = parse_google_geocode(geocode)
    # print(geocode['county'])
    # Get Hospital Stats (Beds)
    # beds = '127'
    # Get County Pop Density
    print(geocode['locality'])
    print(geocode['region'])
    print(geocode['county'])
    result = get_pop_age(geocode['region'], geocode['county'])
    print(result)
    pop_density = '78.1'
    # Get County Pop Media Age
    median_age = '78.1'
    # Get County Cases

    # https://data.cdc.gov/resource/hc4f-j6nb.json
    # https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_deaths_US.csv
    # https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_US.csv
    # https://chronicdata.cdc.gov/500-Cities/500-Cities-Local-Data-for-Better-Health-2019-relea/6vp6-wxuq
# [END Get Hospital Rank]

import gensim

def sock(url):
    user_agent = 'Mozilla/5.0 (Windows NT 6.1; Win64; x64)'
    headers = {
        'User-Agent': user_agent
    }
    r = requests.get(url, headers=headers)
    if r.status_code != 200:
        print(r.text)
        raise Exception('Could not authenticate!')
    return r.text

def sent_to_words(sentences):
    try:
        for sentence in sentences:
            yield(gensim.utils.simple_preprocess(str(sentence), deacc=True))  # deacc=True removes punctuations
    except Exception as e:
        logger.error('Error lemmitization; Error: %s', e)

def lemmatization(texts, allowed_postags=['NOUN', 'ADJ', 'VERB', 'ADV']):
    try:
        """https://spacy.io/api/annotation"""
        texts_out = []
        for sent in texts:
            doc = nlp(" ".join(sent))
            texts_out.append(" ".join([token.lemma_ if token.lemma_ not in ['-PRON-'] else '' for token in doc if token.pos_ in allowed_postags]))
        return texts_out
    except Exception as e:
        logger.error('Error lemmitization; Error: %s', e)

def soupit(url):
    try:
        socket = sock(url)
        soup = BeautifulSoup(socket,'html.parser')
        sentences = ([s.encode('ascii','ignore') for s in soup.stripped_strings])
        return sentences
    except Exception as e:
        print(e)

def cleanit(sentences):
    try:
        mytext_2 = list(sent_to_words(sentences))

        mytext_3 = lemmatization(mytext_2, allowed_postags=['NOUN', 'ADJ', 'VERB', 'ADV'])

        return mytext_3
    except Exception as e:
        print(e)
