from flask import request
from flask import Blueprint

adaptors = Blueprint('adaptors', __name__)

@adaptors.route('/')
def testRoute():
    return 'testing adaptor succ!'

@adaptors.route('/ops/<op>')
def adaptorTest():
    return True
