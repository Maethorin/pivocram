# -*- coding: utf-8 -*-
from tests import base
from app import pivocram


class PivocramConnetcTest(base.TestCase):
    def setUp(self):
        self.connect = pivocram.Connect('PIVOTAL_TEST_TOKEN')

    def test_should_have_the_pivotal_api_url(self):
        self.connect.PIVOTAL_URL.should.be.equal('https://www.pivotaltracker.com/services/v5')

    def test_should_have_header_with_token(self):
        self.connect.headers.should.be.equal({'X-TrackerToken': 'PIVOTAL_TEST_TOKEN'})

    def test_should_have_projects_url_for_list(self):
        self.connect.projects_url().should.be.equal('https://www.pivotaltracker.com/services/v5/projects')

    def test_should_have_projects_url_for_item(self):
        self.connect.projects_url(123).should.be.equal('https://www.pivotaltracker.com/services/v5/projects/123')

    def test_should_have_account_member_url(self):
        self.connect.account_member_url(123, 333).should.be.equal('https://www.pivotaltracker.com/services/v5/accounts/123/memberships/333')

    def test_should_have_iterations_url(self):
        self.connect.iterations_url(123, 1).should.be.equal('https://www.pivotaltracker.com/services/v5/projects/123/iterations/1')

    def test_should_have_project_story_url(self):
        self.connect.project_story_url(123, 1234).should.be.equal('https://www.pivotaltracker.com/services/v5/projects/123/stories/1234')

    def test_should_have_project_story_tasks_url(self):
        self.connect.project_story_tasks_url(123, 1234).should.be.equal('https://www.pivotaltracker.com/services/v5/projects/123/stories/1234/tasks')

    def test_should_have_project_story_task_url(self):
        self.connect.project_story_task_url(123, 1234, 12345).should.be.equal('https://www.pivotaltracker.com/services/v5/projects/123/stories/1234/tasks/12345')

    @base.TestCase.mock.patch('app.pivocram.requests')
    def test_should_make_get(self, req_mock):
        response = self.mock.MagicMock()
        response.json.return_value = 'req-response'
        req_mock.get.return_value = response
        self.connect.get('url').should.be.equal('req-response')
        req_mock.get.assert_called_with('url', headers={'X-TrackerToken': 'PIVOTAL_TEST_TOKEN'})

    @base.TestCase.mock.patch('app.pivocram.requests')
    def test_should_make_put(self, req_mock):
        response = self.mock.MagicMock()
        response.json.return_value = 'req-response'
        req_mock.put.return_value = response
        self.connect.put('url', {'data': 'value'}).should.be.equal('req-response')
        req_mock.put.assert_called_with('url', {'data': 'value'}, headers={'X-TrackerToken': 'PIVOTAL_TEST_TOKEN'})

    def test_should_get_projects_list(self):
        self.connect.get = self.mock.MagicMock(return_value='req-response')
        self.connect.projects_url = self.mock.MagicMock(return_value='url-projects')
        self.connect.get_projects().should.be.equal('req-response')
        self.connect.get.assert_called_with('url-projects')

    def test_should_get_project(self):
        self.connect.get = self.mock.MagicMock(return_value='req-response')
        self.connect.projects_url = self.mock.MagicMock(return_value='url-projects')
        self.connect.get_project(123).should.be.equal('req-response')
        self.connect.get.assert_called_with('url-projects')
        self.connect.projects_url.assert_called_with(123)

    def test_should_get_project_member(self):
        self.connect.get = self.mock.MagicMock(return_value='req-response')
        self.connect.account_member_url = self.mock.MagicMock(return_value='url-project-member')
        self.connect.get_account_member(123, 333).should.be.equal('req-response')
        self.connect.get.assert_called_with('url-project-member')
        self.connect.account_member_url.assert_called_with(123, 333)

    def test_should_get_project_story_tasks(self):
        self.connect.get = self.mock.MagicMock(return_value='req-response')
        self.connect.project_story_tasks_url = self.mock.MagicMock(return_value='url-tasks')
        self.connect.get_project_story_tasks(123, 1234).should.be.equal('req-response')
        self.connect.get.assert_called_with('url-tasks')
        self.connect.project_story_tasks_url.assert_called_with(123, 1234)

    def test_should_get_iteration_stories(self):
        self.connect.get = self.mock.MagicMock(return_value='req-response')
        self.connect.iterations_url = self.mock.MagicMock(return_value='url-iterations')
        self.connect.get_current_iteration(123, 1).should.be.equal('req-response')
        self.connect.get.assert_called_with('url-iterations')
        self.connect.iterations_url.assert_called_with(123, 1)

    def test_should_update_story(self):
        self.connect.put = self.mock.MagicMock(return_value='req-response')
        self.connect.project_story_url = self.mock.MagicMock(return_value='url-stories')
        self.connect.update_story(123, 1234, {'data': 'value'}).should.be.equal('req-response')
        self.connect.put.assert_called_with('url-stories', {'data': 'value'})
        self.connect.project_story_url.assert_called_with(123, 1234)

    def test_should_update_story_task(self):
        self.connect.put = self.mock.MagicMock(return_value='req-response')
        self.connect.project_story_task_url = self.mock.MagicMock(return_value='url-stories')
        self.connect.update_story_task(123, 1234, 12345, {'data': 'value'}).should.be.equal('req-response')
        self.connect.put.assert_called_with('url-stories', {'data': 'value'})
        self.connect.project_story_task_url.assert_called_with(123, 1234, 12345)


