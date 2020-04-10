# server/utils/dwolla.py

# Logging Initialiation
#
#
import logging
import os
import json

# Create Logger
logger = logging.getLogger('samy.utils.dwolla.client')

from server.env import APP_ENV

import dwollav2

from server.utils.dwolla import exceptions

import hmac
from hashlib import sha256

if APP_ENV == 'server.config.DevelopmentConfig':
    from server.config import Config, DevelopmentConfig

    logger.info('Dwolla Config: %s', DevelopmentConfig.DWOLLA_MERCHANT_ENV)

    gateway = dwollav2.Client(
          key = DevelopmentConfig.DWOLLA_MERCHANT_KEY,
          secret = DevelopmentConfig.DWOLLA_MERCHANT_SECRET,
          environment = DevelopmentConfig.DWOLLA_MERCHANT_ENV
    )

elif APP_ENV == 'server.config.ProductionConfig':
    from server.config import Config, ProductionConfig

    logger.info('Dwolla Config: %s', ProductionConfig.DWOLLA_MERCHANT_ENV)

    gateway = dwollav2.Client(
          key = ProductionConfig.DWOLLA_MERCHANT_KEY,
          secret = ProductionConfig.DWOLLA_MERCHANT_SECRET,
          environment = ProductionConfig.DWOLLA_MERCHANT_ENV
    )

elif APP_ENV == 'server.config.StageConfig':
    from server.config import Config, StageConfig

    logger.info('Dwolla Config: %s', StageConfig.DWOLLA_MERCHANT_ENV)

    gateway = dwollav2.Client(
          key = StageConfig.DWOLLA_MERCHANT_KEY,
          secret = StageConfig.DWOLLA_MERCHANT_SECRET,
          environment = StageConfig.DWOLLA_MERCHANT_ENV
    )


class DwollaClient(object):

    def __init__(self, app_token=None):

        if not app_token:
            logger.info('Generating New Dwolla Gateway')
            app_token = gateway.Auth.client()

        self.app_token = app_token

        if not self.app_token:
            error = 'Invalid Dwolla App Token Set {}'.format(self.app_token)
            logger.error(error)
            raise ValueError(error)

    def build_url(self, type, id, sub_type, sub_id):
        DWOLLA_URL = 'https://api-sandbox.dwolla.com'
        if sub_id:
            return '{}/{}/{}/{}/{}'.format(DWOLLA_URL, type, id, sub_type, sub_id)
        if not sub_id and sub_type:
            return '{}/{}/{}/{}'.format(DWOLLA_URL, type, id, sub_type)
        if not sub_type and id:
            return '{}/{}/{}'.format(DWOLLA_URL, type, id)
        if not id:
            return '{}/{}'.format(DWOLLA_URL, type)

    def get_root(self):
        try:
            root = self.app_token.get('/')
            href = root.body['_links']['account']['href']
            return href.split('/')[-1]
        except Exception as e:
            logger.error('Error getting dwolla root account; Error: %s', e)
            raise exceptions.DwollaException("Error getting Dwolla root account: {0}".format(e), 10000)

    def get_account(self, accountHash=None):
        try:

            dwolla_link = self.build_url('accounts', accountHash, 'funding-sources', None)
            funding_sources = self.app_token.get(dwolla_link)
            return funding_sources.body['_embedded']['funding-sources'][0]['id']
        except Exception as e:
            logger.error('Error getting Dwolla Account Payment; Error: %s', e)
            raise ValueError()

    def get(self, accountHash=None):
        try:
            dwolla_link = self.build_url('accounts', accountHash)
            root = self.app_token.get(dwolla_link)
            href = root.body['id']
            return href.split('/')[-1]
        except Exception as e:
            logger.error('Error getting dwolla Account; Error: %s', e)
            raise exceptions.DwollaException("Error getting Dwolla Account: {0}".format(e), 10000)
