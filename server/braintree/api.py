# samy/server/braintree/api.py

import logging

logger = logging.getLogger('samy.server.braintree/api.py')

from flask import Blueprint, request, make_response, jsonify, json
from flask.views import MethodView

from server.utils.firestore import verify_firebase_token
# from server.account import notifications

from server.account.model import XupplyAccount
# from server.payment.model import XupplyPayment
# from server.transaction.model import XupplyTransaction

from server.utils.models import XupplyReferences

from server.utils.braintree.client import BraintreeClient
from server.utils.braintree.objects.customer import XupplyBraintreeCustomer
from server.utils.braintree.objects.payment import XupplyBraintreePayment
from server.utils.braintree.objects.transaction import XupplyBraintreeTransaction

import random
from server.config import Config
from google.cloud import firestore

import uuid
import time
import json
from datetime import datetime

braintree_blueprint = Blueprint('braintree', __name__)

# Braintree Token
# TODO: None
# [START Braintree Token]
class BraintreeToken(MethodView):
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
            accountID = incoming['accountID']
            merchantHash = incoming['merchantHash']
            print(accountID)
            print(merchantHash)
            gateway = BraintreeClient().gateway
            bt_token = XupplyBraintreeCustomer(
                gateway=gateway
            ).create_token(accountID=merchantHash)
            logger.info('Braintree Token ~ User: %s', claims['user_id'])
            data = {
                'btToken': bt_token,
            }
            responseObject = {
                'status': 'success',
                'statusText': 'Braintree Token',
                'data': data,
            }
            return make_response(jsonify(responseObject)), 200

        except Exception as e:
            logger.error('Error on BraintreeToken.post; Error: %s', e)
            responseObject = {
                'status': 'failed',
                'statusText': str(e)
            }
            return make_response(jsonify(responseObject)), 403

# [END Braintree Token]

@firestore.transactional
def create_customer_transaction(transaction, account_ref, account_object, merchantHash):
    try:

        old_snapshot = account_ref.get(transaction=transaction)
        old_account_object = XupplyAccount().dict_snapshot(snapshot=old_snapshot.to_dict())

        if not old_account_object.btId:

            account_object.btId = merchantHash
            account_object.btSyncTime = datetime.utcnow()
            account_object.updatedTime = datetime.utcnow()

            transaction.update(account_ref, account_object.to_any_object())

    except Exception as e:
        logger.error("Error on Braintree Customer Create Transaction; Error: %s", e)
        raise ValueError(e)

# Braintree Customer Create Celery Task
# TODO: None
# [START Braintree Customer Create Celery Task]
# @celery.task()
def create_customer_task(email=None, employeeID=None, accountID=None, account_object=None):
    try:
        merchant_result = None
        start_time = time.time()
        logger.info('Starting Braintree Customer {} Create'.format(account_object.accountID))
        legal_name = account_object.firstName + ' ' + account_object.lastName
        email = email
        phone = account_object.phoneNumber

        gateway = BraintreeClient().gateway
        merchant_object = XupplyBraintreeCustomer(
            first_name=account_object.firstName,
            last_name=account_object.lastName,
            email=email,
            phone=phone,
            gateway=gateway
        )
        # Fix this!! Should use accountID!
        merchant_result = merchant_object.create()

        end_time = time.time()
        logger.info('Elapsed Time: %s seconds', (end_time - start_time))

        return merchant_result

    except Exception as e:
        logger.error("Error on Braintree Customer Create Task; Error: %s", e)
        raise ValueError(e)
# [END Braintree Customer Create Celery Task]

# Braintree Customer
# TODO
# [START Braintree Customer]
class BraintreeCustomer(MethodView):
    def post(self):
        try:
            claims = {}
            id_token = request.headers.get('Authorization').split(' ').pop()
            claims = verify_firebase_token(id_token)
            if not claims:
                responseObject = {
                    'status': 'failed',
                    'statusText': 'Invalid Token'
                }
                return make_response(jsonify(responseObject)), 403

            incoming = request.get_json()
            print(incoming)
            accountID = incoming['accountID']
            employeeID = claims['user_id']
            email = claims['email']

            delta_server = XupplyReferences()
            transaction = delta_server.transaction_ref
            account_ref = XupplyReferences().accounts_ref.document(accountID)
            account_doc = account_ref.get()
            account_dict = account_doc.to_dict()
            if not account_dict:
                responseObject = {
                    'status': 'failed',
                    'statusText': 'Invalid Account Dict'
                }
                return make_response(jsonify(responseObject)), 403

            account_object = XupplyAccount().dict_snapshot(snapshot=account_doc.to_dict())

            print('HERE')
            merchant_result = create_customer_task(
                email=email,
                employeeID=employeeID,
                accountID=accountID,
                account_object=account_object
            )

            print(merchant_result.is_success)
            print(merchant_result.customer.id)
            if merchant_result.is_success == True:
                merchantHash = merchant_result.customer.id

                logger.info('Create Braintree Customer Success: {}'.format(merchantHash))
                create_customer_transaction(
                    transaction,
                    account_ref,
                    account_object,
                    merchantHash
                )

                data = {
                    'merchantHash': merchantHash
                }
                responseObject = {
                    'status': 'success',
                    'statusText': 'Braintree Customer Created',
                    'data': data,
                }
                return make_response(jsonify(responseObject)), 200
            else:
                for error in merchant_result.errors.deep_errors:
                    error_code = None
                    error_message = None
                    error_code = error.code
                    error_message = error.message
                    responseObject = {
                        'status': error_code,
                        'statusText': error_message
                    }
                    return make_response(jsonify(responseObject)), 400

        except Exception as e:
            logger.error('Error on BraintreeCustomer.post; Error: %s', e)
            responseObject = {
                'status': 'failed',
                'statusText': str(e)
            }
            return make_response(jsonify(responseObject)), 403
