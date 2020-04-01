# server/utils/google/gmail/objects/establishment.py

import logging
import time

logger = logging.getLogger('cattail.utils.google.gmail.objects.establishment.py')

from server.utils.google.gmail.client import XupplyGoogleClient

BASE_DOMAIN = 'https://app.localhost'
# BASE_DOMAIN = 'https://app.caslnpo.org'

class XupplyAccountEmails(object):
    def __init__(self, user_email=None):
        self.user_email = user_email
        self.email_server = XupplyGoogleClient(self.user_email)

    # Activation Code Email
    # TODO
    # [START Activation Code Email]
    def send_activation_code_email(self, to_name=None, to_account_name=None, from_name=None, activation_code=None):
        try:
            to = self.user_email
            campaign_id = activation_code
            subject = 'Your Exclusive Xupply Invite'
            header = 'Congratulations {},'.format(to_name)
            body = 'Your account {} has been approved for Xupply. Please use the key below to register your account.'.format(to_account_name)
            abody = '<a href="{base_domain}/register?type={is_type}&code={code}">{code}</a>'.format(base_domain=BASE_DOMAIN, is_type='account', code=activation_code)
            footer = 'Cheers,'
            footer_sign = from_name
            email = self.email_server.email_template_single_body(
                campaign_id=campaign_id,
                subject=subject,
                header=header,
                body=body,
                abody=abody,
                footer=footer,
                footer_sign=footer_sign
            )
            message_text_html = r'{}'.format(email)
            message_without_attachment = self.email_server.create_message_without_attachment(self.email_server.sender, to, subject, message_text_html)
            self.email_server.send_message_without_attachement(self.email_server.service, "me", message_without_attachment)
            logger.info('Activate Code Email Sent!')
        except Exception as e:
            logger.error('Error Sending Activation Code Email; Error: %s', e)
    # [END Activation Code Email]

    # Registration Email
    # TODO: None
    # [START Registration Email]
    def send_registration_email(self, to_name=None, to_account_name=None, from_name=None, activation_code=None):
        try:
            to = self.user_email
            campaign_id = activation_code
            subject = 'Welcome to Xupply'
            header = 'Dear {},'.format(to_name)
            body = 'We have registered {} in Xupply. Once you have finshed creating locations, you will be able to create requests with Xupply'.format(to_account_name)
            abody = None
            footer = 'Cheers,'
            footer_sign = from_name
            email = self.email_server.email_template_single_body(
                campaign_id=campaign_id,
                subject=subject,
                header=header,
                body=body,
                abody=abody,
                footer=footer,
                footer_sign=footer_sign
            )
            message_text_html = r'{}'.format(email)
            message_without_attachment = self.email_server.create_message_without_attachment(self.email_server.sender, to, subject, message_text_html)
            self.email_server.send_message_without_attachement(self.email_server.service, "me", message_without_attachment)
            logger.info('Registration Email Sent!')
        except Exception as e:
            logger.error('Error Sending Registration Email; Error: %s', e)
    # [END Registration Email]
