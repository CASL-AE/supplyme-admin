# app.py

# [START app]
import logging

from celery import Celery
from flask import Flask
from flask_cors import CORS
from flask_bcrypt import Bcrypt
import os

from server.env import APP_ENV

# [START Settings]
SETTINGS_DIR = os.path.dirname(__file__)
PROJECT_PATH = os.path.join(SETTINGS_DIR, os.pardir)
# [END Settings]

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Define Static & Templated Directories
app = Flask(__name__)
CORS(app)

# Configure App with Environment Settings
app.config.from_object(APP_ENV)

celery = Celery(app.import_name, broker=app.config['BROKER_URL'])
celery.conf.update(app.config)

# Initialize Bcrypt
bcrypt = Bcrypt(app)


# Endpoint Blue Prints

from server.google.api import google_blueprint
app.register_blueprint(google_blueprint)

from server.braintree.api import braintree_blueprint
app.register_blueprint(braintree_blueprint)

from server.dwolla.api import dwolla_blueprint
app.register_blueprint(dwolla_blueprint)

# Main Flask App Run
if __name__ == "__main__":
    app.run(host='127.0.0.1', port=8081)
