from flask_testing import TestCase
from server import app
from server.utils import firestore
import os
import json
# from celery import Celery

class BaseTestConfig(TestCase):
    token = 'eyJhbGciOiJSUzI1NiIsImtpZCI6IjFmODhiODE0MjljYzQ1MWEzMzVjMmY1Y2RiM2RmYjM0ZWIzYmJjN2YiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vdmVyaWRvYy1lMGY4NSIsImF1ZCI6InZlcmlkb2MtZTBmODUiLCJhdXRoX3RpbWUiOjE1ODUzNjYxMzAsInVzZXJfaWQiOiI2S0dIcktmaW5lZlVRVnNiV3ZETGloZWNZak0yIiwic3ViIjoiNktHSHJLZmluZWZVUVZzYld2RExpaGVjWWpNMiIsImlhdCI6MTU4NTM2NjEzMSwiZXhwIjoxNTg1MzY5NzMxLCJlbWFpbCI6ImRlbmlzQGNhc2xucG8ub3JnIiwiZW1haWxfdmVyaWZpZWQiOmZhbHNlLCJmaXJlYmFzZSI6eyJpZGVudGl0aWVzIjp7ImVtYWlsIjpbImRlbmlzQGNhc2xucG8ub3JnIl19LCJzaWduX2luX3Byb3ZpZGVyIjoicGFzc3dvcmQifX0.AFWRUhrYVEDeBrlrGYGyEVAKfzVTBQyZeODzLAkvte-oKxR-SVnnzeSmUI-J830sdD8YfityGDO9SgwI0-riCufqXsbEyKwbpP9kUjmWY2Q8tV8wTMpsuH9eZzvbg4mpIKbJYGcWJ3nUxlYwxCJqZPsAJsx9u7PnTmleWBcaLKSEZM_mW5nPz4auHx-Rg_BMcOaj9cHL7ZUTlD3qttg23rPFwCmPIhV5C48SlihLm7WcT_TR9YSxAlgwbmmSOYfbDrfJQtkqTfKXBFWP_mM7-6by6e23Y6ffU990GixaXJI_YycY_D3irD0eMP01Ly8dB6SVoaX2IyAPLQUMwfWLzg'

    headers = {
        'Authorization': 'Bearer {}'.format(token),
    }

    def create_app(self):
        app.config.from_object('server.config.DevelopmentConfig')
        # celery = Celery(app.import_name, broker=app.config['BROKER_URL'])
        # celery.conf.update(app.config)
        return app

    def setUp(self):
        self.app = self.create_app().test_client()

    def tearDown(self):
        print('Tear Down')