# [END Braintree Customer]


@firestore.transactional
def create_payment_transaction(transaction, payment_ref, payment_object, paymentHash):
    try:

        payment_object.paymentHash = paymentHash
        payment_object.paymentHash = payment_ref.id
        payment_object.active = True
        payment_object.isDefault = True
        payment_object.createdTime = datetime.utcnow()
        payment_object.updatedTime = datetime.utcnow()
        payment_object.syncTime = datetime.utcnow()
        payment_object.syncToken = 1

        transaction.set(payment_ref, payment_object.to_any_object())

    except Exception as e:
        logger.error("Error on Braintree Payment Create Transaction; Error: %s", e)
        raise ValueError(e)

# Braintree Payment Create Celery Task
# TODO: None
# [START Braintree Payment Create Celery Task]
# @celery.task()
def create_payment_task(employeeID=None, accountID=None, nonce=None, payment_object=None, merchantHash=None):
    try:
        merchant_result = None
        start_time = time.time()
        logger.info('Create Payment Task')

        gateway = BraintreeClient().gateway
        merchant_object = XupplyBraintreePayment(
            gateway=gateway,
            merchantHash=merchantHash
        )

        merchant_result = merchant_object.create(nonce=nonce)

        end_time = time.time()
        logger.info('Elapsed Time: %s seconds', (end_time - start_time))

        return merchant_result

    except Exception as e:
        logger.error("Error on Braintree Payment Create Task; Error: %s", e)
        raise ValueError(e)
# [END Braintree Payment Create Celery Task]

# Braintree Payment
# TODO
# [START Braintree Payment]
class BraintreePayment(MethodView):
    def post(self):
        try:
            claims = {}
            id_token = request.headers.get('Authorization').split(' ').pop()
            claims = verify_firebase_token(id_token)
            if not claims:
                responseObject = {
                    'status': 'failed',
                    'statusText': 'Invalid Token'
                }
                return make_response(jsonify(responseObject)), 403

            incoming = request.get_json()
            print(incoming)
            accountID = incoming['accountID']
            merchantHash = incoming['merchantHash']
            nonce = incoming['nonce']
            paymentInfo = incoming['paymentInfo']
            employeeID = claims['user_id']

            delta_server = XupplyReferences()
            transaction = delta_server.transaction_ref
            account_ref = XupplyReferences().accounts_ref.document(accountID)
            payment_ref = account_ref.collection('Payments').document()
            payment_object = XupplyPayment().dict_snapshot(snapshot=paymentInfo)

            merchant_result = create_payment_task(
                employeeID=employeeID,
                accountID=accountID,
                nonce=nonce,
                payment_object=payment_object,
                merchantHash=merchantHash,
            )

            if merchant_result.is_success == True:
                paymentHash = merchant_result.payment_method.token
                logger.info('Create Braintree Payment Success: {}'.format(paymentHash))
                create_payment_transaction(
                    transaction,
                    payment_ref,
                    payment_object,
                    paymentHash
                )

                data = {
                    'paymentHash': paymentHash
                }
                responseObject = {
                    'status': 'success',
                    'statusText': 'Dwolla Payment Created',
                    'data': data,
                }
                return make_response(jsonify(responseObject)), 200

            else:
                logger.error('Create Braintree Payment Failure: {}'.format(merchant_result.errors.deep_errors))
                for error in merchant_result.errors.deep_errors:
                    error_code = None
                    error_message = None
                    error_code = error.code
                    error_message = error.message
                    responseObject = {
                        'status': error_code,
                        'statusText': error_message
                    }
                    return make_response(jsonify(responseObject)), 400

        except Exception as e:
            logger.error('Error on BraintreePayment.post; Error: %s', e)
            responseObject = {
                'status': 'failed',
                'statusText': str(e)
            }
            return make_response(jsonify(responseObject)), 403
# [END Braintree Payment]


