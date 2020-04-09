# xupply-admin/server/google/api.py

import logging

logger = logging.getLogger('xupply.google.api.py')

from flask import Blueprint, request, make_response, jsonify, json
from flask.views import MethodView

from server.utils.google.places.utils import (
    search_google_places,
    geocode_google_place,
    parse_google_geocode,
    get_google_directions,
    get_hospital_rank
)
from server.utils.firestore import verify_firebase_token
from server.account.model import XupplyAccountCode
from server.employee.model import XupplyEmployeeCode
from server.google import notifications

import time

google_blueprint = Blueprint('google', __name__)

# Account Code Send Email
# TODO: None
# [START Account Code Send Email]
class AccountCodeSendEmail(MethodView):
    def post(self):
        try:
            id_token = request.headers.get('Authorization').split(' ').pop()
            claims = verify_firebase_token(id_token)
            if not claims:
                responseObject = {
                    'status': 'failed',
                    'statusText': 'Invalid Token'
                }
                return make_response(jsonify(responseObject)), 403

            incoming = request.get_json()
            activation_code = incoming['activationCode']
            if not activation_code:
                responseObject = {
                    'status': 'failed',
                    'statusText': 'Invalid Request Parameters'
                }
                return make_response(jsonify(responseObject)), 400

            accountCode = XupplyAccountCode().dict_snapshot(snapshot=activation_code)
            data = {
                'to_name': accountCode.ownerName,
                'to_account_name': accountCode.accountName,
                'from_name': 'The Xupply Team',
                'activation_code': accountCode.activationCode,
            }
            clean_email = accountCode.email
            data['user_email'] = accountCode.email
            # notifications.account_code_email_notification_task.apply_async(kwargs=data)
            # notifications.account_code_email_notification_task(
            #     user_email=data['user_email'],
            #     to_name=data['to_name'],
            #     to_account_name=data['to_account_name'],
            #     from_name=data['from_name'],
            #     activation_code=data['activation_code']
            # )

            responseObject = {
                'status': 'success',
                'statusText': 'Account Code Email Successfully Sent'
            }
            return make_response(jsonify(responseObject)), 200

        except Exception as e:
            logger.error('Error on AccountCodeSendEmail.post; Error: %s', e)
            responseObject = {
                'status': 'failed',
                'statusText': str(e)
            }
            return make_response(jsonify(responseObject)), 403
# [END Account Code Send Email]

# Account Registration Send Email
# TODO: None
# [START Account Registration Send Email]
class AccountRegistrationSendEmail(MethodView):
    def post(self):
        try:
            id_token = request.headers.get('Authorization').split(' ').pop()
            claims = verify_firebase_token(id_token)
            if not claims:
                responseObject = {
                    'status': 'failed',
                    'statusText': 'Invalid Token'
                }
                return make_response(jsonify(responseObject)), 403

            incoming = request.get_json()
            activation_code = incoming['activationCode']
            if not activation_code:
                responseObject = {
                    'status': 'failed',
                    'statusText': 'Invalid Request Parameters'
                }
                return make_response(jsonify(responseObject)), 400

            accountCode = XupplyAccountCode().dict_snapshot(snapshot=activation_code)
            data = {
                'to_name': accountCode.ownerName,
                'to_account_name': accountCode.accountName,
                'from_name': 'The Xupply Team',
                'activation_code': accountCode.activationCode,
            }
            clean_email = accountCode.email
            data['user_email'] = accountCode.email
            # notifications.account_code_email_notification_task.apply_async(kwargs=data)
            notifications.account_registration_email_notification_task(
                user_email=data['user_email'],
                to_name=data['to_name'],
                to_account_name=data['to_account_name'],
                from_name=data['from_name']
            )

            responseObject = {
                'status': 'success',
                'statusText': 'Account Registration Email Successfully Sent'
            }
            return make_response(jsonify(responseObject)), 200

        except Exception as e:
            logger.error('Error on AccountRegistrationSendEmail.post; Error: %s', e)
            responseObject = {
                'status': 'failed',
                'statusText': str(e)
            }
            return make_response(jsonify(responseObject)), 403
# [END Account Registration Send Email]

