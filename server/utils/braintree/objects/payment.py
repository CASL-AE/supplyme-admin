
import logging

logger = logging.getLogger('samy.utils.braintree.payment.py')

import braintree

from server.utils.braintree.client import BraintreeClient

class XupplyBraintreePayment(object):

    def __init__(self,
                merchantHash=None,
                gateway=None):

        self.gateway = gateway
        if not self.gateway:
            error = 'Invalid Braintree Gateway Set {}'.format(self.app_token)
            logger.error(error)
            raise ValueError(error)

        self.merchantHash = merchantHash
        if not self.merchantHash:
            error = 'Invalid Braintree Mechant Hash Set {}'.format(self.merchantHash)
            logger.error(error)
            raise ValueError(error)


    def create(self, nonce=None):
        try:
            params = {
                "customer_id": self.merchantHash,
                "payment_method_nonce": nonce,
                "options": {
                    "fail_on_duplicate_payment_method": True,
                    "verify_card": True,
                }
            }
            return self.gateway.payment_method.create(params)

        except Exception as e:
            print('HERE ERROR')
            print(e)
            raise ValueError(e)

    def find(self, bt_token=None):
        try:
            return self.gateway.payment.find(bt_token)
        except Exception as e:
            print(e)

    def remove(self, paymentHash=None):
        try:
            return self.gateway.payment_method.delete(paymentHash)
        except Exception as e:
            raise ValueError(e)
