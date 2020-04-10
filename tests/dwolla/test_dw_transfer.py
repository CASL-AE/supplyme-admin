


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
from server.utils.dwolla.objects.transfer import XupplyDwollaTransfer

from server.transfer.model import XupplyTransfer

class TestDwollaTransfer(BaseTestConfig):

    @pytest.mark.skip(reason="Using Prod Cert")
    def test_dwolla_transfer(self):

        account_ref = XupplyReferences().accounts_ref.document(self.account.accountID)
        account_ref.set(self.account.to_any_object())

        employee_ref = account_ref.collection('Employees').document(self.employee.employeeID)
        payment_ref = account_ref.collection('Payments').document(self.payment.paymentID)
        transfer_ref = account_ref.collection('Transfers').document(self.transfer.transferId)

        try:
            transfer_doc = transfer_ref.get()
            transfer_dict = transfer_doc.to_dict()
            #
            dwolla_transfers = XupplyDwollaTransfer(app_token=self.dwolla_token).find(search=self.employee.firstName, limit=1)
            dwolla_transfer = dwolla_transfers[0]
            transferHash = dwolla_transfer['id']
            print(dwolla_transfer)
            result = XupplyDwollaTransfer(dwollaId=self.account.merchantHash, app_token=self.dwolla_token).remove(transferHash=transferHash)
            # self.assertEqual(result.body['status'], 'deactivated')
            transfer_ref.delete()
            transfer_doc = transfer_ref.get()
        except Exception as e:
            transfer_dict = {}
            print(e)
            print(error)

        # result = XupplyDwollaTransfer(dwollaId=self.employee.merchantHash, app_token=self.dwolla_token).find()
        # print(result)
        # print(error)
        self.assertEqual(transfer_dict, {})

        transfer_ref.set(self.transfer.to_any_object())

        account_doc = account_ref.get()
        account_dict = account_doc.to_dict()

        payment_doc = payment_ref.get()
        payment_dict = payment_doc.to_dict()

        transfer_doc = transfer_ref.get()
        transfer_dict = transfer_doc.to_dict()

        self.assertEqual(transfer_dict['transferId'], 'TestTransfer')

        data = {
            'toPaymentHash': payment_dict['paymentHash'],
            'toMerchantHash': account_dict['merchantHash'],
            'accountID': self.accountID,
            'transferId': self.transfer.transferId,
        }

        res = self.app.post(
                "/api/v1/dwolla/transfer",
                json=data,
                content_type='application/json',
                headers=self.headers
        )

        self.assertEqual(res.status_code, 200)
        status = json.loads(res.data.decode("utf-8"))['status']
        statusText = json.loads(res.data.decode("utf-8"))['statusText']
        transferId = json.loads(res.data.decode("utf-8"))['data']['transferId']

        self.assertTrue(transferId)

        transfer_doc = transfer_ref.get()
        transfer_dict = transfer_doc.to_dict()

        self.assertEqual(transfer_dict['hash'], transferId)

    @pytest.mark.skip(reason="Using Prod Cert")
    def test_dwolla_employee_transfer(self):

        account_ref = XupplyReferences().accounts_ref.document(self.account.accountID)
        account_ref.set(self.account.to_any_object())
        employee_ref = account_ref.collection('Employees').document(self.employee.employeeID)
        payment_ref = employee_ref.collection('Payments').document(self.payment.paymentID)
        transfer_ref = employee_ref.collection('Transfers').document(self.transfer.transferId)
        try:
            transfer_doc = transfer_ref.get()
            transfer_dict = transfer_doc.to_dict()
            #
            # dwolla_customers = XupplyDwollaCustomer(app_token=self.dwolla_token).find(search=self.employee.firstName, limit=1)
            # dwolla_customer = dwolla_customers[0]
            # dwollaId = dwolla_customer['id']
            # print(dwolla_customer['firstName'])
            # result = XupplyDwollaPayment(dwollaId=self.employee.merchantHash, app_token=self.dwolla_token).remove(paymentID=paymentID)
            # self.assertEqual(result.body['status'], 'deactivated')
            transfer_ref.delete()
            transfer_foc = transfer_ref.get()
        except Exception as e:
            transfer_dict = {}

        # result = XupplyDwollaTransfer(dwollaId=self.employee.merchantHash, app_token=self.dwolla_token).find()
        # print(result)
        # print(error)
        self.assertEqual(transfer_dict, {})

        transfer_ref.set(self.transfer.to_any_object())

        account_doc = account_ref.get()
        account_dict = account_doc.to_dict()

        employee_doc = employee_ref.get()
        employee_dict = employee_doc.to_dict()

        payment_doc = payment_ref.get()
        payment_dict = payment_doc.to_dict()

        transfer_doc = transfer_ref.get()
        transfer_dict = transfer_doc.to_dict()

        self.assertEqual(transfer_dict['transferId'], 'TestTransfer')

        data = {
            'toPaymentId': payment_dict['paymentID'],
            'toMerchantId': account_dict['merchantHash'],
            'accountID': self.accountID,
            'transferId': self.transfer.transferId,
        }

        res = self.app.post(
                "/api/v1/dwolla/transfer",
                json=data,
                content_type='application/json',
                headers=self.headers
        )

        self.assertEqual(res.status_code, 200)
        status = json.loads(res.data.decode("utf-8"))['status']
        statusText = json.loads(res.data.decode("utf-8"))['statusText']
        transferId = json.loads(res.data.decode("utf-8"))['data']['transferId']

        self.assertTrue(transferId)

        transfer_doc = transfer_ref.get()
        transfer_dict = transfer_doc.to_dict()

        self.assertEqual(transfer_dict['hash'], transferId)
