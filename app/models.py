# -*- coding: utf-8 -*-
from datetime import datetime, timedelta

import jwt
from passlib.apps import custom_app_context

from app import config as config_module
import database


db = database.AppRepository.db

config = config_module.get_config()


class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    name = db.Column(db.String(), nullable=False)
    pivotal_token = db.Column(db.String())

    @classmethod
    def get_by_id(cls, user_id):
        return cls.query.get(user_id)

    @classmethod
    def create(cls, user_data):
        user = cls()
        db.session.add(user)
        user.name = user_data['name']
        user.email = user_data['email']
        user.hash_password(user_data['password'])
        db.session.commit()
        return user

    @classmethod
    def get_by_email(cls, email):
        return cls.query.filter_by(email=email).first()

    @classmethod
    def check_auth_token(cls, token):
        try:
            data = jwt.decode(token, config.SECRET_KEY)
        except:
            return None
        if not data.get('id', None):
            return None
        return cls.query.get(data['id'])

    def to_dict(self):
        return {
            'name': self.name,
            'email': self.email,
            'pivotal_token': self.pivotal_token
        }

    def hash_password(self, password):
        self.password_hash = custom_app_context.encrypt(password)

    def check_password(self, password):
        return custom_app_context.verify(password, self.password_hash)

    def generate_auth_token(self, expiration=600):
        return jwt.encode({'id': self.id, 'exp': datetime.utcnow() + timedelta(seconds=expiration)},
                          config.SECRET_KEY, algorithm='HS256')

    def update(self, user_data):
        if 'name' in user_data:
            self.name = user_data['name']
        if 'pivotal_token' in user_data:
            self.pivotal_token = user_data['pivotal_token']
        if 'password' in user_data:
            self.hash_password(user_data['password'])
        db.session.add(self)
        db.session.commit()