# server/utils/google.client.py

import logging
import time

logger = logging.getLogger('xupply.utils.google.gmail.client.py')

from server.env import APP_ENV

import httplib2
import os
import base64
from email import encoders
import google_auth_oauthlib.flow
from oauth2client.file import Storage
import google.oauth2.credentials
from oauth2client import client
from oauth2client import tools

import smtplib
import mimetypes
from email import encoders
from email.message import Message
from email.mime.audio import MIMEAudio
from email.mime.base import MIMEBase
from email.mime.image import MIMEImage
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.application import MIMEApplication

from apiclient import errors, discovery

SCOPES = 'https://www.googleapis.com/auth/gmail.send'

class XupplyGoogleClient(object):
    def __init__(self, userEmail):
        self.sender = 'support@caslnpo.org'
        self.userEmail = userEmail
        self.service = self.get_service()
        self.analytics_id = 'UA-107201661-1'

    # Get Server Credentials
    # TODO: None
    # [START Get Server Credentials]
    def get_credentials(self):
        try:
            credentials = ''
            if APP_ENV == 'server.config.DevelopmentConfig':
                from server.config import Config, DevelopmentConfig
                credentials = DevelopmentConfig.GMAIL_CRED.create_delegated('support@caslnpo.org')
                self.analytics_id = 'UA-107201661-1'
            elif APP_ENV == 'server.config.ProductionConfig':
                from server.config import Config, ProductionConfig
                credentials = ProductionConfig.GMAIL_CRED.create_delegated('support@caslnpo.org')
                self.analytics_id = 'UA-107201661-2'
            elif APP_ENV == 'server.config.StageConfig':
                from server.config import Config, StageConfig
                credentials = StageConfig.GMAIL_CRED.create_delegated('support@caslnpo.org')
                self.analytics_id = 'UA-107201661-2'
            return credentials
        except Exception as e:
            logger.error('Error Getting Google Gmail Api Credentials; Error: {}'.format(e))

    # [END Get Server Credentials]


    # Get Gmail Service
    # TODO: None
    # [START Get Gmail Service]
    def get_service(self):
        try:
            credentials = self.get_credentials()
            # Create an httplib2.Http object to handle our HTTP requests, and authorize it using credentials.authorize()
            http = httplib2.Http()

            # http is the authorized httplib2.Http()
            http = credentials.authorize(http)  # or: http = credentials.authorize(httplib2.Http())

            return discovery.build('gmail', 'v1', http=http)
        except Exception as e:
            logger.error('Error Getting Google Gmail Service; Error: %s', e)

    # [END Get Gmail Service]

    # Create Email WITHOUT Attachment
    # TODO: None
    # [START Create Email WITHOUT Attachment]
    def create_message_without_attachment(self, sender, to, subject, message_text_html):
        try:
            message = MIMEMultipart('alternative')
            message['Subject'] = subject
            message['From'] = sender
            message['To'] = to
            message.attach(MIMEText(message_text_html, 'html'))
            raw_message_no_attachment = base64.urlsafe_b64encode(message.as_bytes())
            raw_message_no_attachment = raw_message_no_attachment.decode()
            body = {'raw': raw_message_no_attachment}
            return body
        except Exception as e:
            logger.error('Error Creating Email Without Attachment; Error: %s', e)

    # [END Create Email WITHOUT Attachment]

    # Create Email WITH Attachment
    # TODO
    # [START Create Email WITH Attachment]
    def create_message_with_attachment(self, sender, to, subject, message_text_html, attached_file):
        """Create a message for an email.

        message_text: The text of the email message.
        attached_file: The path to the file to be attached.

        Returns:
        An object containing a base64url encoded email object.
        """

        ##An email is composed of 3 part :
        # part 1: create the message container using a dictionary { to, from, subject }
        # part 2: attach the message_text with .attach() (could be plain and/or html)
        # part 3(optional): an attachment added with .attach()

        ## Part 1
        message = MIMEMultipart()  # when alternative: no attach, but only plain_text
        message['to'] = to
        message['from'] = sender
        message['subject'] = subject

        ## Part 2   (the message_text)
        # The order count: the first (html) will be use for email, the second will be attached (unless you comment it)
        message.attach(MIMEText(message_text_html, 'html'))

        ## Part 3 (attachement)
        # # to attach a text file you containing "test" you would do:
        # # message.attach(MIMEText("test", 'plain'))

        # -----About MimeTypes:
        # It tells gmail which application it should use to read the attachement (it acts like an extension for windows).
        # If you dont provide it, you just wont be able to read the attachement (eg. a text) within gmail. You'll have to download it to read it (windows will know how to read it with it's extension).

        # -----3.1 get MimeType of attachment
        # option 1: if you want to attach the same file just specify it’s mime types

        # option 2: if you want to attach any file use mimetypes.guess_type(attached_file)

        my_mimetype, encoding = mimetypes.guess_type(attached_file)

        # If the extension is not recognized it will return: (None, None)
        # If it's an .mp3, it will return: (audio/mp3, None) (None is for the encoding)
        # for unrecognized extension it set my_mimetypes to  'application/octet-stream' (so it won't return None again).
        if my_mimetype is None or encoding is not None:
            my_mimetype = 'application/octet-stream'

        main_type, sub_type = my_mimetype.split('/', 1)  # split only at the first '/'
        # if my_mimetype is audio/mp3: main_type=audio sub_type=mp3

        # -----3.2  creating the attachement
        # you don't really "attach" the file but you attach a variable that contains the "binary content" of the file you want to attach

        # option 1: use MIMEBase for all my_mimetype (cf below)  - this is the easiest one to understand
        # option 2: use the specific MIME (ex for .mp3 = MIMEAudio)   - it's a shorcut version of MIMEBase

        # this part is used to tell how the file should be read and stored (r, or rb, etc.)
        if main_type == 'text':
            temp = open(attached_file, 'r')  # 'rb' will send this error: 'bytes' object has no attribute 'encode'
            attachement = MIMEText(temp.read(), _subtype=sub_type)
            temp.close()

        elif main_type == 'image':
            temp = open(attached_file, 'rb')
            attachement = MIMEImage(temp.read(), _subtype=sub_type)
            temp.close()

        elif main_type == 'audio':
            temp = open(attached_file, 'rb')
            attachement = MIMEAudio(temp.read(), _subtype=sub_type)
            temp.close()

        elif main_type == 'application' and sub_type == 'pdf':
            temp = open(attached_file, 'rb')
            attachement = MIMEApplication(temp.read(), _subtype=sub_type)
            temp.close()

        else:
            attachement = MIMEBase(main_type, sub_type)
            temp = open(attached_file, 'rb')
            attachement.set_payload(temp.read())
            temp.close()

        # -----3.3 encode the attachment, add a header and attach it to the message
        encoders.encode_base64(attachement)  # https://docs.python.org/3/library/email-examples.html
        filename = os.path.basename(attached_file)
        attachement.add_header('Content-Disposition', 'attachment', filename=filename)  # name preview in email
        message.attach(attachement)

        ## Part 4 encode the message (the message should be in bytes)
        message_as_bytes = message.as_bytes()  # the message should converted from string to bytes.
        message_as_base64 = base64.urlsafe_b64encode(message_as_bytes)  # encode in base64 (printable letters coding)
        raw = message_as_base64.decode()  # need to JSON serializable (no idea what does it means)
        return {'raw': raw}

    # [END Create Email WITH Attachment]

    # Send Email WITHOUT Attachment
    # TODO: None
    # [START Send Email WITHOUT Attachment]
    def send_message_without_attachement(self, service, user_id, body):
        try:
            message_sent = (service.users().messages().send(userId=user_id, body=body).execute())
            message_id = message_sent['id']
            logger.info('Email: %s WITHOUT Attachment Sent', message_id)
        except errors.HttpError as e:
            logger.error('Error Sending Email WITHOUT Attachment: %s', e)

    # [END Send Email WITHOUT Attachment]

    # Send Email WITH Attachment
    # TODO: None
    # [START Send Email WITH Attachment]
    def send_message_with_attachement(self, service, user_id, message_with_attachment, attached_file):
        """Send an email message.

        Args:
        service: Authorized Gmail API service instance.
        user_id: User's email address. The special value "me" can be used to indicate the authenticated user.
        message: Message to be sent.

        Returns:
        Sent Message.
        """
        try:
            message_sent = (service.users().messages().send(userId=user_id, body=message_with_attachment).execute())
            message_id = message_sent['id']

            # return message_sent
        except errors.HttpError as error:
            logger.error('An error occurred: {%s}', error)

    # [END Send Email WITH Attachment]

    # Email Template Single Body
    # TODO: None
    # [START Email Template Single Body]
    def email_template_single_body(
        self,
        campaign_id=None,
        subject=None,
        header=None,
        body=None,
        abody=None,
        footer=None,
        footer_sign=None):
        try:
            email = '''
            <html xmlns="http://www.w3.org/1999/xhtml">
            <head>
            <meta http-equiv="content-type" content="text/html; charset=utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0;">
            <meta name="format-detection" content="telephone=no"/>
            <!-- MESSAGE SUBJECT -->
            <title>{subject}</title>
            </head>
            <!-- BODY -->
            <!-- Set message background color (twice) and text color (twice) -->
            <body topmargin="0" rightmargin="0" bottommargin="0" leftmargin="0" marginwidth="0" marginheight="0" width="100%" style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0; width: 100%; height: 100%; -webkit-font-smoothing: antialiased; text-size-adjust: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; line-height: 100%;
            color: #000000; background-image: url('https://virtualtabs.org/images/hero-bg.jpg');"
            text="#000000">
            <!-- SECTION / BACKGROUND -->
            <!-- Set message background color one again -->
            <table width="100%" align="center" border="0" cellpadding="0" cellspacing="0" style="background-image: url('https://virtualtabs.org/images/hero-bg.jpg'); border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0; width: 100%;" class="background"><tr><td align="center" valign="top" style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0;">
            <!-- WRAPPER -->
            <!-- Set wrapper width (twice) -->
            <table border="0" cellpadding="0" cellspacing="0" align="center"
            width="560" style="border-collapse: collapse; border-spacing: 0; padding: 0; width: inherit;
            max-width: 560px;" class="wrapper">
            <tr>
              <td align="center" valign="top" style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0; padding-left: 6.25%; padding-right: 6.25%; width: 87.5%;
                padding-top: 20px;
                padding-bottom: 20px;">
                <!-- PREHEADER -->
                <!-- Set text color to background color -->
                <div style="display: none; visibility: hidden; overflow: hidden; opacity: 0; font-size: 1px; line-height: 1px; height: 0; max-height: 0; max-width: 0;
                color: #172C47;" class="preheader">
                  {header}</div>
                <!-- LOGO -->
                <!-- Image text color should be opposite to background color. Set your url, image src, alt and title. Alt text should fit the image size. Real image size should be x2. URL format: http://domain.com/?utm_source={{Campaign-Source}}&utm_medium=email&utm_content=logo&utm_campaign={{Campaign-Name}} -->
              </td>
            </tr>
            <!-- End of WRAPPER -->
            </table>
            <!-- WRAPPER / CONTEINER -->
            <!-- Set conteiner background color -->
            <table border="0" cellpadding="0" cellspacing="0" align="center"
            bgcolor="#FFFFFF"
            width="560" style="border-collapse: collapse; border-spacing: 0; padding: 0; width: inherit;
            max-width: 560px;" class="container">
            <!-- HERO IMAGE -->
            <!-- Image text color should be opposite to background color. Set your url, image src, alt and title. Alt text should fit the image size. Real image size should be x2 (wrapper x2). Do not set height for flexible images (including "auto"). URL format: http://domain.com/?utm_source={{Campaign-Source}}&utm_medium=email&utm_content={{Ìmage-Name}}&utm_campaign={{Campaign-Name}} -->
            <tr>
              <td align="center" valign="top" style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0;
                padding-top: 20px;" class="hero"><a target="_blank" style="text-decoration: none;"
                href="https://virtualtabs.org/"><img border="0" vspace="0" hspace="0"
                src="https://app.virtualtabs.org/src/containers/App/styles/img/logo.png"
                alt="Please enable images to view this content" title="Hero Image"
                width="100" style="
                width: 100%;
                max-width: 100px;
                color: #000000; font-size: 13px; margin: 0; padding: 0; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; border: none; display: block;"/></a></td>
            </tr>
            <!-- HEADER -->
            <!-- Set text color and font family ("sans-serif" or "Georgia, serif") -->
            <tr>
              <td align="center" valign="top" style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0; padding-left: 6.25%; padding-right: 6.25%; width: 87.5%; font-size: 24px; font-weight: bold; line-height: 130%;
                padding-top: 25px;
                color: #000000;
                font-family: sans-serif;" class="header">
                  {subject}
              </td>
            </tr>
            <!-- SUBHEADER -->
            <!-- Set text color and font family ("sans-serif" or "Georgia, serif") -->
            <tr>
              <td align="center" valign="top" style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0; padding-bottom: 3px; padding-left: 6.25%; padding-right: 6.25%; width: 87.5%; font-size: 18px; font-weight: 300; line-height: 150%;
                padding-top: 15px;
                color: #000000;
                font-family: sans-serif;" class="subheader">
                  {header}
              </td>
            </tr>
            <!-- BODY -->
            <!-- Set text color and font family ("sans-serif" or "Georgia, serif"). Duplicate all text styles in links, including line-height -->
            <tr>
              <td align="center" valign="top" style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0; padding-left: 6.25%; padding-right: 6.25%; width: 87.5%; font-size: 17px; font-weight: 400; line-height: 160%;
                padding-top: 25px;
                color: #000000;
                font-family: sans-serif;" class="paragraph">
                  {body}
              </td>
            </tr>
            <!-- A BODY -->
            <!-- Set text color and font family ("sans-serif" or "Georgia, serif"). Duplicate all text styles in links, including line-height -->
            <tr>
              <td align="center" valign="top" style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0; padding-left: 6.25%; padding-right: 6.25%; width: 87.5%; font-size: 17px; font-weight: 400; line-height: 160%;
                padding-top: 25px;
                color: #000000;
                font-family: sans-serif;" class="paragraph">
                  {abody}
              </td>
            </tr>
            <!-- PARAGRAPH -->
            <!-- Set text color and font family ("sans-serif" or "Georgia, serif"). Duplicate all text styles in links, including line-height -->
            <tr>
              <td align="center" valign="top" style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0; padding-left: 6.25%; padding-right: 6.25%; width: 87.5%; font-size: 17px; font-weight: 400; line-height: 160%;
                padding-top: 20px;
                padding-bottom: 25px;
                color: #000000;
                font-family: sans-serif;" class="paragraph">
                  <span style="font-family: sans-serif; font-size: 17px; font-weight: 400; line-height: 160%;">{footer}</span>
                  <br/>
                  <span style="font-family: sans-serif; font-size: 17px; font-weight: 400; line-height: 160%;">{footer_sign}</span>
              </td>
            </tr>
            <!-- LINE -->
            <!-- Set line color -->
            <tr>
              <td align="center" valign="top" style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0; padding-left: 6.25%; padding-right: 6.25%; width: 87.5%;
                padding-top: 25px;" class="line"><hr
                color="#E0E0E0" align="center" width="100%" size="1" noshade style="margin: 0; padding: 0;" />
              </td>
            </tr>
            <!-- PARAGRAPH -->
            <!-- Set text color and font family ("sans-serif" or "Georgia, serif"). Duplicate all text styles in links, including line-height -->
            <tr>
              <td align="center" valign="top" style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0; padding-left: 6.25%; padding-right: 6.25%; width: 87.5%; font-size: 17px; font-weight: 400; line-height: 160%;
                padding-top: 20px;
                padding-bottom: 25px;
                color: #000000;
                font-family: sans-serif;" class="paragraph">
                  Have a&nbsp;question? <a href="mailto:support@virtualtabs.org" target="_blank" style="color: #127DB3; font-family: sans-serif; font-size: 17px; font-weight: 400; line-height: 160%;">support@virtualtabs.org</a>
              </td>
            </tr>
            <!-- End of WRAPPER -->
            </table>
            <!-- WRAPPER -->
            <!-- Set wrapper width (twice) -->
            <table border="0" cellpadding="0" cellspacing="0" align="center"
            width="560" style="border-collapse: collapse; border-spacing: 0; padding: 0; width: inherit;
            max-width: 560px;" class="wrapper">
            <!-- SOCIAL NETWORKS -->
            <!-- Image text color should be opposite to background color. Set your url, image src, alt and title. Alt text should fit the image size. Real image size should be x2 -->
            <tr>
              <td align="center" valign="top" style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0; padding-left: 6.25%; padding-right: 6.25%; width: 87.5%;
                padding-top: 25px;" class="social-icons"><table
                width="256" border="0" cellpadding="0" cellspacing="0" align="center" style="border-collapse: collapse; border-spacing: 0; padding: 0;">
                <tr>
                  <!-- ICON 1 -->
                  <td align="center" valign="middle" style="margin: 0; padding: 0; padding-left: 10px; padding-right: 10px; border-collapse: collapse; border-spacing: 0;"><a target="_blank"
                    href="https://facebook.com/virtualtabs/"
                  style="text-decoration: none;"><img border="0" vspace="0" hspace="0" style="padding: 0; margin: 0; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; border: none; display: inline-block;
                    color: #000000;"
                    alt="F" title="Facebook"
                    width="44" height="44"
                    src="https://raw.githubusercontent.com/konsav/email-templates/master/images/social-icons/facebook.png"></a></td>
                  <!-- ICON 2 -->
                  <td align="center" valign="middle" style="margin: 0; padding: 0; padding-left: 10px; padding-right: 10px; border-collapse: collapse; border-spacing: 0;"><a target="_blank"
                    href="https://twitter.com/virtualtabs"
                  style="text-decoration: none;"><img border="0" vspace="0" hspace="0" style="padding: 0; margin: 0; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; border: none; display: inline-block;
                    color: #000000;"
                    alt="T" title="Twitter"
                    width="44" height="44"
                    src="https://raw.githubusercontent.com/konsav/email-templates/master/images/social-icons/twitter.png"></a></td>
                  <!-- ICON 4 -->
                  <td align="center" valign="middle" style="margin: 0; padding: 0; padding-left: 10px; padding-right: 10px; border-collapse: collapse; border-spacing: 0;"><a target="_blank"
                    href="https://instagram.com/virtualtabs"
                  style="text-decoration: none;"><img border="0" vspace="0" hspace="0" style="padding: 0; margin: 0; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; border: none; display: inline-block;
                    color: #000000;"
                    alt="I" title="Instagram"
                    width="44" height="44"
                    src="https://raw.githubusercontent.com/konsav/email-templates/master/images/social-icons/instagram.png"></a></td>
                </tr>
                </table>
              </td>
            </tr>
            <!-- FOOTER -->
            <!-- Set text color and font family ("sans-serif" or "Georgia, serif"). Duplicate all text styles in links, including line-height -->
            <tr>
              <td align="center" valign="top" style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0; padding-left: 6.25%; padding-right: 6.25%; width: 87.5%; font-size: 13px; font-weight: 400; line-height: 150%;
                padding-top: 20px;
                padding-bottom: 20px;
                color: #999999;
                font-family: sans-serif;" class="footer">
                  <!-- ANALYTICS -->
                  <img style="display: none;" src="https://www.google-analytics.com/collect?v=1&tid={analytics_id}&cid=555&t=event&ec=email&ea=open&dp=%2Femail%2Fnewsletter1&dt=My%20Newsletter">
              </td>
            </tr>
            <!-- End of WRAPPER -->
            </table>
            <!-- End of SECTION / BACKGROUND -->
            </td></tr></table>
            </body>
            </html>
            '''.format(
                analytics_id=self.analytics_id,
                campaign_id=campaign_id,
                subject=subject,
                header=header,
                body=body,
                abody=abody,
                footer=footer,
                footer_sign=footer_sign
            )
            return email
        except Exception as e:
            logger.error('Error Creating Email Template Single Body; Error: %s', e)
        # [END Email Template Single Body]
