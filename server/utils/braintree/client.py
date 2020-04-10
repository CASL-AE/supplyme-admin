# server/utils/braintree/client.py

# Logging Initialiation
#
#
import logging
import os
import json

# Create Logger
logger = logging.getLogger('samy.utils')

from server.env import APP_ENV

import braintree

import hmac
from hashlib import sha256

if APP_ENV == 'server.config.DevelopmentConfig':
    from server.config import Config, DevelopmentConfig

    logger.info('Braintree Config: %s', DevelopmentConfig.BRAINTREE_MERCHANT_ENV)

    BRAINTREE_MERCHANT_ID = DevelopmentConfig.BRAINTREE_MERCHANT_ID

    gateway = braintree.BraintreeGateway(
        braintree.Configuration(
            str(DevelopmentConfig.BRAINTREE_MERCHANT_ENV),
            str(DevelopmentConfig.BRAINTREE_MERCHANT_ID),
            str(DevelopmentConfig.BRAINTREE_PUBLIC_KEY),
            str(DevelopmentConfig.BRAINTREE_PRIVATE_KEY)
        )
    )

elif APP_ENV == 'server.config.ProductionConfig':
    from server.config import Config, ProductionConfig

    logger.info('Braintree Config: %s', ProductionConfig.BRAINTREE_MERCHANT_ENV)

    BRAINTREE_MERCHANT_ID = ProductionConfig.BRAINTREE_MERCHANT_ID

    gateway = braintree.BraintreeGateway(
        braintree.Configuration(
            str(ProductionConfig.BRAINTREE_MERCHANT_ENV),
            str(ProductionConfig.BRAINTREE_MERCHANT_ID),
            str(ProductionConfig.BRAINTREE_PUBLIC_KEY),
            str(ProductionConfig.BRAINTREE_PRIVATE_KEY)
        )
    )

elif APP_ENV == 'server.config.StageConfig':
    from server.config import Config, StageConfig

    logger.info('Braintree Config: %s', StageConfig.BRAINTREE_MERCHANT_ENV)

    BRAINTREE_MERCHANT_ID = StageConfig.BRAINTREE_MERCHANT_ID

    gateway = braintree.BraintreeGateway(
        braintree.Configuration(
            str(StageConfig.BRAINTREE_MERCHANT_ENV),
            str(StageConfig.BRAINTREE_MERCHANT_ID),
            str(StageConfig.BRAINTREE_PUBLIC_KEY),
            str(StageConfig.BRAINTREE_PRIVATE_KEY)
        )
    )

class BraintreeClient(object):

    def __init__(self):
        self.gateway = gateway
        self.merchant_id = BRAINTREE_MERCHANT_ID
