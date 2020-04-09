# samy/server/dwolla/api.py

import logging

logger = logging.getLogger('samy.server.dwolla/api.py')

from flask import Blueprint, request, make_response, jsonify, json
from flask.views import MethodView

from server.utils.firestore import verify_firebase_token
# from server.account import notifications

from server.account.model import XupplyAccount
# from server.payment.model import XupplyPayment
# from server.transaction.model import XupplyTransaction

from server.utils.models import XupplyReferences

from server.utils.dwolla.client import DwollaClient
from server.utils.dwolla.objects.customer import XupplyDwollaCustomer
from server.utils.dwolla.objects.payment import XupplyDwollaPayment
from server.utils.dwolla.objects.transfer import XupplyDwollaTransfer

import random
from server.config import Config
from google.cloud import firestore

import uuid
import time
import json
from datetime import datetime

dwolla_blueprint = Blueprint('dwolla', __name__)

# Dwolla Token
# TODO: None
# [START Dwolla Token]
class DwollaToken(MethodView):
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
            gateway = DwollaClient().gateway
            bt_token = XupplyDwollaCustomer(
                gateway=gateway
            ).create_token(accountID=merchantHash)
            logger.info('Dwolla Token ~ User: %s', claims['user_id'])
            data = {
                'btToken': bt_token,
            }
            responseObject = {
                'status': 'success',
                'statusText': 'Dwolla Token',
                'data': data,
            }
            return make_response(jsonify(responseObject)), 200

        except Exception as e:
            logger.error('Error on DwollaToken.post; Error: %s', e)
            responseObject = {
                'status': 'failed',
                'statusText': str(e)
            }
            return make_response(jsonify(responseObject)), 403

# [END Dwolla Token]

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
        logger.error("Error on Dwolla Customer Create Transaction; Error: %s", e)
        raise ValueError(e)

# Dwolla Customer Create Celery Task
# TODO: None
# [START Dwolla Customer Create Celery Task]
# @celery.task()
def create_customer_task(email=None, employeeID=None, accountID=None, account_object=None):
    try:
        merchant_result = None
        start_time = time.time()
        logger.info('Starting Dwolla Customer {} Create'.format(account_object.accountID))
        legal_name = account_object.firstName + ' ' + account_object.lastName
        email = email
        phone = account_object.phoneNumber

        gateway = DwollaClient().gateway
        merchant_object = XupplyDwollaCustomer(
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
        logger.error("Error on Dwolla Customer Create Task; Error: %s", e)
        raise ValueError(e)
# [END Dwolla Customer Create Celery Task]

# Dwolla Customer
# TODO
# [START Dwolla Customer]
class DwollaCustomer(MethodView):
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

                logger.info('Create Dwolla Customer Success: {}'.format(merchantHash))
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
                    'statusText': 'Dwolla Customer Created',
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
            logger.error('Error on DwollaCustomer.post; Error: %s', e)
            responseObject = {
                'status': 'failed',
                'statusText': str(e)
            }
            return make_response(jsonify(responseObject)), 403
# [END Dwolla Customer]


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
        logger.error("Error on Dwolla Payment Create Transaction; Error: %s", e)
        raise ValueError(e)

# Dwolla Payment Create Celery Task
# TODO: None
# [START Dwolla Payment Create Celery Task]
# @celery.task()
def create_payment_task(employeeID=None, accountID=None, nonce=None, payment_object=None, merchantHash=None):
    try:
        merchant_result = None
        start_time = time.time()
        logger.info('Create Payment Task')

        gateway = DwollaClient().gateway
        merchant_object = XupplyDwollaPayment(
            gateway=gateway,
            merchantHash=merchantHash
        )

        merchant_result = merchant_object.create(nonce=nonce)

        end_time = time.time()
        logger.info('Elapsed Time: %s seconds', (end_time - start_time))

        return merchant_result

    except Exception as e:
        logger.error("Error on Dwolla Payment Create Task; Error: %s", e)
        raise ValueError(e)
# [END Dwolla Payment Create Celery Task]

# Dwolla Payment
# TODO
# [START Dwolla Payment]
class DwollaPayment(MethodView):
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
                logger.info('Create Dwolla Payment Success: {}'.format(paymentHash))
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
                logger.error('Create Dwolla Payment Failure: {}'.format(merchant_result.errors.deep_errors))
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
            logger.error('Error on DwollaPayment.post; Error: %s', e)
            responseObject = {
                'status': 'failed',
                'statusText': str(e)
            }
            return make_response(jsonify(responseObject)), 403
# [END Dwolla Payment]


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
        logger.error("Error on Dwolla Transaction Create Transaction; Error: %s", e)
        raise ValueError(e)

# Dwolla Transaction Create Celery Task
# TODO: None
# [START Dwolla Transaction Create Celery Task]
# @celery.task()
def create_transaction_task(employeeID=None, accountID=None, transaction_object=None, paymentHash=None):
    try:
        merchant_result = None
        start_time = time.time()

        gateway = DwollaClient().gateway
        merchant_object = XupplyDwollaTransaction(
            gateway=gateway,
            paymentHash=paymentHash
        )

        merchant_result = merchant_object.submit(amount=transaction_object.amount)

        end_time = time.time()
        logger.info('Elapsed Time: %s seconds', (end_time - start_time))

        return merchant_result

    except Exception as e:
        logger.error("Error on Dwolla Transaction Create Task; Error: %s", e)
        raise ValueError(e)
# [END Dwolla Transaction Create Celery Task]

# Dwolla Transaction
# TODO
# [START Dwolla Transaction]
class DwollaTransaction(MethodView):
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
            transactionID = incoming['transactionID']

            delta_server = XupplyReferences()
            transaction = delta_server.transaction_ref
            account_ref = XupplyReferences().accounts_ref.document(accountID)
            transaction_ref = account_ref.collection('Transactions').document(transactionID)
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
                logger.info('Create Dwolla Payment Success: {}'.format(transactionHash))
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
                    'statusText': 'Dwolla Transaction Created',
                    'data': data,
                }
                return make_response(jsonify(responseObject)), 200

            else:
                print('False')
                # For Handling Dwolla
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
            logger.error('Error on DwollaTransaction.post; Error: %s', e)
            responseObject = {
                'status': 'failed',
                'statusText': str(e)
            }
            return make_response(jsonify(responseObject)), 403

