

import logging

# Create Logger
logger = logging.getLogger('xupply.test.braintree.test_customer')

from testing_config import BaseTestConfig
import json
import pytest

from server.xupply.models import XupplyReferences

# Braintree
from server.utils.braintree.client import BraintreeClient
from server.utils.braintree.objects.payment import XupplyBraintreePayment


class TestBraintreePayment(BaseTestConfig):

    @pytest.mark.skip(reason="Using Prod Cert")
    def test_braintree_payment(self):

        account_ref = XupplyReferences().accounts_ref.document(self.account.accountID)
        account_doc = account_ref.get()
        account_dict = account_doc.to_dict()
        account = XupplyAccount().dict_snapshot(snapshot=account_dict)

        payment_ref = account_ref.collection('Payments').document(self.payment.paymentID)

        # braintree_customers = XupplyBraintreeCustomer(gateway=self.gateway).get(payment)
        # braintree_customer = braintree_customers[0]
        # braintreeId = braintree_customer['id']
        # print(braintree_customer['firstName'])
        # result = XupplyBraintreeCustomer(gateway=self.gateway).remove(braintreeId=braintreeId)

        ''''''
        # Check Better!!!!
        # self.assertEqual(result.body['status'], 'deactivated')
        ''''''

        payment_ref.delete()
        payment_doc = payment_ref.get()
        payment_dict = payment_doc.to_dict()
        if not payment_dict:
            payment_dict = {}

        self.assertEqual(payment_dict, {})

        payment_ref.set(self.payment.to_any_object())

        payment_doc = payment_ref.get()
        payment_dict = payment_doc.to_dict()

        self.assertEqual(payment_dict['paymentID'], 'TestPayment')

        '''
        fake-valid-visa-nonce
        fake-valid-amex-nonce
        fake-valid-mastercard-nonce
        fake-valid-debit-nonce
        fake-valid-healthcare-nonce
        '''

        data = {
            'accountID': account.accountID,
            'merchantHash': account.merchantHash,
            'nonce': 'fake-valid-healthcare-nonce',
            'paymentID': self.payment.paymentID,
        }

        res = self.app.post(
                "/api/v1/braintree/payment",
                json=data,
                content_type='application/json',
                headers=self.headers
        )
        self.assertEqual(res.status_code, 200)
        status = json.loads(res.data.decode("utf-8"))['status']
        statusText = json.loads(res.data.decode("utf-8"))['statusText']
        paymentHash = json.loads(res.data.decode("utf-8"))['data']['paymentHash']

        self.assertTrue(paymentHash)

        payment_doc = payment_ref.get()
        payment_dict = payment_doc.to_dict()

        self.assertEqual(payment_dict['paymentHash'], paymentHash)
        print(paymentHash)
        print(error)
