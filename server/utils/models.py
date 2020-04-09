# server/xupply/models.py


import logging

# Create Logger
logger = logging.getLogger('xupply.models.py')

import time
from server.utils import firestore as fs
from firebase_admin import firestore
from datetime import datetime
import re

db = fs.admin_db

# Xupply References
# [START Xupply References]
class XupplyReferences(object):
    # Init
    # TODO: None
    # [START Init]
    def __init__(self):
        self.transaction_ref = db.transaction()
        self.users_ref = db.collection('MasterUserList')
        self.accounts_ref = db.collection('Accounts')
# [END Xupply References]