# [END Dwolla Transaction]

# Dwolla Async Tab
# TODO
# [START Dwolla Async Tab]
class DwollaAsyncTab(MethodView):
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
            accountID = incoming['accountID']
            merchantHash = incoming['merchantHash']
            tabInfo = incoming['tabInfo']

            tab = XupplyTab().dict_snapshot(snapshot=tabInfo)

            gateway = DwollaClient().gateway
            merchant_object = XupplyDwollaTransaction(
                tabId=tab.tabId,
                gateway=gateway
            )

            merchant_result = merchant_object.search(
                merchantHash=merchantHash
            )
            bt_transactionIDs = []
            for transaction in merchant_result.items:
                print(transaction)
                print(error)
                bt_transactionIDs.append(transaction.id)

            print(bt_transactionIDs)

            for transaction in tab.transactions:
                if transaction.hash in bt_transactionIDs:
                    bt_transactionIDs.remove(transaction.hash)

            print(bt_transactionIDs)

            # pay_tab_items(
            #     transaction=None,
            #     employeeID=None,
            #     account_ref=None,
            #     tab_ref=None,
            #     pos_client=None,
            #     tab_object=None,
            #     items=None,
            # )

            # x = False
            # if x == True:
            #
            #
            #     data = {
            #         'transactionHash': transactionHash
            #     }
            #     responseObject = {
            #         'status': 'success',
            #         'statusText': 'Dwolla Transaction Created',
            #         'data': data,
            #     }
            #     return make_response(jsonify(responseObject)), 200
            #
            # else:
            #     print('False')
            #     # For Handling Dwolla
            #     print(merchant_result.errors.deep_errors)
            #     for error in merchant_result.errors.deep_errors:
            #         error_code = None
            #         error_message = None
            #         error_code = error.code
            #         error_message = error.message
            #         responseObject = {
            #             'status': error_code,
            #             'statusText': error_message
            #         }
            #         return make_response(jsonify(responseObject)), 400

        except Exception as e:
            logger.error('Error on DwollaAsyncTab.post; Error: %s', e)
            responseObject = {
                'status': 'failed',
                'statusText': str(e)
            }
            return make_response(jsonify(responseObject)), 403

# [END Dwolla Async Tab]

# Transaction API resources
#
#

dwolla_token = DwollaToken.as_view('dwolla_token')
dwolla_customer = DwollaCustomer.as_view('dwolla_customer')
dwolla_payment = DwollaPayment.as_view('dwolla_payment')
dwolla_transaction = DwollaTransaction.as_view('dwolla_transaction')
dwolla_sync_tab = DwollaAsyncTab.as_view('dwolla_sync_tab')

# Specify API Version

# Transaction Endpoints
#
#
dwolla_blueprint.add_url_rule(
    '/api/v1/dwolla/token',
    view_func=dwolla_token,
    methods=['POST']
)
dwolla_blueprint.add_url_rule(
    '/api/v1/dwolla/customer',
    view_func=dwolla_customer,
    methods=['POST']
)
dwolla_blueprint.add_url_rule(
    '/api/v1/dwolla/payment',
    view_func=dwolla_payment,
    methods=['POST']
)
dwolla_blueprint.add_url_rule(
    '/api/v1/dwolla/transaction',
    view_func=dwolla_transaction,
    methods=['POST']
)
dwolla_blueprint.add_url_rule(
    '/api/v1/dwolla/sync/tab',
    view_func=dwolla_sync_tab,
    methods=['POST']
)
