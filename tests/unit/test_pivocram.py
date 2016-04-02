# -*- coding: utf-8 -*-
from tests import base
from app import pivocram


class PivocramConnetcTest(base.TestCase):
    def setUp(self):
        self.connect = pivocram.Connect()

    def test_should_have_the_pivotal_api_url(self):
        self.connect.PIVOTAL_URL.should.be.equal('https://www.pivotaltracker.com/services/v5')

    def test_should_have_header_with_token(self):
        self.connect.headers.should.be.equal({'X-TrackerToken': 'PIVOTAL_TEST_TOKEN'})

    def test_should_have_projects_url(self):
        self.connect.projects_url(123).should.be.equal('https://www.pivotaltracker.com/services/v5/projects/123')

    def test_should_have_iterations_url(self):
        self.connect.iterations_url(123, 1).should.be.equal('https://www.pivotaltracker.com/services/v5/projects/123/iterations/1')

    @base.TestCase.mock.patch('app.pivocram.requests')
    def test_should_make_get(self, req_mock):
        response = self.mock.MagicMock()
        response.json.return_value = 'req-response'
        req_mock.get.return_value = response
        self.connect.get('url').should.be.equal('req-response')
        req_mock.get.assert_called_with('url', headers={'X-TrackerToken': 'PIVOTAL_TEST_TOKEN'})

    def test_should_get_project(self):
        self.connect.get = self.mock.MagicMock(return_value='req-response')
        self.connect.projects_url = self.mock.MagicMock(return_value='url-projects')
        self.connect.get_project(123).should.be.equal('req-response')
        self.connect.get.assert_called_with('url-projects')

    def test_should_get_iteration_stories(self):
        self.connect.get = self.mock.MagicMock(return_value='req-response')
        self.connect.iterations_url = self.mock.MagicMock(return_value='url-iterations')
        self.connect.get_current_iteration(123, 1).should.be.equal('req-response')
        self.connect.get.assert_called_with('url-iterations')


class PivocramBaseClientTest(base.TestCase):
    project_mock = {"current_iteration_number": 1}

    def setUp(self):
        self.client = pivocram.Client(project_id='PROJECT-ID')

    def test_should_have_connect_attribute(self):
        self.assertTrue(isinstance(self.client.connect, pivocram.Connect))

    def test_should_be_create_with_project_id(self):
        self.client.project_id.should.be.equal('PROJECT-ID')

    def test_should_have_property_list_stories(self):
        self.client._current_stories = 'CURRENT'
        self.client.current_stories.should.be.equal('CURRENT')

    def test_should_have_method_to_get_story(self):
        self.client.get_story('STORY-ID').should.be.equal(None)

    def test_should_have_method_to_list_story_tasks(self):
        self.client.get_story_tasks('STORY-ID').should.be.equal(None)

    def test_should_have_method_to_get_story_task(self):
        self.client.get_story_task('STORY-ID', 'TASKS-ID').should.be.equal(None)

    def test_should_set_current_iteration(self):
        self.client.connect = self.mock.MagicMock()
        self.client.connect.get_project.return_value = self.project_mock
        self.client._current_iteration = None
        self.client.current_iteration.should.be.equal(1)
        self.client.connect.get_project.assert_called_with('PROJECT-ID')

    def test_should_get_current_stories(self):
        self.client.connect = self.mock.MagicMock()
        self.client.connect.get_current_iteration.return_value = {'stories': [1, 2, 3]}
        self.client.current_stories.should.be.equal([1, 2, 3])


class StoryTest(base.TestCase):
    def setUp(self):
        self.client = pivocram.Client(project_id='PROJECT-ID')

    def test_should_have_story_attibute(self):
        self.assertTrue(isinstance(self.client.story, pivocram.Story))

    def test_should_have_connect_in_story(self):
        self.assertTrue(isinstance(self.client.story.connect, pivocram.Connect))

    # @base.TestCase.mock.patch('app.pivocram.requests')
    # def test_should_get_story_list(self, req_mock):
    #     req_mock.get.return_value = [{'id': 1}, {'id': 2}]
    #     story_list = self.client.story.get