class PivocramClientTest(base.TestCase):
    project_mock = {"current_iteration_number": 1}

    def setUp(self):
        user = self.mock.MagicMock()
        user.pivotal_token = 'PIVOTAL_TEST_TOKEN'
        self.client = pivocram.Client(user, project_id='PROJECT-ID')

    def test_should_have_connect_attribute(self):
        self.assertTrue(isinstance(self.client.connect, pivocram.Connect))

    def test_should_be_create_with_project_id(self):
        self.client.project_id.should.be.equal('PROJECT-ID')

    def test_should_have_property_list_stories(self):
        self.client._current_iteration = 'CURRENT'
        self.client.current_iteration.should.be.equal('CURRENT')

    def test_should_have_method_to_get_story(self):
        self.client.get_story('STORY-ID').should.be.equal(None)

    def test_should_have_method_to_list_story_tasks(self):
        self.client.connect = self.mock.MagicMock()
        self.client.connect.get_project_story_tasks.return_value = [1, 2, 3]
        self.client.get_story_tasks('STORY-ID').should.be.equal([1, 2, 3])
        self.client.connect.get_project_story_tasks.assert_called_with('PROJECT-ID', 'STORY-ID')

    def test_should_have_method_to_get_story_task(self):
        self.client.get_story_task('STORY-ID', 'TASKS-ID').should.be.equal(None)

    def test_should_get_projects(self):
        self.client.connect = self.mock.MagicMock()
        self.client.connect.get_projects.return_value = [1, 2, 3]
        self.client.get_projects().should.be.equal([1, 2, 3])

    def test_should_get_empty_if_no_projects(self):
        self.client.connect = self.mock.MagicMock()
        self.client.connect.get_projects.return_value = []
        self.client.get_projects().should.be.equal([])

    def test_should_set_current_iteration(self):
        self.client.connect = self.mock.MagicMock()
        self.client.connect.get_project.return_value = self.project_mock
        self.client._current_iteration_number = None
        self.client.current_iteration_number.should.be.equal(1)
        self.client.connect.get_project.assert_called_with('PROJECT-ID')

    def test_should_get_current_stories(self):
        self.client.connect = self.mock.MagicMock()
        self.client.connect.get_current_iteration.return_value = {'stories': [1, 2, 3]}
        self.client.current_iteration.should.be.equal({'stories': [1, 2, 3]})

    def test_should_update_story(self):
        self.client.connect = self.mock.MagicMock()
        self.client.connect.update_story.return_value = {'id': 1234}
        self.client.update_story(1234, {'data': 'value'}).should.be.equal({'id': 1234})

    def test_should_complete_story_task(self):
        self.client.connect = self.mock.MagicMock()
        self.client.connect.update_story_task.return_value = {'id': 1234}
        self.client.complete_story_task(1234, 12345, {'data': 'value'}).should.be.equal({'id': 1234})
