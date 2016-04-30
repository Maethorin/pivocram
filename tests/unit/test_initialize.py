# -*- coding: utf-8 -*-
from tests import base
from app import initialize


class InitializeTest(base.TestCase):
    @base.TestCase.mock.patch('app.models.User')
    @base.TestCase.mock.patch('app.initialize.request')
    @base.TestCase.mock.patch('app.initialize.g')
    def test_should_check_for_auth_token_at_each_request(self, g_mock, request_mock, user_mock):
        request_mock.headers = {'XSRF-TOKEN': 'TOOOKEN'}
        user_mock.check_auth_token.return_value = 'USER'
        initialize.before_request()
        user_mock.check_auth_token.assert_called_with('TOOOKEN')
        g_mock.user.should.be.equal('USER')

    def test_should_add_cache_headers_in_response(self):
        response = self.mock.MagicMock(headers={})
        result = initialize.add_cache_header(response)
        result.headers.should.be.equal({
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Expires': '0',
            'Pragma': 'no-cache'
        })

    def test_should_add_access_control_headers_in_response(self):
        response = self.mock.MagicMock(headers={})
        result = initialize.add_access_control_header(response)
        result.headers.should.be.equal({
            'Access-Control-Allow-Credentials': 'true',
            'Access-Control-Allow-Headers': 'Content-Type,Authorization,Set-Cookie,XSRF-TOKEN',
            'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,OPTIONS',
            'Access-Control-Allow-Origin': 'https://pivocram.herokuapp.com',
            'Access-Control-Expose-Headers': 'Content-Type,Authorization,Set-Cookie,XSRF-TOKEN',
            'Access-Control-Max-Age': 21600
        })

    @base.TestCase.mock.patch('app.initialize.g')
    def test_should_add_token_headers_in_reponse_when_g_have_an_user(self, g_mock):
        user_mock = self.mock.MagicMock()
        user_mock.name = 'User Name'
        user_mock.generate_auth_token.return_value = 'GENERATED-TOKEN'
        g_mock.get.return_value = user_mock
        response = self.mock.MagicMock(headers={})
        result = initialize.add_token_header(response)
        result.headers.should.be.equal({'XSRF-TOKEN': 'GENERATED-TOKEN', 'USER-NAME': 'User Name'})

    @base.TestCase.mock.patch('app.initialize.g')
    def test_should_remove_token_headers_in_response_when_g_doesnt_have_an_user(self, g_mock):
        g_mock.get.return_value = None
        response = self.mock.MagicMock(headers={'XSRF-TOKEN': 'SOME-TOKEN'})
        result = initialize.add_token_header(response)
        result.headers.should.be.equal({})

    @base.TestCase.mock.patch('app.initialize.www_directory', 'directory')
    @base.TestCase.mock.patch('app.initialize.send_from_directory')
    def test_should_return_index_file(self, send_from_directory_mock):
        send_from_directory_mock.return_value = 'INDEX'
        initialize.www_files().should.be.equal('INDEX')
        send_from_directory_mock.assert_called_with('directory/', 'index.html')

    @base.TestCase.mock.patch('app.initialize.www_directory', 'directory')
    @base.TestCase.mock.patch('app.initialize.send_from_directory')
    def test_should_return_www_file_in_folder(self, send_from_directory_mock):
        send_from_directory_mock.return_value = 'INDEX'
        initialize.www_files(file_path='zas').should.be.equal('INDEX')
        send_from_directory_mock.assert_called_with('directory/templates', 'zas')
