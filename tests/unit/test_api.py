# -*- coding: utf-8 -*-
from tests import base
from app import api


class ApiTest(base.TestCase):
    @base.TestCase.mock.patch('app.api.resources')
    @base.TestCase.mock.patch('app.api.Api')
    def test_should_add_login_resource_with_end_points(self, api_mock, resources_mock):
        resources_mock.LoginResource = 'LoginResource'
        api_instance = self.mock.MagicMock()
        api_mock.return_value = api_instance
        api.create_api('APP')
        api_instance.add_resource.assert_any_call(
            'LoginResource',
            '/api/login'
        )

    @base.TestCase.mock.patch('app.api.resources')
    @base.TestCase.mock.patch('app.api.Api')
    def test_should_add_user_resource_with_end_points(self, api_mock, resources_mock):
        resources_mock.UserResource = 'UserResource'
        api_instance = self.mock.MagicMock()
        api_mock.return_value = api_instance
        api.create_api('APP')
        api_instance.add_resource.assert_any_call(
            'UserResource',
            '/api/user',
            '/api/user/<int:user_id>'
        )

    @base.TestCase.mock.patch('app.api.resources')
    @base.TestCase.mock.patch('app.api.Api')
    def test_should_add_project_resource_with_end_points(self, api_mock, resources_mock):
        resources_mock.ProjectResource = 'ProjectResource'
        api_instance = self.mock.MagicMock()
        api_mock.return_value = api_instance
        api.create_api('APP')
        api_instance.add_resource.assert_any_call(
            'ProjectResource',
            '/api/projects'
        )

    @base.TestCase.mock.patch('app.api.resources')
    @base.TestCase.mock.patch('app.api.Api')
    def test_should_add_story_resource_with_end_points(self, api_mock, resources_mock):
        resources_mock.StoryResource = 'StoryResource'
        api_instance = self.mock.MagicMock()
        api_mock.return_value = api_instance
        api.create_api('APP')
        api_instance.add_resource.assert_any_call(
            'StoryResource',
            '/api/projects/<int:project_id>/stories',
            '/api/projects/<int:project_id>/stories/<int:story_id>'
        )

    @base.TestCase.mock.patch('app.api.resources')
    @base.TestCase.mock.patch('app.api.Api')
    def test_should_add_task_resource_with_end_points(self, api_mock, resources_mock):
        resources_mock.TaskResource = 'TaskResource'
        api_instance = self.mock.MagicMock()
        api_mock.return_value = api_instance
        api.create_api('APP')
        api_instance.add_resource.assert_any_call(
            'TaskResource',
            '/api/projects/<int:project_id>/stories/<int:story_id>/tasks',
            '/api/projects/<int:project_id>/stories/<int:story_id>/tasks/<int:task_id>'
        )
