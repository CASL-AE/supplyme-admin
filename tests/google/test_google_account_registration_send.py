
import logging

# Create Logger
logger = logging.getLogger('xupply.test.account.test_account_registration_send')

from testing_config import BaseTestConfig
import json
import pytest

from server.account.model import XupplyAccountCode

@pytest.mark.skip(reason="Using Prod Cert")
class TestAccountEmailActivationSend(BaseTestConfig):

    emailAccountCode = XupplyAccountCode(
        activationCode='O4LBaoJ7edRvBL3GxOHH',
        accountID=None,
        valid=True,
        ownerName='John Doe',
        accountName='Test Account',
        email='denis@caslnpo.org',
        phoneNumber=None,
        createdDate=None,
        updatedDate=None
    )

    def test_account_email_registration_send(self):

        data = {
            'activationCode': self.emailAccountCode.to_any_object(),
        }

        res = self.app.post(
                "/api/google/v1/account/registration/send",
                json=data,
                content_type='application/json',
                headers=self.headers
        )
        self.assertEqual(res.status_code, 200)
        print(e)
