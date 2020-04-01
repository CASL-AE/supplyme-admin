
import logging

# Create Logger
logger = logging.getLogger('xupply.test.employee.test_employee_activation_send')

from testing_config import BaseTestConfig
import json
import pytest

from server.employee.model import XupplyEmployeeCode

@pytest.mark.skip(reason="Using Prod Cert")
class TestEmployeeEmailActivationSend(BaseTestConfig):

    # emailEmployeeCode = XupplyEmployeeCode(
    #     activationCode='O4LBaoJ7edRvBL3GxOHH',
    #     employeeID=None,
    #     valid=True,
    #     ownerName='John Doe',
    #     employeeName='Test Employee',
    #     email='denis@caslnpo.org',
    #     phoneNumber=None,
    #     createdDate=None,
    #     updatedDate=None
    # )

    def test_employee_email_registration_send(self):

        data = {
            'activationCode': self.emailEmployeeCode.to_any_object(),
        }

        res = self.app.post(
                "/api/google/v1/employee/activationCode/send",
                json=data,
                content_type='application/json',
                headers=self.headers
        )
        self.assertEqual(res.status_code, 200)