# Employee Code Send Email
# TODO: None
# [START Employee Code Send Email]
class EmployeeCodeSendEmail(MethodView):
    def post(self):
        try:
            id_token = request.headers.get('Authorization').split(' ').pop()
            claims = verify_firebase_token(id_token)
            if not claims:
                responseObject = {
                    'status': 'failed',
                    'statusText': 'Invalid Token'
                }
                return make_response(jsonify(responseObject)), 403

            incoming = request.get_json()
            activation_code = incoming['activationCode']
            if not activation_code:
                responseObject = {
                    'status': 'failed',
                    'statusText': 'Invalid Request Parameters'
                }
                return make_response(jsonify(responseObject)), 400

            employeeCode = XupplyEmployeeCode().dict_snapshot(snapshot=activation_code)
            data = {
                'to_name': employeeCode.ownerName,
                'to_account_name': employeeCode.accountName,
                'from_name': 'The Xupply Team',
                'activation_code': employeeCode.activationCode,
            }
            data['user_email'] = employeeCode.email
            # notifications.employee_code_email_notification_task.apply_async(kwargs=data)
            notifications.employee_code_email_notification_task(
                user_email=data['user_email'],
                to_name=data['to_name'],
                to_account_name=data['to_account_name'],
                from_name=data['from_name'],
                activation_code=data['activation_code']
            )

            responseObject = {
                'status': 'success',
                'statusText': 'Employee Code Email Successfully Sent'
            }
            return make_response(jsonify(responseObject)), 200

        except Exception as e:
            logger.error('Error on EmployeeCodeSendEmail.post; Error: %s', e)
            responseObject = {
                'status': 'failed',
                'statusText': str(e)
            }
            return make_response(jsonify(responseObject)), 403
# [END Employee Code Send Email]

# Employee Registration Send Email
# TODO: None
# [START Employee Registration Send Email]
class EmployeeRegistrationSendEmail(MethodView):
    def post(self):
        try:
            id_token = request.headers.get('Authorization').split(' ').pop()
            claims = verify_firebase_token(id_token)
            if not claims:
                responseObject = {
                    'status': 'failed',
                    'statusText': 'Invalid Token'
                }
                return make_response(jsonify(responseObject)), 403

            incoming = request.get_json()
            activation_code = incoming['activationCode']
            if not activation_code:
                responseObject = {
                    'status': 'failed',
                    'statusText': 'Invalid Request Parameters'
                }
                return make_response(jsonify(responseObject)), 400

            employeeCode = XupplyEmployeeCode().dict_snapshot(snapshot=activation_code)
            data = {
                'to_name': employeeCode.ownerName,
                'to_account_name': employeeCode.accountName,
                'from_name': 'The Xupply Team',
                'activation_code': employeeCode.activationCode,
            }
            data['user_email'] = employeeCode.email
            # notifications.employee_code_email_notification_task.apply_async(kwargs=data)
            # notifications.employee_code_email_notification_task(
            #     user_email=data['user_email'],
            #     to_name=data['to_name'],
            #     to_account_name=data['to_account_name'],
            #     from_name=data['from_name'],
            #     activation_code=data['activation_code']
            # )

            responseObject = {
                'status': 'success',
                'statusText': 'Employee Registration Email Successfully Sent'
            }
            return make_response(jsonify(responseObject)), 200

        except Exception as e:
            logger.error('Error on EmployeeRegistrationSendEmail.post; Error: %s', e)
            responseObject = {
                'status': 'failed',
                'statusText': str(e)
            }
            return make_response(jsonify(responseObject)), 403
# [END Employee Registration Send Email]

# Search Google Places
# TODO: None
# [START Search Google Places]
class SearchGooglePlaces(MethodView):
    def get(self):
        try:
            incoming = request.args
            query = incoming['query']
            type = incoming['type']
            places = search_google_places(type, query)
            responseObject = {
                'status': 'success',
                'statusText': 'Searched Places',
                'data': places['predictions']
            }
            return make_response(jsonify(responseObject)), 200

        except Exception as e:
            logger.error('Error SearchGooglePlaces.post; Error: %s', e)
            responseObject = {
                'status': 'failed',
                'statusText': str(e)
            }
            return make_response(jsonify(responseObject)), 403
# [END Search Google Places]

