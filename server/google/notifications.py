# xupply/google/notifications.py

import logging

# Create Logger
logger = logging.getLogger('xupply.google.notifications.py')

# from server import celery

from server.utils.google.gmail.objects.account import XupplyAccountEmails
from server.utils.google.gmail.objects.employee import XupplyEmployeeEmails

# Account Activation Code Email Notification
# TODO: None
# [START Account Activation Code Email Notification]
# @celery.task()
def account_code_email_notification_task(to_name=None, to_account_name=None, from_name=None, user_email=None, activation_code=None):
    try:
        logger.info('Sending Account Authorization Email for code: {}'.format(activation_code))
        XupplyAccountEmails(user_email=user_email).send_activation_code_email(
            to_name=to_name,
            to_account_name=to_account_name,
            from_name=from_name,
            activation_code=activation_code,
        )
    except Exception as e:
        logger.error('Error on Account Activation Code Email Notification; Error: {}'.format(e))
# [END Account Activation Code Email Notification]

# Account Registration Email Notification
# TODO: None
# [START Account Registration Email Notification]
# @celery.task()
def account_registration_email_notification_task(to_name=None, to_account_name=None, from_name=None, user_email=None):
    try:
        logger.info('Sending Account Registration Email for code: {}'.format(to_account_name))
        XupplyAccountEmails(user_email=user_email).send_registration_email(
            to_name=to_name,
            to_account_name=to_account_name,
            from_name=from_name,
        )
    except Exception as e:
        logger.error('Error on Account Registration Email Notification; Error: {}'.format(e))
# [END Account Registration Email Notification]

# Employee Activation Code Email Notification
# TODO: None
# [START Employee Activation Code Email Notification]
# @celery.task()
def employee_code_email_notification_task(to_name=None, to_account_name=None, from_name=None, user_email=None, activation_code=None):
    try:
        logger.info('Sending Employee Authorization Email for code: {}'.format(activation_code))
        XupplyEmployeeEmails(user_email=user_email).send_activation_code_email(
            to_name=to_name,
            to_account_name=to_account_name,
            from_name=from_name,
            activation_code=activation_code,
        )
    except Exception as e:
        logger.error('Error on Employee Activation Code Email Notification; Error: {}'.format(e))
# [END Employee Activation Code Email Notification]
