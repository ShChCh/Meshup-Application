from flask import Flask
from flask import request
import sys 
sys.path.append('../basic') 
from basic import sendJson

def create_app():
    # Instantiate Flask application
    app = Flask(__name__)

    # here's the main front end api
    
    @app.route('/')
    def home():
        nArr = ['1','2']
        vArr = ['a','b']
        re = sendJson('http://localhost/sessions/', nArr, vArr)
        return 'testing succ! ' + re[0]

    @app.route('/analysis/<op>')
    def controller():
        return True
    
    return app
