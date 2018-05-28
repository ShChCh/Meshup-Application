from flask import request
from flask import Blueprint

# adaptors include fetching data from publications and transform them into formal format

adaptors = Blueprint('adaptors', __name__)

# all route points would be startswith "/adaptors"
# for example @adaptors.route('/') = @app.route('/adaptors/')

@adaptors.route('/')
def testRoute():
    return 'testing adaptor succ!'

@adaptors.route('/ops/<op>')
def adaptorTest():
    return True
