from flask import request
from flask import Blueprint

sessions = Blueprint('sessions', __name__)

@sessions.route('/')
def test():
    return 'testing sessions succ!'

@sessions.route('/ops/<op>')
def sessiontest():
    return True
