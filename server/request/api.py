# xupply-admin/server/request/api.py

import logging

logger = logging.getLogger('xupply.request.api.py')

from flask import Blueprint, request, make_response, jsonify, json
from flask.views import MethodView

from server.utils.firestore import verify_firebase_token

import time

request_blueprint = Blueprint('request', __name__)

# Request Match Cloud
# TODO: None
# [START Request Match Cloud]
class RequestCloudMatch(MethodView):
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
            request_info = incoming['requestInfo']
            if not activation_code:
                responseObject = {
                    'status': 'failed',
                    'statusText': 'Invalid Request Parameters'
                }
                return make_response(jsonify(responseObject)), 400



            responseObject = {
                'status': 'success',
                'statusText': 'Request Cloud Match Received'
            }
            return make_response(jsonify(responseObject)), 200

        except Exception as e:
            logger.error('Error on RequestCloudMatch.post; Error: %s', e)
            responseObject = {
                'status': 'failed',
                'statusText': str(e)
            }
            return make_response(jsonify(responseObject)), 403
# [END Request Match Cloud]

# Define API resources
match_cloud_request = RequestCloudMatch.as_view('match_cloud_request')
# Specify API Version

# Add rules for endpoints
request_blueprint.add_url_rule(
    '/api/request/v1/cloud',
    view_func=match_cloud_request,
    methods=['POST']
)
