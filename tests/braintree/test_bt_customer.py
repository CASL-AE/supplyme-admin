

import logging

# Create Logger
logger = logging.getLogger('xupply.test.braintree.test_customer')

from testing_config import BaseTestConfig
import json
import pytest

from server.xupply.models import XupplyReferences

# Braintree
from server.utils.braintree.client import BraintreeClient
from server.utils.braintree.objects.customer import XupplyBraintreeCustomer

# Xupply
from server.account.model import XupplyAccount

class TestBraintreeCustomer(BaseTestConfig):

    @pytest.mark.skip(reason="Using Prod Cert")
    def test_braintree_customer(self):

        account_ref = XupplyReferences().accounts_ref.document(self.account.accountID)

        # braintree_customers = XupplyBraintreeCustomer(gateway=self.gateway).get(payment)
        # braintree_customer = braintree_customers[0]
        # braintreeId = braintree_customer['id']
        # print(braintree_customer['firstName'])
        # result = XupplyBraintreeCustomer(gateway=self.gateway).remove(braintreeId=braintreeId)

        ''''''
        # Check Better!!!!
        # self.assertEqual(result.body['status'], 'deactivated')
        ''''''

        account_ref.delete()
        account_doc = account_ref.get()
        account_dict = account_doc.to_dict()
        if not account_dict:
            account_dict = {}

        self.assertEqual(account_dict, {})

        account_ref.set(self.account.to_any_object())

        account_doc = account_ref.get()
        account_dict = account_doc.to_dict()

        self.assertEqual(account_dict['accountID'], 'TestAccount')

        data = {
            'accountID': self.accountID,
        }

        res = self.app.post(
                "/api/v1/braintree/customer",
                json=data,
                content_type='application/json',
                headers=self.headers
        )
        self.assertEqual(res.status_code, 200)
        status = json.loads(res.data.decode("utf-8"))['status']
        statusText = json.loads(res.data.decode("utf-8"))['statusText']
        braintreeId = json.loads(res.data.decode("utf-8"))['data']['braintreeId']

        self.assertTrue(braintreeId)

        account_doc = account_ref.get()
        account_dict = account_doc.to_dict()

        self.assertEqual(account_dict['merchantHash'], braintreeId)
