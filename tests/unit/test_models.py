# -*- coding: utf-8 -*-
from datetime import datetime

from tests import base
from app import models


class ModelsTest(base.TestCase):
    def test_should_get_an_user(self):
        user = models.User()
        user.id.should.be.equal('USER-ID')

    @base.TestCase.mock.patch('app.models.datetime')
    @base.TestCase.mock.patch('app.models.jwt.encode')
    def test_should_user_jwt_to_generate_token(self, encode_mock, datetime_mock):
        user = models.User()
        encode_mock.return_value = 'JWT-ENCODED'
        datetime_mock.utcnow.return_value = datetime(2016, 3, 30, 3, 13, 47, 832051)
        user.generate_auth_token().should.be.equal('JWT-ENCODED')
        encode_mock.assert_called_with({'id': 'USER-ID', 'exp': datetime(2016, 3, 30, 3, 23, 47, 832051)}, 'SECRET-KEY', algorithm='HS256')

    @base.TestCase.mock.patch('app.models.datetime')
    @base.TestCase.mock.patch('app.models.jwt.encode')
    def test_should_accept_expiration_in_seconds_to_generate_token(self, encode_mock, datetime_mock):
        user = models.User()
        encode_mock.return_value = 'JWT-ENCODED'
        datetime_mock.utcnow.return_value = datetime(2016, 3, 30, 3, 13, 47, 832051)
        user.generate_auth_token(expiration=3600).should.be.equal('JWT-ENCODED')
        encode_mock.assert_called_with({'id': 'USER-ID', 'exp': datetime(2016, 3, 30, 4, 13, 47, 832051)}, 'SECRET-KEY', algorithm='HS256')

    @base.TestCase.mock.patch('app.models.jwt.decode')
    def test_should_return_instance_if_token_is_valid(self, decode_mock):
        decode_mock.return_value = {'id': 'USER-ID'}
        user = models.User.check_auth_token('SOME-TOKEN')
        user.id.should.be.equal('USER-ID')
        decode_mock.assert_called_with('SOME-TOKEN', 'SECRET-KEY')

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
