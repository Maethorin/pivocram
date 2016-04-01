# -*- coding: utf-8 -*-
from tests import base
from app import pivocram


class PivocramConnetcTest(base.TestCase):
    def test_should_have_the_pivotal_api_url(self):
        connect = pivocram.Connect()
        connect.PIVOTAL_URL.should.be.equal('https://www.pivotaltracker.com/services/v5')


class PivocramBaseClientTest(base.TestCase):
    def test_should_have_connect_attribute(self):
        client = pivocram.Client('SOME-TOKEN', project_id='PROJECT-ID')
        self.assertTrue(isinstance(client.connect, pivocram.Connect))

    def test_should_be_create_with_project_id(self):
        client = pivocram.Client('SOME-TOKEN', project_id='PROJECT-ID')
        client.project_id.should.be.equal('PROJECT-ID')

    def test_should_have_method_to_list_stories(self):
        client = pivocram.Client('SOME-TOKEN', project_id='PROJECT-ID')
        hasattr(client, 'get_stories').should.be.truthy

    def test_should_have_method_to_get_story(self):
        client = pivocram.Client('SOME-TOKEN', project_id='PROJECT-ID')
        hasattr(client, 'get_story').should.be.truthy

    def test_should_have_method_to_list_story_tasks(self):
        client = pivocram.Client('SOME-TOKEN', project_id='PROJECT-ID')
        hasattr(client, 'get_story_tasks').should.be.truthy

    def test_should_have_method_to_get_story_task(self):
        client = pivocram.Client('SOME-TOKEN', project_id='PROJECT-ID')
        hasattr(client, 'get_story_tasks').should.be.truthy

    def test_should_set_current_iteration_id(self):
        pass


class StoryTest(base.TestCase):
    def setUp(self):
        self.client = pivocram.Client('SOME-TOKEN', project_id='PROJECT-ID')

    def test_should_have_story_attibute(self):
        self.assertTrue(isinstance(self.client.story, pivocram.Story))

    def test_should_have_connect_in_story(self):
        self.assertTrue(isinstance(self.client.story.connect, pivocram.Connect))

    # @base.TestCase.mock.patch('app.pivocram.requests')
    # def test_should_get_story_list(self, req_mock):
    #     req_mock.get.return_value = [{'id': 1}, {'id': 2}]
    #     story_list = self.client.story.get

