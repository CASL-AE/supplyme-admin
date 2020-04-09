
import hmac
from hashlib import sha256

class DwollaWebhook(object):
    def __init__(self, app_token=None):
        self.app_token = app_token
        if not self.app_token:
            error = 'Invalid Dwolla App Token Set {}'.format(self.app_token)
            logger.error(error)
            raise ValueError(error)

    def create(self):
        try:
            params = {
                'url': '/webhook/dwolla/disbursement',
                'secret': Config.get_env_var('SECRET_KEY')
            }
            webhook = self.app_token.post('webhook-subscriptions', params)
            return webhook.body['total']
        except Exception as e:
            logger.error('Error creating dwolla webhook; Error: %s', e)
            raise e

    def validate(self, proposed_sig=None, payload_body=None):
        try:
            sig = hmac.new(Config.get_env_var('SECRET_KEY'), payload_body, sha256).hexdigest()
            return True if (sig == proposed_sig) else False
        except Exception as e:
            logger.error('Error validating dwoll webhook; Error: %s', e)
            raise e

    def find(self, webhookSUID=None):
        try:
            webhook = self.app_token.get(webhookSUID)
            return webhook.body['created']
        except Exception as e:
            logger.error('Error finding dwoll webhook funds; Error: %s', e)
            raise e
