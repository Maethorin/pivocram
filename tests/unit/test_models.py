# -*- coding: utf-8 -*-
from datetime import datetime

from sqlalchemy.orm import attributes

from tests import base
from app import models


class UserTest(base.TestCase):
    def setUp(self):
        self.user_dict = {
            'email': 'test@user.com',
            'name': 'User Name',
            'password': '1234',
            'pivotal_token': 'TOOKEN'
        }

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

    def test_should_return_as_dict(self):
        user = models.User(name='User Name', email='test@user.com', pivotal_token='TOKEN')
        user.to_dict().should.be.equal({'email': 'test@user.com', 'name': 'User Name', 'pivotal_token': 'TOKEN'})

    @base.TestCase.mock.patch('app.models.User.query')
    def test_should_get_user_by_id(self, query_mock):
        query_mock.get.return_value = 'USER-123'
        user = models.User.get_by_id(123)
        query_mock.get.assert_called_with(123)
        user.should.be.equal('USER-123')

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
        encode_mock.assert_called_with({'id': 'USER-ID', 'exp': datetime(2016, 3, 30, 13, 13, 47, 832051)}, 'SECRET-KEY', algorithm='HS256')

    @base.TestCase.mock.patch('app.models.datetime')
    @base.TestCase.mock.patch('app.models.jwt.encode')
    def test_should_accept_expiration_in_minutes_to_generate_token(self, encode_mock, datetime_mock):
        user = models.User()
        user.id = 'USER-ID'
        encode_mock.return_value = 'JWT-ENCODED'
        datetime_mock.utcnow.return_value = datetime(2016, 3, 30, 3, 13, 47, 832051)
        user.generate_auth_token(expiration=60).should.be.equal('JWT-ENCODED')
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

    @base.TestCase.mock.patch('app.models.db.session', base.TestCase.mock.MagicMock())
    @base.TestCase.mock.patch('app.models.custom_app_context', base.TestCase.mock.MagicMock())
    def test_should_have_create_user(self):
        user = models.User.create(self.user_dict)
        isinstance(user, models.User)

    @base.TestCase.mock.patch('app.models.custom_app_context', base.TestCase.mock.MagicMock())
    @base.TestCase.mock.patch('app.models.db.session')
    def test_should_add_user_in_db_session_when_creating(self, session_mock):
        user = models.User.create(self.user_dict)
        session_mock.add.assert_called_with(user)

    @base.TestCase.mock.patch('app.models.custom_app_context', base.TestCase.mock.MagicMock())
    @base.TestCase.mock.patch('app.models.db.session', base.TestCase.mock.MagicMock())
    def test_should_create_user_from_dict(self):
        user = models.User.create(self.user_dict)
        user.email.should.be.equal(self.user_dict['email'])
        user.name.should.be.equal(self.user_dict['name'])

    @base.TestCase.mock.patch('app.models.db.session', base.TestCase.mock.MagicMock())
    @base.TestCase.mock.patch('app.models.custom_app_context')
    def test_should_hash_passowrd(self, hasher_mock):
        hasher_mock.encrypt.return_value = 'HASSSHED'
        user = models.User.create(self.user_dict)
        user.password_hash.should.be.equal('HASSSHED')
        hasher_mock.encrypt.assert_called_with('1234')

    @base.TestCase.mock.patch('app.models.custom_app_context', base.TestCase.mock.MagicMock())
    @base.TestCase.mock.patch('app.models.db.session')
    def test_should_commit_when_creating(self, session_mock):
        models.User.create(self.user_dict)
        session_mock.commit.assert_called_with()

    @base.TestCase.mock.patch('app.models.db.session', base.TestCase.mock.MagicMock())
    @base.TestCase.mock.patch('app.models.custom_app_context')
    def test_should_update_password(self, hasher_mock):
        hasher_mock.encrypt.return_value = 'NEW#HASHED'
        user = models.User()
        user.update({'password': '1234', 'pivotal_token': 'NEW-TOKEN'})
        hasher_mock.encrypt.assert_called_with('1234')
        user.password_hash.should.be.equal('NEW#HASHED')

    @base.TestCase.mock.patch('app.models.db.session', base.TestCase.mock.MagicMock())
    @base.TestCase.mock.patch('app.models.custom_app_context', base.TestCase.mock.MagicMock())
    def test_should_update_pivotal_token(self):
        user = models.User()
        user.update({'password': '1234', 'pivotal_token': 'NEW-TOKEN'})
        user.pivotal_token.should.be.equal('NEW-TOKEN')

    @base.TestCase.mock.patch('app.models.db.session', base.TestCase.mock.MagicMock())
    @base.TestCase.mock.patch('app.models.custom_app_context', base.TestCase.mock.MagicMock())
    def test_should_update_name(self):
        user = models.User()
        user.update({'password': '1234', 'pivotal_token': 'NEW-TOKEN', 'name': 'New Name'})
        user.name.should.be.equal('New Name')

    @base.TestCase.mock.patch('app.models.db.session', base.TestCase.mock.MagicMock())
    @base.TestCase.mock.patch('app.models.custom_app_context', base.TestCase.mock.MagicMock())
    def test_should_possible_update_only_password(self):
        user = models.User()
        user.update({'password': '1234'})
        user.password_hash.should_not.be.none

    @base.TestCase.mock.patch('app.models.db.session', base.TestCase.mock.MagicMock())
    @base.TestCase.mock.patch('app.models.custom_app_context', base.TestCase.mock.MagicMock())
    def test_should_be_possible_update_only_pivotal_token(self):
        user = models.User()
        user.update({'pivotal_token': 'NEW-TOKEN'})
        user.pivotal_token.should.be.equal('NEW-TOKEN')

    @base.TestCase.mock.patch('app.models.db.session', base.TestCase.mock.MagicMock())
    @base.TestCase.mock.patch('app.models.custom_app_context', base.TestCase.mock.MagicMock())
    def test_should_update_only_name(self):
        user = models.User()
        user.update({'name': 'New Name'})
        user.name.should.be.equal('New Name')

    @base.TestCase.mock.patch('app.models.custom_app_context', base.TestCase.mock.MagicMock())
    @base.TestCase.mock.patch('app.models.db.session')
    def test_should_add_user_in_db_session_when_updating(self, session_mock):
        user = models.User()
        user.update({'pivotal_token': 'NEW-TOKEN'})
        session_mock.add.assert_called_with(user)

    @base.TestCase.mock.patch('app.models.custom_app_context', base.TestCase.mock.MagicMock())
    @base.TestCase.mock.patch('app.models.db.session')
    def test_should_commit_when_updating(self, session_mock):
        user = models.User()
        user.update({'pivotal_token': 'NEW-TOKEN'})
        session_mock.commit.assert_called_with()
