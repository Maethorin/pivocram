# -*- coding: utf-8 -*-
import os
from tests import base
from app import config


class ConfigTest(base.TestCase):
    def test_config_have_all_necessary_keys(self):
        self.assertTrue(hasattr(config.Config, 'SECRET_KEY'))
        self.assertTrue(hasattr(config.Config, 'DEBUG'))
        self.assertTrue(hasattr(config.Config, 'TESTING'))
        self.assertTrue(hasattr(config.Config, 'DEVELOPMENT'))
        self.assertTrue(hasattr(config.Config, 'CSRF_ENABLED'))
        self.assertTrue(hasattr(config.Config, 'SECRET_KEY'))
        self.assertTrue(hasattr(config.Config, 'PIVOTAL_TOKEN'))
        self.assertTrue(hasattr(config.Config, 'PIVOTAL_PROJECT_ID'))

    def test_get_config(self):
        config_result = config.get_config()
        config_result.TESTING.should.be.truthy
        config_result.KEY_ON_TEST.should.be.equal('KEY ON TEST')

    def test_get_base_config_raises_if_no_class_found(self):
        os.environ['APP_SETTINGS'] = 'app.config.NonExists'
        try:
            config.get_config()
            self.assertFalse(True, 'get_config do not raise excpetion')
        except config.ConfigClassNotFound:
            self.assertTrue('Done')
        finally:
            os.environ['APP_SETTINGS'] = 'app.config.TestingConfig'
