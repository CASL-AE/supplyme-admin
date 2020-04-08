
import logging

# Create Logger
logger = logging.getLogger('xupply.test.xupply.test_cloud_match')

from testing_config import BaseTestConfig
import json
import pytest

from server.utils.xupply.match import cloud_request_match

# @pytest.mark.skip(reason="Using Prod Cert")
class TestCloudMatch(BaseTestConfig):

    # @pytest.mark.skip(reason="Using Prod Cert")
    def test_request_cloud_match(self):
        cloud_request_match('request')
        print(e)
