# -*- coding: utf-8 -*-
from tests import base
from app import initialize


class InitializeTest(base.TestCase):
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
        user_mock.generate_auth_token.return_value = 'GENERATED-TOKEN'
        g_mock.get.return_value = user_mock
        response = self.mock.MagicMock(headers={})
        result = initialize.add_token_header(response)
        result.headers.should.be.equal({'XSRF-TOKEN': 'GENERATED-TOKEN'})

    @base.TestCase.mock.patch('app.initialize.g')
    def test_should_remove_token_headers_in_response_when_g_doesnt_have_an_user(self, g_mock):
        g_mock.get.return_value = None
        response = self.mock.MagicMock(headers={'XSRF-TOKEN': 'SOME-TOKEN'})
        result = initialize.add_token_header(response)
        result.headers.should.be.equal({})
