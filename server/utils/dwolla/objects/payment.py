# xupply/server/utils/dwolla/objects/payment.py

import logging

logger = logging.getLogger('xupply.server.utils.dwolla.objects.payment.py')

import json

class DwollaPayResult:
    def __init__(self, id=None):
        self.id = id

class DwollaPaymentResult:
    def __init__(self,
        is_success=None,
        errors=None,
        id=None
    ):
        self.is_success = is_success
        self.errors = errors
        self.payment = DwollaPayResult(id=id)

class XupplyDwollaPayment(object):

    def __init__(self,
                 merchantHash=None,
                 app_token=None):

        self.app_token = app_token
        if not self.app_token:
            error = 'Invalid Dwolla App Token Set {}'.format(self.app_token)
            logger.error(error)
            raise ValueError(error)

        self.merchantHash = merchantHash
        if not self.merchantHash:
            error = 'Invalid Dwolla Mechant Hash Set {}'.format(self.merchantHash)
            logger.error(error)
            raise ValueError(error)

    def build_url(self, type, id, sub_type, sub_id):
        DWOLLA_URL = 'https://api-sandbox.dwolla.com'
        if sub_id:
            return '{}/{}/{}/{}/{}'.format(DWOLLA_URL, type, id, sub_type, sub_id)
        if not sub_id and sub_type:
            return '{}/{}/{}/{}'.format(DWOLLA_URL, type, id, sub_type)
        if not sub_type and id:
            return '{}/{}/{}'.format(DWOLLA_URL, type, id)
        if not id:
            return '{}/{}'.format(DWOLLA_URL, type)

    def create(self,
            routing_number=None,
            account_number=None,
            bank_account_type=None,
            name=None,
        ):
        try:
            params = {
                "routingNumber": routing_number,
                "accountNumber": account_number,
                "bankAccountType": bank_account_type,
                "name": name
            }
            dwolla_link = self.build_url('customers', self.merchantHash, 'funding-sources', None)
            payment = self.app_token.post(dwolla_link, params)
            payment = payment.headers['location']
            result = DwollaPaymentResult(
                is_success=True,
                errors=None,
                id=payment.split('/')[-1]
            )
            return result
        except Exception as e:
            print(e.args[0])
            error_string = e.args[0]
            json_errors = json.loads(error_string)
            if '_embedded' in json_errors:
                errors = json_errors['_embedded']['errors']
            else:
                errors = [json_errors]
            logger.error('Error Creating Dwolla Payment; Error: %s', errors[0])
            result = DwollaPaymentResult(
                is_success=False,
                errors=errors,
                id=None
            )
            return result


    def update(self, paymentHash=None):
        try:
            params = {
                "routingNumber": self.routing_number,
                "accountNumber": self.account_number,
                "bankAccountType": self.bank_account_type,
                "name": self.account_name
            }
            dwolla_link = self.build_url('customers', self.merchantHash, 'funding-sources', paymentHash)
            payment = self.app_token.post(dwolla_link, params)
            result = DwollaPaymentResult(
                is_success=True,
                errors=None,
                id=payment.body['id']
            )
            return result
        except Exception as e:
            print(e.args[0])
            error_string = e.args[0]
            json_errors = json.loads(error_string)
            if '_embedded' in json_errors:
                errors = json_errors['_embedded']['errors']
            else:
                errors = [json_errors]
            logger.error('Error Creating Dwolla Payment; Error: %s', errors[0])
            result = DwollaPaymentResult(
                is_success=False,
                errors=errors,
                id=None
            )
            return result

    def find(self, search=None, status=None, limit=100):
        try:
            dwolla_link = self.build_url('customers', self.merchantHash, 'funding-sources', None)
            dwolla_payments = self.app_token.get(dwolla_link)
            return dwolla_payments.body['_embedded']['funding-sources']
        except Exception as e:
            error = 'Error Finding Dwolla Payment; Error: {}'.format(e.args[0])
            logger.error(error)
            raise ValueError(error)

    def get(self, paymentHash=None):
        try:
            payment = self.app_token.get(paymentHash)
            return payment.body
        except Exception as e:
            error = 'Error Finding Dwolla Payment; Error: {}'.format(e.args[0])
            logger.error(error)
            raise ValueError(error)

    def remove(self, paymentHash=None):
        try:
            '''
            TODO TODO !!! VERIFY ALL TRANSFERS ARE COMPLETED FIRST !!! TODO TODO
            '''
            print(paymentHash)
            dwolla_link = self.build_url('funding-sources', paymentHash, None, None)
            print(dwolla_link)
            params = {
                "removed": True
            }
            return self.app_token.post(dwolla_link, params)
        except Exception as e:
            logger.error('Error Removing Dwolla Payment; Error: %s', e.args[0])
            raise e
