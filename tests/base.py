
# -*- coding: utf-8 -*-

import os
import unittest
from mock import mock
from flask import Flask
from flask.ext.sqlalchemy import SQLAlchemy

from app import database

os.environ = {
    'APP_SETTINGS': 'app.config.TestingConfig',
    'SECRET_KEY': 'SECRET-KEY',
    'PIVOTAL_TOKEN': 'TOKEN_PIVOTAL',
    'DATABASE_URL': 'postgresql+psycopg2://pivocram:pivocram@localhost:5432/pivocram'
}

test_app = Flask(__name__)
test_app.config.from_object(os.environ['APP_SETTINGS'])
database.AppRepository.db = SQLAlchemy(test_app)


class TestCase(unittest.TestCase):
    mock = mock
