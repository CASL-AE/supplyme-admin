# server/utils/xupply/match.py
import logging

# Create Logger
logger = logging.getLogger('xupply.utils.xupply.match.py')

from datetime import datetime
from server.config import Config

from server.models import XupplyReferences

def get_all_menu_item_stock():
    all_menu_item_stock = {}
    account_docs = XupplyReferences().accounts_ref.stream()
    for account_doc in account_docs:
        accountID = account_doc.id
        # if accountID =='h54JYHQR12j71Cnc5joE':
        #     continue
        menu_items_ref = account_doc.reference.collection('MenuItems')
        menu_item_docs = menu_items_ref.stream()
        for menu_doc in menu_item_docs:
            menu_item = menu_doc.to_dict()
            all_menu_item_stock[menu_doc.id] = {'{}'.format(accountID): menu_item['quantities']}
    return all_menu_item_stock

# Cloud Request Match
# TODO: None
# [START Cloud Request Match]
def cloud_request_match(account):
    account_ref = XupplyReferences().accounts_ref.document('h54JYHQR12j71Cnc5joE')
    request_ref = account_ref.collection('Requests').document('E0z3rPpC8CarTTj5RJTZ')
    request_doc = request_ref.get()
    request_dict = request_doc.to_dict()
    menu_item_stock = get_all_menu_item_stock()

    updated_menu_items = []
    new_orders = []
    updated_request = {}

    for ri in range(len(request_dict['items'])):
        request_item = request_dict['items'][ri]
        request_itemID = request_item['itemID']
        manu_item_stock = menu_item_stock[request_itemID]
        print('Request Item ID: {}'.format(request_itemID))
        for account_itemID, stock_quantities in manu_item_stock.items():
            print('Checking Account Item ID: {}'.format(account_itemID))
            # Create New Order Object
            new_order = {}
            new_order['items'] = []
            new_order['stockPerItem'] = {}
            for rqi in range(len(request_item['quantities'])):
                request_quantity = request_item['quantities'][rqi]
                for sqi in range(len(stock_quantities)):
                    stock_quantity = stock_quantities[sqi]
                    if stock_quantity['packageType'] == request_quantity['packageType']:
                        print('Quantity Found')
                        print('Before - Requested Menu Item Stock: {}'.format(request_quantity['stock']))
                        print('Before - Manufacturer Menu Item Stock: {}'.format(stock_quantity['stock']))
                        if int(request_quantity['stock']) <= int(stock_quantity['stock']):
                            new_item = {
                                'item': request_item,
                                'quantity': request_quantity,
                                'stock': int(request_quantity['stock'])
                            }
                            new_order['items'].append(new_item)
                            new_order['stockPerItem'][request_item['itemID']] = {
                                'type': request_quantity['packageType'],
                                'quantity': request_quantity['packageQuantity'],
                                'stock': int(request_quantity['stock'])
                            }
                            stock = int(stock_quantity['stock']) - int(request_quantity['stock'])
                            manu_item_stock[account_itemID][sqi]['stock'] = stock
                            request_dict['items'][ri]['quantities'][rqi]['stock'] = 0
                            updated_menu_items.append(manu_item_stock)
                            new_orders.append(new_order)
                            updated_request = request_dict

            print('After - Requested Menu Item Stock: {}'.format(request_dict['items'][ri]['quantities'][rqi]['stock']))
            print('After - Manufacturer Menu Item Stock: {}'.format(manu_item_stock[account_itemID][sqi]['stock']))
    print(updated_menu_items)
    print(new_orders)
    print(updated_request)
# [END Cloud Request Match]

# Cloud Menu Item Match
# TODO: None
# [START Cloud Menu Item Match]
def cloud_menu_item_match(account):
    account_ref = XupplyReferences().accounts_ref.document('umqoCh6oUbyNHj4DcLyV')
    item_ref = account_ref.collection('MenuItem').document('pcDC4EBXt5ofzx4ApuOp')
    item_doc = item_ref.get()
    item_dict = item_doc.to_dict()
    menu_item_stock = get_all_menu_item_stock()

    updated_requests = []
    new_orders = []
    updated_menu_items = {}

    for mii in range(len(item_dict['items'])):
        request_item = item_dict['items'][ri]
    request_itemID = item_dict['itemID']
    manu_item_stock = menu_item_stock[request_itemID]
    print('MenuItem Item ID: {}'.format(request_itemID))
    for account_itemID, stock_quantities in manu_item_stock.items():
        print('Checking Account Item ID: {}'.format(account_itemID))
        # Create New Order Object
        new_order = {}
        new_order['items'] = []
        new_order['stockPerItem'] = {}
        for rqi in range(len(request_item['quantities'])):
            request_quantity = request_item['quantities'][rqi]
            for sqi in range(len(stock_quantities)):
                stock_quantity = stock_quantities[sqi]
                if stock_quantity['packageType'] == request_quantity['packageType']:
                    print('Quantity Found')
                    print('Before - MenuItemed Menu Item Stock: {}'.format(request_quantity['stock']))
                    print('Before - Manufacturer Menu Item Stock: {}'.format(stock_quantity['stock']))
                    if int(request_quantity['stock']) <= int(stock_quantity['stock']):
                        new_item = {
                            'item': request_item,
                            'quantity': request_quantity,
                            'stock': int(request_quantity['stock'])
                        }
                        new_order['items'].append(new_item)
                        new_order['stockPerItem'][request_item['itemID']] = {
                            'type': request_quantity['packageType'],
                            'quantity': request_quantity['packageQuantity'],
                            'stock': int(request_quantity['stock'])
                        }
                        stock = int(stock_quantity['stock']) - int(request_quantity['stock'])
                        manu_item_stock[account_itemID][sqi]['stock'] = stock
                        item_dict['items'][ri]['quantities'][rqi]['stock'] = 0
                        updated_menu_items.append(manu_item_stock)
                        new_orders.append(new_order)
                        updated_request = item_dict

        print('After - MenuItemed Menu Item Stock: {}'.format(item_dict['items'][ri]['quantities'][rqi]['stock']))
        print('After - Manufacturer Menu Item Stock: {}'.format(manu_item_stock[account_itemID][sqi]['stock']))
    print(updated_menu_items)
    print(new_orders)
    print(updated_request)
# [END Cloud Menu Item Match]
