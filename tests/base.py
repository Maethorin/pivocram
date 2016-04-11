
# -*- coding: utf-8 -*-

import os
import unittest
from mock import mock

# from flask import Flask

os.environ = {
    'APP_SETTINGS': 'app.config.TestingConfig',
    'SECRET_KEY': 'SECRET-KEY',
    'PIVOTAL_TOKEN': 'TOKEN_PIVOTAL'
}

# test_app = Flask(__name__)
# test_app.config.from_object(os.environ['APP_SETTINGS'])


class TestCase(unittest.TestCase):
    mock = mock
