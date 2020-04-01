# utils/firebase.py

import logging
from threading import *
import time

logger = logging.getLogger('btl.utils/firestore.py')

from server.env import APP_ENV


import firebase_admin
from firebase_admin import firestore
from firebase_admin import auth

from google.auth.transport import requests
from google.oauth2 import id_token

# Verify token is from FireStore
# TODO: None
# [START FireStore Token Verify]
def verify_firebase_token(token):
    return id_token.verify_firebase_token(token, requests.Request())
# [END Verify FireStore Token]

if APP_ENV == 'server.config.ProductionConfig':
    from server.config import ProductionConfig
    logger.info('Firestore Config: Prod DB')

    mainApp = firebase_admin.initialize_app(ProductionConfig.FIRESTORE_CRED, options={
        'projectId': 'veridoc-e0f85'
    })

    # admin_bucket = storage.bucket()
    admin_db = firestore.client()
    admin_transaction = admin_db.transaction()
    admin_auth = auth

elif APP_ENV == 'server.config.DevelopmentConfig':
    from server.config import DevelopmentConfig
    logger.info('Firestore Config: Dev DB')

    mainApp = firebase_admin.initialize_app(DevelopmentConfig.FIRESTORE_CRED, options={
        'projectId': 'veridoc-e0f85'
    })

    # admin_bucket = storage.bucket()
    admin_db = firestore.client()
    admin_transaction = admin_db.transaction()
    admin_auth = auth

elif APP_ENV == 'server.config.StageConfig':
    from server.config import StageConfig
    logger.info('Firestore Config: Stage DB')

    mainApp = firebase_admin.initialize_app(StageConfig.FIRESTORE_CRED, options={
        'projectId': 'veridoc-e0f85'
    })

    # admin_bucket = storage.bucket()
    admin_db = firestore.client()
    admin_transaction = admin_db.transaction()
    admin_auth = auth
