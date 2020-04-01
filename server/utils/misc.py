# tabs/server/utils/misc.py

import logging

# Create Logger
logger = logging.getLogger('tabs.server.utils.misc.py')


from datetime import datetime
import math

def parse_date_to_string(date=None):
    try:
        return datetime.strftime(date, "%Y-%m-%dT%H:%M:%S.%fZ")
    except Exception as e:
        error = 'Error on Parse Date to String; Error: {}'.format(e)
        logger.error(error)
        raise ValueError(error)

def truncate(f, n):
    amount = (math.floor(f * 10 ** n) / 10 ** n)
    amount = format(amount, '.2f')
    return float(amount)
