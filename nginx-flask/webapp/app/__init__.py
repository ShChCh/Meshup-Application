from flask import Flask
from flask import request

def create_app():
    # Instantiate Flask application
    app = Flask(__name__)

    @app.route('/')
    def home():
        return 'testing succ!'

    @app.route('/analysis/<op>')
    def controller():
        return True
    
    return app
