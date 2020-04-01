# config.py
import os
import json
import datetime
from logging.config import dictConfig
from firebase_admin import credentials
from oauth2client.service_account import ServiceAccountCredentials

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

from server.env import APP_ENV

if APP_ENV == 'server.config.ProductionConfig':
    CREDENTIAL_DIR = os.path.join(BASE_DIR, 'xupply-dev')
if APP_ENV == 'server.config.DevelopmentConfig':
    CREDENTIAL_DIR = os.path.join(BASE_DIR, 'xupply-dev')
if APP_ENV == 'server.config.StageConfig':
    CREDENTIAL_DIR = os.path.join(BASE_DIR, 'xupply-dev')

class Config(object):
    SECRET_KEY = os.environ.get('secret_KEY')

    ENV_PATH = os.path.join(CREDENTIAL_DIR, 'env_var.json')

    with open(ENV_PATH) as f:
        configs = json.loads(f.read())

    def get_env_var(setting, configs=configs):
        try:
            val = configs[setting]
            if val == 'True':
                val = True
            elif val == 'False':
                val = False
            return val
        except KeyError:
            error_msg = "ImproperlyConfigured: Set {0} environment variable".format(setting)
            raise ValueError(error_msg)

    GMAIL_SCOPES = 'https://www.googleapis.com/auth/gmail.send'

    BROKER_URL = 'redis://localhost:6379/1'
    CELERY_RESULT_BACKEND = 'redis://localhost:6379/1'
    CELERY_ACCEPT_CONTENT = ['json', ]
    CELERY_TASK_SERIALIZER = 'json'
    CELERY_RESULT_SERIALIZER = 'json'
    CELERY_TASK_RESULT_EXPIRES = 3600

class ProductionConfig(Config):
    DEBUG = False
    TESTING = False
    CSRF_ENABLED = True

    dictConfig({
        'version': 1,
        'disable_existing_loggers': False,
        'formatters': {
            'simple': {
                'format': '%(asctime)s - %(name)s - %(filename)s - %(funcName)s - %(levelname)s - %(message)s'
            },
        },
        'handlers': {
            'console': {
                'class': 'logging.StreamHandler',
                'level': 'DEBUG',
            },
            'logfile': {
                'class': 'logging.handlers.WatchedFileHandler',
                'filename': 'logs/main.log',
                'formatter': 'simple',
                'level': 'DEBUG',
            },
        },
        'loggers': {
            'verdoc': {
                'handlers': ['console'],
                'level': 'DEBUG',
                'propagate': True
            },
        },
    })

    credential_path = None
    credential_path = os.path.join(CREDENTIAL_DIR, 'firestore-adminsdk.json')
    FIRESTORE_CRED = credentials.Certificate(credential_path)

    credential_path = None
    credential_path = os.path.join(CREDENTIAL_DIR, 'gmail-adminsdk.json')
    GMAIL_CRED = ServiceAccountCredentials.from_json_keyfile_name(credential_path, scopes=Config.GMAIL_SCOPES)

class DevelopmentConfig(Config):
    DEVELOPMENT = True
    DEBUG = True
    CSRF_ENABLED = True

    dictConfig({
        'version': 1,
        'disable_existing_loggers': False,
        'formatters': {
            'simple': {
                'format': '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
            },
        },
        'handlers': {
            'console': {
                'class': 'logging.StreamHandler'
            },
        },
        'loggers': {
            'verdoc': {
                'handlers': ['console'],
                'level': 'DEBUG',
                'propagate': True
            },
        },
    })

    credential_path = None
    credential_path = os.path.join(CREDENTIAL_DIR, 'firestore-adminsdk.json')
    FIRESTORE_CRED = credentials.Certificate(credential_path)

    credential_path = None
    credential_path = os.path.join(CREDENTIAL_DIR, 'gmail-adminsdk.json')
    GMAIL_CRED = ServiceAccountCredentials.from_json_keyfile_name(credential_path, scopes=Config.GMAIL_SCOPES)

class StageConfig(Config):
    DEBUG = False
    dictConfig({
        'version': 1,
        'disable_existing_loggers': False,
        'formatters': {
            'simple': {
                'format': '%(asctime)s - %(name)s - %(filename)s - %(funcName)s - %(levelname)s - %(message)s'
            },
        },
        'handlers': {
            'console': {
                'class': 'logging.StreamHandler',
                'level': 'DEBUG',
            },
            'logfile': {
                'class': 'logging.handlers.WatchedFileHandler',
                'filename': 'logs/main.log',
                'formatter': 'simple',
                'level': 'DEBUG',
            },
        },
        'loggers': {
            'verdoc': {
                'handlers': ['console'],
                'level': 'DEBUG',
                'propagate': True
            },
        },
    })

    credential_path = None
    credential_path = os.path.join(CREDENTIAL_DIR, 'firestore-adminsdk.json')
    FIRESTORE_CRED = credentials.Certificate(credential_path)

    credential_path = None
    credential_path = os.path.join(CREDENTIAL_DIR, 'gmail-adminsdk.json')
    GMAIL_CRED = ServiceAccountCredentials.from_json_keyfile_name(credential_path, scopes=Config.GMAIL_SCOPES)
