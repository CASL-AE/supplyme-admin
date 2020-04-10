


import logging

# Create Logger
logger = logging.getLogger('xupply.test.dwolla.test_dw_customer')

from testing_config import BaseTestConfig
import json
import pytest

from server.xupply.models import XupplyReferences

# Dwolla
from server.utils.dwolla.client import DwollaClient
from server.utils.dwolla.objects.customer import XupplyDwollaCustomer
from server.utils.dwolla.objects.payment import XupplyDwollaPayment

class TestDwollaCustomer(BaseTestConfig):

    @pytest.mark.skip(reason="Using Prod Cert")
    def test_dwolla_customer(self):

        account_ref = XupplyReferences().accounts_ref.document(self.account.accountID)
        account_ref.set(self.account.to_any_object())
        employee_ref = account_ref.collection('Employees').document(self.employee.employeeID)
        try:
            employee_doc = employee_ref.get()
            employee_dict = employee_doc.to_dict()

            dwolla_customers = XupplyDwollaCustomer(app_token=self.dwolla_token).find(search=self.employee.firstName, limit=1)
            dwolla_customer = dwolla_customers[0]
            dwollaId = dwolla_customer['id']
            print(dwolla_customer['firstName'])
            result = XupplyDwollaCustomer(app_token=self.dwolla_token).remove(dwollaId=dwollaId)
            self.assertEqual(result.body['status'], 'deactivated')
            employee_ref.delete()
            employee_doc = employee_ref.get()
        except Exception as e:
            employee_dict = {}

        self.assertEqual(employee_dict, {})

        employee_ref.set(self.employee.to_any_object())

        employee_doc = employee_ref.get()
        employee_dict = employee_doc.to_dict()

        self.assertEqual(employee_dict['employeeID'], 'TestUser')

        data = {
            'accountID': self.accountID,
        }

        res = self.app.post(
                "/api/v1/dwolla/customer",
                json=data,
                content_type='application/json',
                headers=self.headers
        )
        self.assertEqual(res.status_code, 200)
        status = json.loads(res.data.decode("utf-8"))['status']
        statusText = json.loads(res.data.decode("utf-8"))['statusText']
        dwollaId = json.loads(res.data.decode("utf-8"))['data']['dwollaId']

        self.assertTrue(dwollaId)

        account_doc = account_ref.get()
        account_dict = account_doc.to_dict()

        self.assertEqual(account_dict['merchantHash'], dwollaId)
