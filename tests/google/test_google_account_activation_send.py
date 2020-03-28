
import logging

# Create Logger
logger = logging.getLogger('supplyme.test.account.test_account_activation_send')

from testing_config import BaseTestConfig
import json
import pytest

from server.account.model import SupplyMeAccountCode

@pytest.mark.skip(reason="Using Prod Cert")
class TestAccountEmailActivationSend(BaseTestConfig):

    emailAccountCode = SupplyMeAccountCode(
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

    def test_account_email_activation_send(self):

        data = {
            'activationCode': self.emailAccountCode.to_any_object(),
        }

        res = self.app.post(
                "/api/google/v1/account/activationCode/send",
                json=data,
                content_type='application/json',
                headers=self.headers
        )
        self.assertEqual(res.status_code, 200)
