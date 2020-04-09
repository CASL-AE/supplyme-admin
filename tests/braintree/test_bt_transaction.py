

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

# Xupply
from server.transaction.model import XupplyTransaction

class TestBraintreePayment(BaseTestConfig):

    @pytest.mark.skip(reason="Using Prod Cert")
    def test_braintree_transaction(self):

        account_ref = XupplyReferences().accounts_ref.document(self.account.accountID)
        account_doc = account_ref.get()
        account_dict = account_doc.to_dict()
        account = XupplyAccount().dict_snapshot(snapshot=account_dict)

        payment_ref = account_ref.collection('Payments').document(self.payment.paymentID)

        payment_doc = payment_ref.get()
        payment_dict = payment_doc.to_dict()

        self.assertEqual(payment_dict['paymentID'], 'TestPayment')
        self.assertTrue(payment_dict['paymentHash'])

        transaction_ref = account_ref.collection('Transactions').document(self.transaction.transactionID)

        transaction_ref.delete()
        transaction_doc = transaction_ref.get()
        transaction_dict = transaction_doc.to_dict()
        if not transaction_dict:
            transaction_dict = {}

        self.assertEqual(transaction_dict, {})

        transaction_ref.set(self.transaction.to_any_object())

        transaction_doc = transaction_ref.get()
        transaction_dict = transaction_doc.to_dict()

        self.assertEqual(transaction_dict['transactionID'], 'TestTransaction')

        data = {
            'accountID': account.accountID,
            'paymentHash': payment_dict['paymentHash'],
            'transactionID': self.transaction.transactionID,
        }

        res = self.app.post(
                "/api/v1/braintree/auth",
                json=data,
                content_type='application/json',
                headers=self.headers
        )
        self.assertEqual(res.status_code, 200)
        status = json.loads(res.data.decode("utf-8"))['status']
        statusText = json.loads(res.data.decode("utf-8"))['statusText']
        transactionHash = json.loads(res.data.decode("utf-8"))['data']['transactionHash']

        self.assertTrue(transactionHash)

        transaction_doc = transaction_ref.get()
        transaction_dict = transaction_doc.to_dict()

        self.assertEqual(transaction_dict['transactionHash'], transactionHash)
        print(transactionHash)
        print(error)

    @pytest.mark.skip(reason="Using Prod Cert")
    def test_braintree_transaction(self):

        account_ref = XupplyReferences().accounts_ref.document(self.account.accountID)
        account_doc = account_ref.get()
        account_dict = account_doc.to_dict()
        account = XupplyAccount().dict_snapshot(snapshot=account_dict)

        payment_ref = account_ref.collection('Payments').document(self.payment.paymentID)

        payment_doc = payment_ref.get()
        payment_dict = payment_doc.to_dict()

        self.assertEqual(payment_dict['paymentID'], 'TestPayment')
        self.assertTrue(payment_dict['paymentHash'])

        transaction_ref = account_ref.collection('Transactions').document(self.transaction.transactionID)

        transaction_ref.delete()
        transaction_doc = transaction_ref.get()
        transaction_dict = transaction_doc.to_dict()
        if not transaction_dict:
            transaction_dict = {}

        self.assertEqual(transaction_dict, {})

        transaction_ref.set(self.transaction.to_any_object())

        transaction_doc = transaction_ref.get()
        transaction_dict = transaction_doc.to_dict()

        self.assertEqual(transaction_dict['transactionID'], 'TestTransaction')

        data = {
            'accountID': account.accountID,
            'paymentHash': payment_dict['paymentHash'],
            'transactionID': self.transaction.transactionID,
        }

        res = self.app.post(
                "/api/v1/braintree/transaction",
                json=data,
                content_type='application/json',
                headers=self.headers
        )
        self.assertEqual(res.status_code, 200)
        status = json.loads(res.data.decode("utf-8"))['status']
        statusText = json.loads(res.data.decode("utf-8"))['statusText']
        transactionHash = json.loads(res.data.decode("utf-8"))['data']['transactionHash']

        self.assertTrue(transactionHash)

        transaction_doc = transaction_ref.get()
        transaction_dict = transaction_doc.to_dict()

        self.assertEqual(transaction_dict['transactionHash'], transactionHash)
        print(transactionHash)
        print(error)
