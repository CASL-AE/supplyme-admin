
import logging

# Create Logger
logger = logging.getLogger('xupply.test.employee.test_utils')

from testing_config import BaseTestConfig
import json
import pytest

from server.utils.google.places.utils import get_google_directions, get_hospital_rank

# @pytest.mark.skip(reason="Using Prod Cert")
class TestGoogleUtils(BaseTestConfig):

    @pytest.mark.skip(reason="Using Prod Cert")
    def test_google_directions(self):
        origin = '41.8507300,-87.6512600'
        destination = '41.8525800,-87.6514100'
        get_google_directions(origin, destination, [])
        print(e)

    # @pytest.mark.skip(reason="Using Prod Cert")
    def test_google_hospital_rank(self):
        address = '501 6th Avenue South, St. Petersburg, FL'
        rank = get_hospital_rank(address)
        print(rank)
        print(e)
