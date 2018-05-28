from flask import request
from flask import Blueprint

# sessions include analysis and other business logics

sessions = Blueprint('sessions', __name__)

# all route points would be startswith "/sessions"
# for example @sessions.route('/') = @app.route('/sessions/')

@sessions.route('/')
def test():
    return 'testing sessions succ!'

@sessions.route('/ops/<op>')
def sessiontest():
    return True