# Geocode Google Place
# TODO: None
# [START Geocode Google Place]
class GeocodeGooglePlace(MethodView):
    def get(self):
        try:
            # id_token = request.headers.get('Authorization').split(' ').pop()
            # claims = verify_firebase_token(id_token)
            # if not claims:
            #     responseObject = {
            #         'status': 'failed',
            #         'statusText': 'Invalid Token'
            #     }
            #     return make_response(jsonify(responseObject)), 403
            incoming = request.args
            place = incoming['place']
            result = geocode_google_place(place)
            address = parse_google_geocode(result)
            responseObject = {
                'status': 'success',
                'statusText': 'Geocoded Place',
                'data': address
            }
            return make_response(jsonify(responseObject)), 200

        except Exception as e:
            logger.error('Error GeocodeGooglePlace.post; Error: %s', e)
            responseObject = {
                'status': 'failed',
                'statusText': str(e)
            }
            return make_response(jsonify(responseObject)), 403
# [END Geocode Google Place]

# Get Google Directions
# TODO: None
# [START Get Google Directions]
class DirectionsGoogleGet(MethodView):
    def get(self):
        try:
            id_token = request.headers.get('Authorization').split(' ').pop()
            claims = verify_firebase_token(id_token)
            if not claims:
                responseObject = {
                    'status': 'failed',
                    'statusText': 'Invalid Token'
                }
                return make_response(jsonify(responseObject)), 403
            incoming = request.args
            print(incoming)
            accountID = incoming['accountID']
            origin = incoming['origin']
            destination = incoming['destination']
            waypoints = incoming.getlist('waypoints[]')
            result = get_google_directions(origin, destination, waypoints)
            responseObject = {
                'status': 'success',
                'statusText': 'Google Directions',
                'data': result
            }
            return make_response(jsonify(responseObject)), 200

        except Exception as e:
            logger.error('Error DirectionsGoogleGet.post; Error: %s', e)
            responseObject = {
                'status': 'failed',
                'statusText': str(e)
            }
            return make_response(jsonify(responseObject)), 403
# [END Get Google Directions]

# Get Hospital Rank
# TODO: None
# [START Get Hospital Rank]
class RankHospitalGet(MethodView):
    def get(self):
        try:
            id_token = request.headers.get('Authorization').split(' ').pop()
            claims = verify_firebase_token(id_token)
            if not claims:
                responseObject = {
                    'status': 'failed',
                    'statusText': 'Invalid Token'
                }
                return make_response(jsonify(responseObject)), 403
            incoming = request.args
            print(incoming)
            accountID = incoming['accountID']
            address = incoming['address']
            result = get_hospital_rank(addresss)
            responseObject = {
                'status': 'success',
                'statusText': 'Google Directions',
                'data': result
            }
            return make_response(jsonify(responseObject)), 200

        except Exception as e:
            logger.error('Error DirectionsGoogleGet.post; Error: %s', e)
            responseObject = {
                'status': 'failed',
                'statusText': str(e)
            }
            return make_response(jsonify(responseObject)), 403
# [END Get Hospital Rank]

# Define API resources
send_account_code = AccountCodeSendEmail.as_view('send_account_code')
send_account_registration = AccountRegistrationSendEmail.as_view('send_account_registration')
send_employee_code = EmployeeCodeSendEmail.as_view('send_employee_code')
send_employee_registration = EmployeeRegistrationSendEmail.as_view('send_employee_registration')
google_places_search = SearchGooglePlaces.as_view('google_places_search')
google_place_geocode = GeocodeGooglePlace.as_view('google_place_geocode')
google_get_directions = DirectionsGoogleGet.as_view('google_get_directions')
hospital_get_rank = RankHospitalGet.as_view('hospital_get_rank')
# Specify API Version

# Add rules for endpoints
google_blueprint.add_url_rule(
    '/api/google/v1/account/activationCode/send',
    view_func=send_account_code,
    methods=['POST']
)
google_blueprint.add_url_rule(
    '/api/google/v1/account/registration/send',
    view_func=send_account_registration,
    methods=['POST']
)
google_blueprint.add_url_rule(
    '/api/google/v1/employee/activationCode/send',
    view_func=send_employee_code,
    methods=['POST']
)
google_blueprint.add_url_rule(
    '/api/google/v1/employee/registration/send',
    view_func=send_employee_registration,
    methods=['POST']
)
google_blueprint.add_url_rule(
    '/api/google/v1/places/search',
    view_func=google_places_search,
    methods=['GET']
)
google_blueprint.add_url_rule(
    '/api/google/v1/places/geocode',
    view_func=google_place_geocode,
    methods=['GET']
)
google_blueprint.add_url_rule(
    '/api/google/v1/directions',
    view_func=google_get_directions,
    methods=['GET']
)
google_blueprint.add_url_rule(
    '/api/google/v1/hospital/rank',
    view_func=google_get_directions,
    methods=['GET']
)
