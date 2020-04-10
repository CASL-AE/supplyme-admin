


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

class TestDwollaPayment(BaseTestConfig):

    @pytest.mark.skip(reason="Using Prod Cert")
    def test_dwolla_payment(self):

        # Set Account (incase)
        account_ref = XupplyReferences().accounts_ref.document(self.account.accountID)
        account_ref.set(self.account.to_any_object())

        account_doc = account_ref.get()
        account_dict = account_doc.to_dict()

        # Get Payment Ref
        payment_ref = account_ref.collection('Payments').document(self.payment.paymentID)

        try:
            payment_doc = payment_ref.get()
            payment_dict = payment_doc.to_dict()
            dwolla_payments = XupplyDwollaPayment(dwollaId=account_dict['merchantHash'], app_token=self.dwolla_token).find(search=self.payment.name, limit=1)
            dwolla_payment = dwolla_payments[0]
            merchantHash = dwolla_payment['id']
            self.assertEqual(dwolla_payment['name'], 'ABC - Bank')
            result = XupplyDwollaPayment(dwollaId=account_dict['merchantHash'], app_token=self.dwolla_token).remove(paymentID=merchantHash)
            self.assertEqual(result.body['removed'], True)
            payment_ref.delete()
            payment_doc = payment_ref.get()
        except Exception as e:
            payment_dict = {}

        self.assertEqual(payment_dict, {})

        payment_ref.set(self.payment.to_any_object())

        payment_doc = payment_ref.get()
        payment_dict = payment_doc.to_dict()

        self.assertEqual(payment_dict['paymentID'], 'TestPayment')

        data = {
            'merchantHash': account_dict['merchantHash'],
            'accountID': self.accountID,
            'accountNumber': self.account_number,
            'routingNumber': self.routing_number,
            'paymentID': self.payment.paymentID,
        }

        res = self.app.post(
                "/api/v1/dwolla/payment",
                json=data,
                content_type='application/json',
                headers=self.headers
        )

        self.assertEqual(res.status_code, 200)
        status = json.loads(res.data.decode("utf-8"))['status']
        statusText = json.loads(res.data.decode("utf-8"))['statusText']
        paymentID = json.loads(res.data.decode("utf-8"))['data']['paymentID']

        self.assertTrue(paymentID)

        payment_doc = payment_ref.get()
        payment_dict = payment_doc.to_dict()

        self.assertEqual(payment_dict['merchantHash'], paymentID)

    @pytest.mark.skip(reason="Using Prod Cert")
    def test_dwolla_employee_payment(self):

        # Set Account (incase)
        account_ref = XupplyReferences().accounts_ref.document(self.account.accountID)
        account_ref.set(self.account.to_any_object())

        # Get Employee Dict
        employee_ref = account_ref.collection('Employees').document(self.employee.employeeID)
        employee_doc = employee_ref.get()
        employee_dict = employee_doc.to_dict()

        # Get Payment Ref
        payment_ref = account_ref.collection('Payments').document(self.payment.paymentID)

        try:
            payment_doc = payment_ref.get()
            payment_dict = payment_doc.to_dict()
            dwolla_payments = XupplyDwollaPayment(dwollaId=employee_dict['merchantHash'], app_token=self.dwolla_token).find(search=self.payment.name, limit=1)
            dwolla_payment = dwolla_payments[0]
            merchantHash = dwolla_payment['id']
            self.assertEqual(dwolla_payment['name'], 'ABC - Bank')
            result = XupplyDwollaPayment(dwollaId=employee_dict['merchantHash'], app_token=self.dwolla_token).remove(paymentID=merchantHash)
            self.assertEqual(result.body['removed'], True)
            payment_ref.delete()
            payment_doc = payment_ref.get()
        except Exception as e:
            payment_dict = {}

        self.assertEqual(payment_dict, {})

        payment_ref.set(self.payment.to_any_object())

        payment_doc = payment_ref.get()
        payment_dict = payment_doc.to_dict()

        self.assertEqual(payment_dict['paymentID'], 'TestPayment')

        data = {
            'merchantHash': account_dict['merchantHash'],
            'accountID': self.accountID,
            'accountNumber': self.account_number,
            'routingNumber': self.routing_number,
            'paymentID': self.payment.paymentID,
        }

        res = self.app.post(
                "/api/v1/dwolla/payment",
                json=data,
                content_type='application/json',
                headers=self.headers
        )

        self.assertEqual(res.status_code, 200)
        status = json.loads(res.data.decode("utf-8"))['status']
        statusText = json.loads(res.data.decode("utf-8"))['statusText']
        paymentID = json.loads(res.data.decode("utf-8"))['data']['paymentID']

        self.assertTrue(paymentID)

        payment_doc = payment_ref.get()
        payment_dict = payment_doc.to_dict()

        self.assertEqual(payment_dict['merchantHash'], paymentID)
