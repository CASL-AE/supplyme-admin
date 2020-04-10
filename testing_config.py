from flask_testing import TestCase
from server import app
import os
from setup import basedir
import json
from celery import Celery

from server.env import APP_ENV

# Xupply
from server.models import XupplyReferences
# from server.account.model import XupplyAccount
# from server.transaction.model import XupplyTransaction
# from server.transfer.model import XupplyTransfer

from datetime import datetime

class BaseTestConfig(TestCase):

    # Retailer
    retailerID = 'h54JYHQR12j71Cnc5joE'
    retailer_ref = XupplyReferences().accounts_ref.document(retailerID)

    # Manufacturer
    manufacturerID = 'umqoCh6oUbyNHj4DcLyV'
    manufacturer_ref = XupplyReferences().accounts_ref.document(manufacturerID)

    # Financier
    financierID = 'q6qQXzmdwlz4QZu4zIvb'
    financier_ref = XupplyReferences().accounts_ref.document(financierID)

    token = 'eyJhbGciOiJSUzI1NiIsImtpZCI6Ijk4MGVkMGQ3ODY2ODk1Y2E0M2MyMGRhZmM4NTlmMThjNjcwMWU3OTYiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vbW92ZWhhcHB5LTYxZWY5IiwiYXVkIjoibW92ZWhhcHB5LTYxZWY5IiwiYXV0aF90aW1lIjoxNTYwMjMwMDg0LCJ1c2VyX2lkIjoiQ2loakVyeE5tcWVtNnNTV0V1eWRwRXgyM0pKMyIsInN1YiI6IkNpaGpFcnhObXFlbTZzU1dFdXlkcEV4MjNKSjMiLCJpYXQiOjE1NjA5ODE5MTYsImV4cCI6MTU2MDk4NTUxNiwiZW1haWwiOiJkZW5pc2FuZ2VsbEBoYXJwYW5nZWxsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwiZmlyZWJhc2UiOnsiaWRlbnRpdGllcyI6eyJlbWFpbCI6WyJkZW5pc2FuZ2VsbEBoYXJwYW5nZWxsLmNvbSJdfSwic2lnbl9pbl9wcm92aWRlciI6InBhc3N3b3JkIn19.b6z1qaumyH6TGm8bVwmPHAFz9PzNpRybHZvIHsBiFgKAP1zO8Ls2VT7RNnPlxctqGfCPltnIY0Q0Z3bweaIhansFmHJZNZXLpIpZCPJAM9aAu4xv-pbRnX0ritpwzxPNrTQ0te_OzE_xX0WWZ6dejqFWMoJSMYPeFzlas1mHHZOPLnaCNYN5uGwE6GFHVl29_h5MvvRMchOYoalC1S8u6vo9BnCbIvBcI6h_GMwLsSjOYi_1JZjp91ni9J8LBvidV6BORAyozAONqkz8D8ZpNBKq246XI1rxfImmz2heIGA86cfu4kz_iJ_7ew7jLgz68qPBvF39ECL6alKMxYKrgg'

    headers = {
        'Authorization': 'Bearer {}'.format(token),
    }

    bad_headers = {
        'Authorization': 'Bearer {}'.format(token + "bad"),
    }

    def set_up_retailer(self):
        retailer_doc = retailer_ref.get()
        retailer_dict = retailer_doc.to_dict()
        self.assertEqual(retailer_dict['accountID'], retailerID)
        self.retailer = XupplyAccount().dict_snapshot(snapshot=retailer_dict)

    def set_up_manufacturer(self):
        manufacturer_doc = manufacturer_ref.get()
        manufacturer_dict = manufacturer_doc.to_dict()
        self.assertEqual(manufacturer_dict['accountID'], manufacturerID)
        self.manufacturer = XupplyAccount().dict_snapshot(snapshot=manufacturer_dict)

    def set_up_financier(self):
        financier_doc = financier_ref.get()
        financier_dict = financier_doc.to_dict()
        self.assertEqual(financier_dict['accountID'], financierID)
        self.financier = XupplyAccount().dict_snapshot(snapshot=financier_dict)

    def create_app(self):
        app.config.from_object('server.config.DevelopmentConfig')
        celery = Celery(app.import_name, broker=app.config['BROKER_URL'])
        celery.conf.update(app.config)
        return app

    def setUp(self):
        self.set_up_retailer()
        self.set_up_manufacturer()
        self.set_up_financier()

        self.app = self.create_app().test_client()

    def tearDown(self):
        print('Tear Down')
