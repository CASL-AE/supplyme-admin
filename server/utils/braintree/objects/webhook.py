
import logging

logger = logging.getLogger('samy.utils.braintree.webhook.py')

import braintree

from server.utils.braintree.client import BraintreeClient

class XupplyBraintreeWebhook(object):
    def __init__(self,
                 merchant_id=None,
                 paymentHash=None,
                 gateway=None):

        self.merchant_id = merchant_id
        self.paymentHash = paymentHash

        if not gateway:
            raise ValueError('HUGE AUTH/GATEWAY ERROR')

        self.gateway = gateway

    # For Tiered Auth
    def auth(self, amount=None):
        params = {
            "amount": amount,
            "payment_method_token": self.paymentHash,
            "options": {
                "submit_for_settlement": False,
            }
        }
        return self.gateway.transaction.sale(params)

    # For Submitting to Braintree TODO: Need to void all other payments
    def submit(self, transactionID=None, amount=None):
        params = {
            "amount": amount,
            "payment_method_token": self.paymentHash,
            "options": {
                "submit_for_settlement": True,
            }
        }
        return self.gateway.transaction.sale(transactionID, params)

    def void(self, transactionID=None):
        return self.gateway.transaction.void(transactionID)

    def refund(self, transactionID=None):
        return self.gateway.transaction.refund(transactionID)

    def get(self, transactionID=None):
        return self.gateway.transaction.find(transactionID)
