# -*- coding: utf-8 -*-
import os

from flask import Flask, send_from_directory, g, request
from flask.ext.sqlalchemy import SQLAlchemy

import api, database

web_app = Flask(__name__, static_folder='www/static')
web_app.config.from_object(os.environ['APP_SETTINGS'])
database.AppRepository.db = SQLAlchemy(web_app)
app_directory = os.path.join(os.getcwd(), 'app')
www_directory = os.path.join(app_directory, 'www')
mock_directory = os.path.join(app_directory, 'mocks')

api.create_api(web_app)

DOMAIN = 'https://pivocram.herokuapp.com'
if web_app.config['DEVELOPMENT']:
    DOMAIN = 'http://127.0.0.1:8000'


@web_app.before_request
def before_request():
    """
    Check if the token received in header is still a valid token from an user.
    """
    token = request.headers.get('XSRF-TOKEN', None)
    user = None
    if token:
        import models
        user = models.User.check_auth_token(token)
    if user:
        g.user = user


@web_app.after_request
def add_cache_header(response):
    """
    Add response headers for Cache Control
    """
    response.headers['Cache-Control'] = "no-cache, no-store, must-revalidate"
    response.headers['Pragma'] = 'no-cache'
    response.headers['Expires'] = '0'
    return response


@web_app.after_request
def add_access_control_header(response):
    """
    Add response headers for CORS
    """
    response.headers['Access-Control-Allow-Origin'] = DOMAIN
    response.headers['Access-Control-Allow-Credentials'] = 'true'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type,Authorization,Set-Cookie,XSRF-TOKEN'
    response.headers['Access-Control-Expose-Headers'] = 'Content-Type,Authorization,Set-Cookie,XSRF-TOKEN'
    response.headers['Access-Control-Allow-Methods'] = ','.join(['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS'])
    response.headers['Access-Control-Max-Age'] = 21600
    return response


@web_app.after_request
def add_token_header(response):
    """
    Refresh the token header if the user is in flask global or delete the response header if not
    """
    user = g.get('user', None)
    if 'XSRF-TOKEN' in response.headers:
        del response.headers['XSRF-TOKEN']
    if user is not None:
        token = user.generate_auth_token()
        response.headers['XSRF-TOKEN'] = token.decode('ascii')
    return response



@web_app.route('/', defaults={'file_path': ''})
@web_app.route('/templates/<path:file_path>', methods=['GET'])
def www_files(file_path=None):
    folder = ''
    if not file_path:
        file_path = 'index.html'
    else:
        folder = 'templates'
    directory = os.path.join(www_directory, folder)
    return send_from_directory(directory, file_path)


def run():
    """
    Run the flask app in a develpment enviroment
    """
    web_app.run(host='0.0.0.0', port=5000, debug=True)