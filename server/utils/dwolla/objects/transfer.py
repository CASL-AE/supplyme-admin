# xupply/server/utils/dwolla/objects/payment.py

import logging

logger = logging.getLogger('xupply.server.utils.dwolla.objects.payment.py')

import json

from server.utils.dwolla.client import DwollaClient

class DwollaTransResult:
    def __init__(self, id=None):
        self.id = id

class DwollaTransferResult:
    def __init__(self,
        is_success=None,
        errors=None,
        id=None
    ):
        self.is_success = is_success
        self.errors = errors
        self.transfer = DwollaTransResult(id=id)


class XupplyDwollaTransfer(object):

    def __init__(self,
                 amount=None,
                 currency=None,
                 notes=None,
                 app_token=None,
                 toMerchantHash=None,
                 xupplyPaymentHash=None,
                 toPaymentHash=None):

        self.amount = amount
        self.currency = currency
        self.notes = notes

        self.app_token = app_token
        if not self.app_token:
            error = 'Invalid Dwolla App Token Set {}'.format(self.app_token)
            logger.error(error)
            raise ValueError(error)

        self.toMerchantHash = toMerchantHash
        if not self.toMerchantHash:
            error = 'Invalid Dwolla To Merchant Hash Set {}'.format(self.toMerchantHash)
            logger.error(error)
            raise ValueError(error)

        self.toPaymentHash = toPaymentHash
        if not self.toPaymentHash:
            error = 'Invalid Dwolla To Payment Hash Set {}'.format(self.toPaymentHash)
            logger.error(error)
            raise ValueError(error)

        self.xupplyPaymentHash = xupplyPaymentHash
        if not self.xupplyPaymentHash:
            error = 'Invalid Dwolla From Payment Hash Set {}'.format(self.xupplyPaymentHash)
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

    def create(self, transferHash=None):
        try:
            if not transferHash:
                error = 'Invalid Dwolla Transfer ID for Correlation ID {}'.format(transferHash)
                logger.error(error)
                raise ValueError(error)

            params = {
                '_links': {
                    'source': {
                        'href': self.build_url('funding-sources', self.xupplyPaymentHash)
                    },
                    'destination': {
                        'href': self.build_url('funding-sources', self.toPaymentHash)
                    }
                },
                'clearing': {
                    'source': 'standard',
                    'destination': 'next-available'
                },
                'amount': {
                    'currency': self.currency,
                    'value': self.amount
                },
                'metadata': {
                    'customerHash': self.toMerchantHash,
                    'notes': self.notes
                },
                'correlationId': transferHash,
            }
            transfer = self.app_token.post('transfers', params)
            transfer = transfer.headers['location']
            result = DwollaTransferResult(
                is_success=True,
                errors=None,
                id=transfer.split('/')[-1]
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
            logger.error('Error Creating Dwolla Transfer; Error: %s', errors[0])
            result = DwollaTransferResult(
                is_success=False,
                errors=errors,
                id=None
            )
            return result

    def void(self, transferHash=None):
        try:
            params = {
                'status': 'cancelled'
            }
            dwolla_link = self.build_url('transfers', transferHash)
            return self.app_token.post(dwolla_link, params)
        except Exception as e:
            error = 'Error Voiding Dwolla Transfer ID {} Error: {}'.format(transferHash, e)
            logger.error(error)
            raise error

    def find(self):
        try:
            dwolla_link = self.build_url('customers', self.toMerchantHash, 'transfers')
            return self.app_token.get(dwolla_link)
        except Exception as e:
            error = 'Error Finding Dwolla Transfer Error: {}'.format(e)
            logger.error(error)
            raise error

    def get(self, transferHash=None):
        try:
            dwolla_link = self.build_url('transfers', transferHash)
            return self.app_token.get(transferHash)
        except Exception as e:
            error = 'Error Getting Dwolla Transfer ID {} Error: {}'.format(transferHash, e)
            logger.error(error)
            raise error
