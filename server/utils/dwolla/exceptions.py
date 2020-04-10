
class DwollaException(Exception):
    def __init__(self, message, error_code=0, detail=""):
        super(DwollaException, self).__init__(message)

        self.error_code = error_code
        self.detail = detail
        self.message = message


class AuthorizationException(DwollaException):
    """
    Dwolla Error Codes from 1 to 499
    """
    def __str__(self):
        return "Dwolla Auth Exception: " + self.message + " \n\n" + self.detail


class UnsupportedException(DwollaException):
    """
    Dwolla Error Codes from 500 to 599
    """
    pass


class GeneralException(DwollaException):
    """
    Dwolla Error Codes from 600 to 1999
    """
    pass


class ValidationException(DwollaException):
    """
    Dwolla Error Codes from 2000 to 4999
    """
    pass


class SevereException(DwollaException):
    """
    Dwolla Error Codes greater than 10000
    """
    pass


class ObjectNotFoundException(DwollaException):
    """
    Dwolla Error Code 610
    """
    pass
