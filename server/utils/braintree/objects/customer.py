

import logging

logger = logging.getLogger('samy.utils.braintree.customer.py')

import braintree

class XupplyBraintreeCustomer(object):

    def __init__(self,
                first_name=None,
                last_name=None,
                email=None,
                phone=None,
                gateway=None):

        self.first_name = first_name
        self.last_name = last_name
        self.email = email
        self.phone = phone

        self.gateway = gateway
        if not self.gateway:
            error = 'Invalid Braintree Gateway Set {}'.format(self.gateway)
            logger.error(error)
            raise ValueError(error)

    def create(self, accountID=None):
        params = {
            "id": accountID,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "email": self.email,
            "phone": self.phone,
        }
        return self.gateway.customer.create(params)

    def create_token(self, accountID=None):
        return self.gateway.client_token.generate({'customer_id': accountID})

    def update(self, customerHash=None):
        params = {
            "first_name": self.first_name,
            "last_name": self.last_name,
        }
        return self.gateway.customer.update(self.merchantId, params)

    def find(self, customerHash=None):
        params = {
            "first_name": self.first_name,
            "last_name": self.last_name,
        }
        return self.gateway.customer.find(self.merchantId, params)

    def get(self, merchantHash=None):
        return self.gateway.customer.get(self.merchantId, merchantHash)
