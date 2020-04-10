# xupply/server/utils/dwolla/objects/customer.py

import logging

logger = logging.getLogger('xupply.server.utils.dwolla.objects.customer.py')

import json

class DwollaCustResult:
    def __init__(self, id=None):
        self.id = id

class DwollaResult:
    def __init__(self,
        is_success=None,
        errors=None,
        customerHash=None
    ):
        self.is_success = is_success
        self.errors = errors
        self.customer = DwollaCustResult(id=customerHash)

class XupplyDwollaCustomer(object):

    def __init__(self, first_name=None, last_name=None, email=None, ip_address=None, app_token=None):
        self.first_name = first_name
        self.last_name = last_name
        self.email = email
        self.ip_address = ip_address

        self.app_token = app_token

        if not self.app_token:
            error = 'Invalid Dwolla App Token Set {}'.format(self.app_token)
            logger.error(error)
            raise ValueError(error)

    def build_url(self, type, id):
        DWOLLA_URL = 'https://api-sandbox.dwolla.com'
        return '{}/{}/{}'.format(DWOLLA_URL, type, id)

    def create_token(self, dwollaId=None):
        try:
            customer = self.app_token.post('https://api.dwolla.com/customers/%s/iav-token' % dwollaId)
            return customer.body['token']
        except Exception as e:
            logger.error('Error Creating Dwolla Ambassador; Error: %s', e.args[0])
            raise ValueError('Error Creating Dwolla Ambassador; Error: %s', e.args[0])

    def create(self, params=None):
        try:
            params = {
                "firstName": self.first_name,
                "lastName": self.last_name,
                "email": self.email,
                "type": 'receive-only',
                "ipAddress": self.ip_address,
            }
            customer = self.app_token.post('customers', params)
            customer = customer.headers['location']
            result = DwollaResult(
                is_success=True,
                errors=None,
                customerHash=customer.split('/')[-1]
            )
            return result

        except Exception as e:
            error_string = e.args[0]
            json_errors = json.loads(error_string)
            if '_embedded' in json_errors:
                errors = json_errors['_embedded']['errors']
            else:
                errors = [json_errors]
            logger.error('Error Creating Dwolla Customer; Error: %s', errors[0])
            result = DwollaResult(
                is_success=False,
                errors=errors,
                customerHash=None
            )
            return result

    def update(self, dwollaId=None):
        params = {
            "firstName": self.first_name,
            "lastName": self.last_name,
            "email": self.email,
            "ipAddress": self.ip_address,
        }
        try:
            customer = self.app_token.post('customers', params)
            customer = customer.headers['location']
            return customer.split('/')[-1]
        except Exception as e:
            logger.error('Error Updating Dwolla Customer; Error: %s', e.args[0])
            raise ValueError('Error Creating Dwolla Ambassador; Error: %s', e.args[0])

    def update_email(self, dwollaId=None):
        try:
            params = {
                "email": self.email,
            }
            return self.gateway.customer.update(dwollaId, params)
        except Exception as e:
            logger.error('Error Updating Dwolla Customer Email; Error: %s', e.args[0])
            raise ValueError('Error Creating Dwolla Ambassador; Error: %s', e.args[0])

    def find(self, search=None, status=None, limit=100):
        try:
            dwolla_customers = self.app_token.get('customers', search=search)
            return dwolla_customers.body['_embedded']['customers']
        except Exception as e:
            error = 'Error Finding Dwolla Customer; Error: {}'.format(e.args[0])
            logger.error(error)
            raise ValueError(error)

    def get(self, dwollaId=None):
        try:
            customer = self.app_token.get(dwollaId)
            return customer.body
        except Exception as e:
            error = 'Error Finding Dwolla Customer; Error: {}'.format(e.args[0])
            logger.error(error)
            raise ValueError(error)

    def remove(self, dwollaId=None):
        try:
            params = {
                'status': 'deactivated'
            }
            dwolla_link = self.build_url('customers', dwollaId)
            customer = self.app_token.get(dwolla_link)
            if customer.body['status'] != 'suspended':
                return self.app_token.post(dwolla_link, params)
        except Exception as e:
            error = 'Error Finding Dwolla Customer; Error: {}'.format(e.args[0])
            logger.error(error)
            raise ValueError(error)
