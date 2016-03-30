#  -*- coding: utf-8 -*-
"""
Config File for enviroment variables
"""

import os
from importlib import import_module


class Config(object):
    """
    Base class for all config variables
    """
    DEBUG = False
    TESTING = False
    DEVELOPMENT = False
    CSRF_ENABLED = True
    SECRET_KEY = os.environ['SECRET_KEY']
    PIVOTAL_TOKEN = ''


class ProductionConfig(Config):
    """
    Production Config... this is the real thing
    """
    DEBUG = False


class StagingConfig(Config):
    """
    Staging Config is for... staging things
    """
    DEBUG = True


class DevelopmentConfig(Config):
    """
    Development Config... this is your home developer!
    """
    DEVELOPMENT = True
    DEBUG = True


class TestingConfig(Config):
    """
    Test Config... You should be testing right now instead reading docs!!!
    """
    TESTING = True
    KEY_ON_TEST = 'KEY ON TEST'
    PIVOTAL_TOKEN = 'PIVOTAL_TEST_TOKEN'
    PIVOTAL_PROJECT_ID = 1234


class ConfigClassNotFound(Exception):
    """
    Raises when the APP_SETTINGS environment variable have a value which does not point to an uninstantiable class.
    """
    pass


def get_config():
    """
    Get the Config Class instance defined in APP_SETTINGS environment variable
    :return The config class instance
    :rtype: Config
    """
    config_imports = os.environ['APP_SETTINGS'].split('.')
    config_class_name = config_imports[-1]
    config_module = import_module('.'.join(config_imports[:-1]))
    config_class = getattr(config_module, config_class_name, None)
    if not config_class:
        raise ConfigClassNotFound('Unable to find a config class in {}'.format(os.environ['APP_SETTINGS']))
    return config_class()