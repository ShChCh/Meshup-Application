from flask import request
from flask import Blueprint

sessions = Blueprint('sessions', __name__)

@sessions.route('/sessions')
def test():
    return 'testing sessions succ!'

@sessions.route('/sessions/<op>')
def sessiontest():
    return True
