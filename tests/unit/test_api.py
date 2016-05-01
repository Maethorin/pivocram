# -*- coding: utf-8 -*-
from tests import base
from app import api


class ApiTest(base.TestCase):
    @base.TestCase.mock.patch('app.resources.LoginResource', 'LoginResource')
    @base.TestCase.mock.patch('app.api.Api')
    def test_should_add_login_resource_with_end_points(self, api_mock):
        api_instance = self.mock.MagicMock()
        api_mock.return_value = api_instance
        api.create_api('APP')
        api_instance.add_resource.assert_any_call(
            'LoginResource',
            '/api/login'
        )

    @base.TestCase.mock.patch('app.resources.UserResource', 'UserResource')
    @base.TestCase.mock.patch('app.api.Api')
    def test_should_add_user_resource_with_end_points(self, api_mock):
        api_instance = self.mock.MagicMock()
        api_mock.return_value = api_instance
        api.create_api('APP')
        api_instance.add_resource.assert_any_call(
            'UserResource',
            '/api/me'
        )

    @base.TestCase.mock.patch('app.resources.ProjectResource', 'ProjectResource')
    @base.TestCase.mock.patch('app.api.Api')
    def test_should_add_project_resource_with_end_points(self, api_mock):
        api_instance = self.mock.MagicMock()
        api_mock.return_value = api_instance
        api.create_api('APP')
        api_instance.add_resource.assert_any_call(
            'ProjectResource',
            '/api/projects'
        )

    @base.TestCase.mock.patch('app.resources.StoryResource', 'StoryResource')
    @base.TestCase.mock.patch('app.api.Api')
    def test_should_add_story_resource_with_end_points(self, api_mock):
        api_instance = self.mock.MagicMock()
        api_mock.return_value = api_instance
        api.create_api('APP')
        api_instance.add_resource.assert_any_call(
            'StoryResource',
            '/api/projects/<int:project_id>/stories',
            '/api/projects/<int:project_id>/stories/<int:story_id>'
        )

    @base.TestCase.mock.patch('app.resources.TaskResource', 'TaskResource')
    @base.TestCase.mock.patch('app.api.Api')
    def test_should_add_task_resource_with_end_points(self, api_mock):
        api_instance = self.mock.MagicMock()
        api_mock.return_value = api_instance
        api.create_api('APP')
        api_instance.add_resource.assert_any_call(
            'TaskResource',
            '/api/projects/<int:project_id>/stories/<int:story_id>/tasks',
            '/api/projects/<int:project_id>/stories/<int:story_id>/tasks/<int:task_id>'
        )
