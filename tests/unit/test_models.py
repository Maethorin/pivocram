# -*- coding: utf-8 -*-
from datetime import datetime

from sqlalchemy.orm import attributes

from tests import base
from app import models


class ModelsTest(base.TestCase):
    def test_user_must_have_tablename(self):
        models.User.__tablename__.should.be.equal('users')

    def test_user_must_have_id_field(self):
        isinstance(models.User.id, attributes.InstrumentedAttribute).should.be.truthy

    def test_user_must_have_email_field(self):
        isinstance(models.User.email, attributes.InstrumentedAttribute).should.be.truthy

    def test_user_must_have_password_hash_field(self):
        isinstance(models.User.password_hash, attributes.InstrumentedAttribute).should.be.truthy

    def test_user_must_name_hash_field(self):
        isinstance(models.User.name, attributes.InstrumentedAttribute).should.be.truthy

    @base.TestCase.mock.patch('app.models.custom_app_context')
    def test_user_should_hash_password(self, hasher_mock):
        hasher_mock.encrypt.return_value = 'HASSSHED'
        user = models.User()
        user.hash_password('1234')
        user.password_hash.should.be.equal('HASSSHED')
        hasher_mock.encrypt.assert_called_with('1234')

    @base.TestCase.mock.patch('app.models.custom_app_context')
    def test_user_should_check_hash_password(self, hasher_mock):
        hasher_mock.verify.return_value = True
        user = models.User()
        user.password_hash = 'HASSSHED'
        user.check_password('1234').should.be.truthy
        hasher_mock.verify.assert_called_with('1234', 'HASSSHED')

    @base.TestCase.mock.patch('app.models.User.query')
    def test_should_get_user_by_email(self, query_mock):
        query_mock.filter_by.return_value.first.return_value = self.mock.MagicMock(id='USER-ID')
        user = models.User.get_by_email('email@zas.com')
        user.id.should.be.equal('USER-ID')
        query_mock.filter_by.assert_called_with(email='email@zas.com')

    @base.TestCase.mock.patch('app.models.datetime')
    @base.TestCase.mock.patch('app.models.jwt.encode')
    def test_should_user_jwt_to_generate_token(self, encode_mock, datetime_mock):
        user = models.User()
        user.id = 'USER-ID'
        encode_mock.return_value = 'JWT-ENCODED'
        datetime_mock.utcnow.return_value = datetime(2016, 3, 30, 3, 13, 47, 832051)
        user.generate_auth_token().should.be.equal('JWT-ENCODED')
        encode_mock.assert_called_with({'id': 'USER-ID', 'exp': datetime(2016, 3, 30, 3, 23, 47, 832051)}, 'SECRET-KEY', algorithm='HS256')

    @base.TestCase.mock.patch('app.models.datetime')
    @base.TestCase.mock.patch('app.models.jwt.encode')
    def test_should_accept_expiration_in_seconds_to_generate_token(self, encode_mock, datetime_mock):
        user = models.User()
        user.id = 'USER-ID'
        encode_mock.return_value = 'JWT-ENCODED'
        datetime_mock.utcnow.return_value = datetime(2016, 3, 30, 3, 13, 47, 832051)
        user.generate_auth_token(expiration=3600).should.be.equal('JWT-ENCODED')
        encode_mock.assert_called_with({'id': 'USER-ID', 'exp': datetime(2016, 3, 30, 4, 13, 47, 832051)}, 'SECRET-KEY', algorithm='HS256')

    @base.TestCase.mock.patch('app.models.jwt.decode')
    @base.TestCase.mock.patch('app.models.User.query')
    def test_should_return_instance_if_token_is_valid(self, query_mock, decode_mock):
        decode_mock.return_value = {'id': 'USER-ID'}
        query_mock.get.return_value = self.mock.MagicMock(id='USER-ID')
        user = models.User.check_auth_token('SOME-TOKEN')
        user.id.should.be.equal('USER-ID')
        decode_mock.assert_called_with('SOME-TOKEN', 'SECRET-KEY')
        query_mock.get.assert_called_with('USER-ID')

    @base.TestCase.mock.patch('app.models.jwt.decode')
    def test_should_return_none_if_result_has_no_id(self, decode_mock):
        decode_mock.return_value = {'id': None}
        user = models.User.check_auth_token('SOME-TOKEN')
        user.should.be.none

    @base.TestCase.mock.patch('app.models.jwt.decode')
    def test_should_return_none_if_result_has_no_id_key(self, decode_mock):
        decode_mock.return_value = {}
        user = models.User.check_auth_token('SOME-TOKEN')
        user.should.be.none

    @base.TestCase.mock.patch('app.models.jwt.decode')
    def test_should_return_none_if_has_error_on_decode(self, decode_mock):
        decode_mock.side_effect = ValueError
        user = models.User.check_auth_token('SOME-TOKEN')
        user.should.be.none
