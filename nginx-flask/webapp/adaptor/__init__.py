from flask import request
from flask import Blueprint

adaptors = Blueprint('adaptors', __name__)

@adaptors.route('/adaptor')
def testRoute():
    return 'testing adaptor succ!'

@adaptors.route('/adaptors/<op>')
def adaptorTest():
    return True
