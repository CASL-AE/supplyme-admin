# xupply/server/employee/api.py

import logging
import json
import time

logger = logging.getLogger('xupply.employee.api.py')

# Xupply Employee
# TODO: None
# [START Xupply Employee]
class XupplyEmployee(object):
    # Init
    # TODO: None
    # [START Init]
    def __init__(self,
                employeeID=None,
                permissionLevel=None,
                active=None,
                deleted=None,
                createdDate=None,
                updatedDate=None,
                terms=None,
                termTime=None,
                privacy=None,
                privacyTime=None,
                mapAvatarImageUrl=None,
                thumbAvatarImageUrl=None,
                userName=None,
                firstName=None,
                lastName=None,
                email=None,
                phoneNumber=None,
                ref=None):

        self.employeeID = employeeID
        self.permissionLevel = permissionLevel
        self.active = active
        self.deleted = deleted
        self.createdDate = createdDate
        self.updatedDate = updatedDate
        self.terms = terms
        self.termTime = termTime
        self.privacy = privacy
        self.privacyTime = privacyTime
        self.mapAvatarImageUrl = mapAvatarImageUrl
        self.thumbAvatarImageUrl = thumbAvatarImageUrl
        self.userName = userName
        self.firstName = firstName
        self.lastName = lastName
        self.email = email
        self.phoneNumber = phoneNumber
        self.ref = ref

    # [END Init]

    # Firebase DB Snapshot
    # TODO: None
    # [START Firebase DB Snapshot]
    def db_snapshot(self, snapshot=None):
        employeeID = snapshot.id
        snapshotValue = snapshot.to_dict()
        self.employeeID = snapshotValue['employeeID']
        self.permissionLevel = snapshotValue['permissionLevel']
        self.active = snapshotValue['active']
        self.deleted = snapshotValue['deleted']
        self.createdDate = snapshotValue['createdDate']
        self.updatedDate = snapshotValue['updatedDate']
        self.terms = snapshotValue['terms']
        self.termTime = snapshotValue['termTime']
        self.privacy = snapshotValue['privacy']
        self.privacyTime = snapshotValue['privacyTime']
        self.mapAvatarImageUrl = snapshotValue['mapAvatarImageUrl']
        self.thumbAvatarImageUrl = snapshotValue['thumbAvatarImageUrl']
        self.userName = snapshotValue['userName']
        self.firstName = snapshotValue['firstName']
        self.lastName = snapshotValue['lastName']
        self.email = snapshotValue['email']
        self.phoneNumber = snapshotValue['phoneNumber']
        self.ref = snapshot.reference
        return self
    # [END Firebase DB Snapshot]

    # To Any Object
    # TODO: None
    # [START To Any Object]
    def to_any_object(self):
        return {
            "employeeID": self.employeeID,
            "permissionLevel": self.permissionLevel,
            "active": self.active,
            "deleted": self.deleted,
            "createdDate": self.createdDate,
            "updatedDate": self.updatedDate,
            "terms": self.terms,
            "termTime": self.termTime,
            "privacy": self.privacy,
            "privacyTime": self.privacyTime,
            "mapAvatarImageUrl": self.mapAvatarImageUrl,
            "thumbAvatarImageUrl": self.thumbAvatarImageUrl,
            "userName": self.userName,
            "firstName": self.firstName,
            "lastName": self.lastName,
            "email": self.email,
            "phoneNumber": self.phoneNumber,

        }
    # [END To Any Object]
# [END Xupply Employee Object]

# Xupply Employee Code Object
# TODO
# [START Xupply Employee Code Object]
class XupplyEmployeeCode(object):
    # Init
    # TODO
    # [START Init]
    def __init__(self,
                 activationCode=None,
                 accountID=None,
                 ownerName=None,
                 accountName=None,
                 email=None,
                 permissionLevel=None,
                 phoneNumber=None,
                 valid=None,
                 updatedDate=None,
                 createdDate=None):

        self.activationCode = activationCode
        self.accountID = accountID
        self.ownerName = ownerName
        self.accountName = accountName
        self.email = email
        self.permissionLevel = permissionLevel
        self.phoneNumber = phoneNumber
        self.valid = valid
        self.updatedDate = updatedDate
        self.createdDate = createdDate

    # [END Init]
    # Firebase DB Snapshot
    # TODO
    # [START Firebase DB Snapshot]
    def db_snapshot(self, snapshot):
        self.activationCode = snapshot.id
        snapshotValue = snapshot.to_dict()
        self.accountID = snapshotValue['accountID']
        self.ownerName = snapshotValue['ownerName']
        self.accountName = snapshotValue['accountName']
        self.email = snapshotValue['email']
        self.permissionLevel = snapshotValue['permissionLevel']
        self.phoneNumber = snapshotValue['phoneNumber']
        self.valid = snapshotValue['valid']
        self.updatedDate = snapshotValue['updatedDate']
        self.createdDate = snapshotValue['createdDate']
        return self
    # [END Firebase DB Snapshot]

    # Dictionary Snapshot
    # [START Dictionary Snapshot]
    def dict_snapshot(self, snapshot=None):
        snapshotValue = snapshot
        self.activationCode = snapshotValue['activationCode']
        self.accountID = snapshotValue['accountID']
        self.ownerName = snapshotValue['ownerName']
        self.accountName = snapshotValue['accountName']
        self.email = snapshotValue['email']
        self.permissionLevel = snapshotValue['permissionLevel']
        self.phoneNumber = snapshotValue['phoneNumber']
        self.valid = snapshotValue['valid']
        self.updatedDate = snapshotValue['updatedDate']
        self.createdDate = snapshotValue['createdDate']
        return self
    # [END Dictionary Snapshot]

    # Return To Any Object
    # [START To Any Object]
    def to_any_object(self):
        return {
            "activationCode": self.activationCode,
            "accountID": self.accountID,
            "ownerName": self.ownerName,
            "accountName": self.accountName,
            "email": self.email,
            "permissionLevel": self.permissionLevel,
            "phoneNumber": self.phoneNumber,
            "valid": self.valid,
            "updatedDate": self.updatedDate,
            "createdDate": self.createdDate,
        }
    # [END To Any Object]
# [END Xupply Employee Code Object]