@firestore.transactional
def create_transaction_transaction(transaction, transaction_ref, transaction_object, transactionHash):
    try:

        old_snapshot = transaction_ref.get(transaction=transaction)
        old_transaction_object = XupplyTransaction().dict_snapshot(snapshot=old_snapshot.to_dict())

        # if old_transaction_object.syncToken != transaction_object.syncToken:
        #     raise ValueError('Error Syncing Establishment to Dwolla: Token Error')

        if not old_transaction_object.hash:

            transaction_object.hash = transactionHash
            transaction_object.active = True
            # transaction_object.syncTime = datetime.now()
            # transaction_object.syncToken = old_customer_object.syncToken + 1

            transaction.update(transaction_ref, transaction_object.to_any_object())

    except Exception as e:
        logger.error("Error on Braintree Transaction Create Transaction; Error: %s", e)
        raise ValueError(e)

# Braintree Transaction Create Celery Task
# TODO: None
# [START Braintree Transaction Create Celery Task]
# @celery.task()
def create_transaction_task(employeeID=None, accountID=None, transaction_object=None, paymentHash=None):
    try:
        merchant_result = None
        start_time = time.time()

        gateway = BraintreeClient().gateway
        merchant_object = XupplyBraintreeTransaction(
            gateway=gateway,
            paymentHash=paymentHash
        )

        merchant_result = merchant_object.submit(amount=transaction_object.amount)

        end_time = time.time()
        logger.info('Elapsed Time: %s seconds', (end_time - start_time))

        return merchant_result

    except Exception as e:
        logger.error("Error on Braintree Transaction Create Task; Error: %s", e)
        raise ValueError(e)
# [END Braintree Transaction Create Celery Task]

# Braintree Transaction
# TODO
# [START Braintree Transaction]
class BraintreeTransaction(MethodView):
    def post(self):
        try:
            claims = {}
            employeeID = 'TestUser'
            # id_token = request.headers.get('Authorization').split(' ').pop()
            # claims = verify_firebase_token(id_token)
            # if not claims:
            #     responseObject = {
            #         'status': 'failed',
            #         'statusText': 'Invalid Token'
            #     }
            #     return make_response(jsonify(responseObject)), 403

            incoming = request.get_json()
            print(incoming)
            accountID = incoming['accountID']
            paymentHash = incoming['paymentHash']
            transactionId = incoming['transactionId']

            delta_server = XupplyReferences()
            transaction = delta_server.transaction_ref
            account_ref = XupplyReferences().accounts_ref.document(accountID)
            transaction_ref = account_ref.collection('Transactions').document(transactionId)
            transaction_doc = transaction_ref.get()
            transaction_object = XupplyTransaction().dict_snapshot(snapshot=transaction_doc.to_dict())

            merchant_result = create_transaction_task(
                employeeID=employeeID,
                accountID=accountID,
                transaction_object=transaction_object,
                paymentHash=paymentHash,
            )
            print(merchant_result.is_success)

            if merchant_result.is_success == True:
                print('True')
                print(merchant_result)
                print(merchant_result.transaction)
                print(merchant_result.transaction.id)
                transactionHash = merchant_result.transaction.id
                logger.info('Create Braintree Payment Success: {}'.format(transactionHash))
                create_transaction_transaction(
                    transaction,
                    transaction_ref,
                    transaction_object,
                    transactionHash
                )

                data = {
                    'transactionHash': transactionHash
                }
                responseObject = {
                    'status': 'success',
                    'statusText': 'Braintree Transaction Created',
                    'data': data,
                }
                return make_response(jsonify(responseObject)), 200

            else:
                print('False')
                # For Handling Braintree
                print(merchant_result.errors.deep_errors)
                for error in merchant_result.errors.deep_errors:
                    error_code = None
                    error_message = None
                    error_code = error.code
                    error_message = error.message
                    responseObject = {
                        'status': error_code,
                        'statusText': error_message
                    }
                    return make_response(jsonify(responseObject)), 400

        except Exception as e:
            logger.error('Error on BraintreeTransaction.post; Error: %s', e)
            responseObject = {
                'status': 'failed',
                'statusText': str(e)
            }
            return make_response(jsonify(responseObject)), 403
# [END Braintree Transaction]

# Transaction API resources
#
#

braintree_token = BraintreeToken.as_view('braintree_token')
braintree_customer = BraintreeCustomer.as_view('braintree_customer')
braintree_payment = BraintreePayment.as_view('braintree_payment')
braintree_transaction = BraintreeTransaction.as_view('braintree_transaction')

# Specify API Version

# Transaction Endpoints
#
#
braintree_blueprint.add_url_rule(
    '/api/v1/braintree/token',
    view_func=braintree_token,
    methods=['POST']
)
braintree_blueprint.add_url_rule(
    '/api/v1/braintree/customer',
    view_func=braintree_customer,
    methods=['POST']
)
braintree_blueprint.add_url_rule(
    '/api/v1/braintree/payment',
    view_func=braintree_payment,
    methods=['POST']
)
braintree_blueprint.add_url_rule(
    '/api/v1/braintree/transaction',
    view_func=braintree_transaction,
    methods=['POST']
)
