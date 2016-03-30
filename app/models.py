# -*- coding: utf-8 -*-
from datetime import datetime, timedelta

import jwt

from app import config as config_module

config = config_module.get_config()


class User(object):
    id = 'USER-ID'

    def generate_auth_token(self, expiration=600):
        return jwt.encode({'id': self.id, 'exp': datetime.utcnow() + timedelta(seconds=expiration)},
                          config.SECRET_KEY, algorithm='HS256')

    @classmethod
    def check_auth_token(cls, token):
        try:
            data = jwt.decode(token, config.SECRET_KEY)
        except:
            return None
        if not data.get('id', None):
            return None
        return cls()