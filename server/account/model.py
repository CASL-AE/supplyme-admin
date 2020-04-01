# privalgo/server/account/api.py

import logging
import json

logger = logging.getLogger('privalgo.account.api.py')

# Xupply Account
# TODO: None
# [START Xupply Account]
class XupplyAccount(object):
    # Init
    # TODO: None
    # [START Init]
    def __init__(self,
                accountID=None,
                name=None,
                accountType=None,
                ref=None):

        self.accountID = accountID
        self.name = name
        self.accountType = accountType
        self.ref = ref

    # [END Init]

    # Firebase DB Snapshot
    # TODO: None
    # [START Firebase DB Snapshot]
    def db_snapshot(self, snapshot=None):
        self.accountID = snapshot.id
        snapshotValue = snapshot.to_dict()
        self.name = snapshotValue['name']
        self.accountType = snapshotValue['accountType']
        return self
    # [END Firebase DB Snapshot]

    # Dict Snapshot
    # TODO: None
    # [START Dict Snapshot]
    def dict_snapshot(self, snapshot=None):
        snapshotValue = snapshot
        self.accountID = snapshotValue["accountID"]
        self.name = snapshotValue['name']
        self.accountType = snapshotValue['accountType']
        return self
    # [END Dict Snapshot]

    # To Any Object
    # TODO: None
    # [START To Any Object]
    def to_any_object(self):
        return {
            "accountID": self.accountID,
            "name": self.name,
            "accountType": self.accountType,
        }
    # [END To Any Object]
# [END Xupply Account Object]

# Xupply Account Code Object
# TODO
# [START Xupply Account Code Object]
class XupplyAccountCode(object):
    # Init
    # TODO: None
    # [START Init]
    def __init__(self,
                 activationCode=None,
                 accountID=None,
                 valid=None,
                 accountName=None,
                 ownerName=None,
                 email=None,
                 phoneNumber=None,
                 createdDate=None,
                 updatedDate=None):

        self.activationCode = activationCode
        self.accountID = accountID
        self.valid = valid
        self.accountName = accountName
        self.ownerName = ownerName
        self.email = email
        self.phoneNumber = phoneNumber
        self.createdDate = createdDate
        self.updatedDate = updatedDate

    # [END Init]
    # Firebase DB Snapshot
    # TODO
    # [START Firebase DB Snapshot]
    def db_snapshot(self, snapshot):
        self.activationCode = snapshot.id
        snapshotValue = snapshot.to_dict()
        self.accountID = snapshotValue['accountID']
        self.valid = snapshotValue['valid']
        self.accountName = snapshotValue['accountName']
        self.ownerName = snapshotValue['ownerName']
        self.email = snapshotValue['email']
        self.phoneNumber = snapshotValue['phoneNumber']
        self.createdDate = snapshotValue['createdDate']
        self.updatedDate = snapshotValue['updatedDate']
        return self
    # [END Firebase DB Snapshot]

    # Dictionary Snapshot
    # [START Dictionary Snapshot]
    def dict_snapshot(self, snapshot=None):
        snapshotValue = snapshot
        self.activationCode = snapshotValue['activationCode']
        self.accountID = snapshotValue['accountID']
        self.valid = snapshotValue['valid']
        self.accountName = snapshotValue['accountName']
        self.ownerName = snapshotValue['ownerName']
        self.email = snapshotValue['email']
        self.phoneNumber = snapshotValue['phoneNumber']
        self.createdDate = snapshotValue['createdDate']
        self.updatedDate = snapshotValue['updatedDate']
        return self
    # [END Dictionary Snapshot]

    # Return To Any Object
    # [START To Any Object]
    def to_any_object(self):
        return {
            "activationCode": self.activationCode,
            "accountID": self.accountID,
            "valid": self.valid,
            "accountName": self.accountName,
            "ownerName": self.ownerName,
            "email": self.email,
            "phoneNumber": self.phoneNumber,
            "createdDate": self.createdDate,
            "updatedDate": self.updatedDate,
        }
    # [END To Any Object]
# [END Xupply Account Code Object]
