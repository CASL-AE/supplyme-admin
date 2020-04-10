
import logging

logger = logging.getLogger('samy.utils.braintree.customer.py')

import braintree

from server.utils.braintree.client import BraintreeClient

class XupplyBraintreeTransaction(object):
    def __init__(self,
                 objectID=None,
                 paymentHash=None,
                 gateway=None):

        self.gateway = gateway
        if not self.gateway:
            error = 'Invalid Braintree Gateway Set {}'.format(self.app_token)
            logger.error(error)
            raise ValueError(error)

        self.paymentHash = paymentHash
        if not self.paymentHash:
            error = 'Invalid Braintree Payment Hash Set {}'.format(self.paymentHash)
            logger.error(error)
            raise ValueError(error)

        self.objectID = objectID
        if not self.objectID:
            error = 'Invalid Braintree Tab ID Set {}'.format(self.objectID)
            logger.error(error)
            raise ValueError(error)

    def get_tier_amount(self, amount=None):
        if amount < 25:
            return 25
        # We cover first $25
        if amount > 25 and amount < 50:
            return 50
        # We cover $50 - $75
        if amount > 75 and amount < 100:
            return 100
        min = 50
        max = 100
        # We cover $50 spreads
        if amount > 100:
            for i in range(10):
                x = i * min
                y = i * max
                if amount > x and amount < y:
                    return y


    # For Tiered Auth
    def submit(self, amount=None):

        params = {
            "amount": '{}'.format(amount),
            "order_id": self.objectID,
            "payment_method_token": self.paymentHash,
            "options": {
                "submit_for_settlement": False,

            }
        }
        return self.gateway.transaction.sale(params)

    # For Submitting to Braintree TODO: Need to void all other payments
    def settle(self, amount=None):
        collection = self.gateway.transaction.search()
        # Sort transactions by amount
        transactions = sorted(collection.items, key=lambda t: t.amount, reverse=True)
        index = 0
        for transaction in transactions:
            # If first transaction (Largest Transaction)
            if index == 0:
                params = {
                    "amount": '{}'.format(amount),
                    "order_id": self.objectID,
                    "options": {
                        "submit_for_settlement": True,
                    }
                }
                return self.gateway.transaction.sale(transaction.id, params)

            # Void other auths
            return self.void(transactionHash=transaction.id)

    def void(self, transactionHash=None):
        return self.gateway.transaction.void(transactionHash)

    def refund(self, transactionHash=None):
        return self.gateway.transaction.refund(transactionHash)

    def search(self, merchantHash=None):
        return self.gateway.transaction.search(
            braintree.TransactionSearch.customer_id == merchantHash,
            braintree.TransactionSearch.order_id == self.objectID
        )

    # def get(self, transactionID=None):
    #     return self.gateway.transaction.find(transactionID)
