# server/utils/google/gmail/objects/employee.py

import logging
import time

logger = logging.getLogger('cattail.utils.google.gmail.objects.employee.py')

from server.utils.google.gmail.client import XupplyGoogleClient

BASE_DOMAIN = 'https://app.localhost'
# BASE_DOMAIN = 'https://app.cattails.io'

class XupplyEmployeeEmails(object):
    def __init__(self, user_email=None):
        self.user_email = user_email
        self.email_server = XupplyGoogleClient(self.user_email)

    # Activation Code Email
    # TODO: None
    # [START Activation Code Email]
    def send_activation_code_email(self, to_name=None, to_account_name=None, from_name=None, activation_code=None):
        to = self.user_email
        campaign_id = activation_code
        subject = 'Welcome to Xupply'
        header = 'Congratulations {},'.format(to_name)
        body = 'You have been approved for Xupply by {}. Please use the key below to register your account.'.format(to_account_name)
        abody = '<a href="{base_domain}/register?type={isType}&code={code}">{code}</a>'.format(base_domain=BASE_DOMAIN, isType='employee', code=activation_code)
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
    # [END Activation Code Email]
