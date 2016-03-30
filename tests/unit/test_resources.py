# -*- coding: utf-8 -*-
from tests import base
from app import pivocram, resources


class ResourceBaseTest(base.TestCase):
    def test_should_have_a_pivoram_client_in_in_resource_base(self):
        base_resource = resources.ResourceBase()
        isinstance(base_resource.client, pivocram.Client).should.be.truthy

    def test_client_should_have_been_created_with_config_data(self):
        base_resource = resources.ResourceBase()
        base_resource.client.token.should.be.equal('PIVOTAL_TEST_TOKEN')
        base_resource.client.project_id.should.be.none

    @base.TestCase.mock.patch('app.resources.request')
    def test_should_return_reques_json_as_payload(self, request_mock):
        request_mock.json = 'PAYLOAD-JSON'
        base_resource = resources.ResourceBase()
        base_resource.payload.should.be.equal('PAYLOAD-JSON')

    def test_should_have_option_respond_true(self):
        base_resource = resources.ResourceBase()
        base_resource.options().should.be.equal({'result': True})


class StoriesResourceTest(base.TestCase):
    def test_should_get_list_of_stories_if_no_id_passed(self):
        resource = resources.StoryResource()
        resource.client = self.mock.MagicMock()
        resource.client.get_stories.return_value = 'STORIES'
        resource.get(project_id=1122).should.be.equal('STORIES')
        resource.client.get_stories.assert_called_with()
        resource.client.project_id.should.be.equal(1122)

    def test_should_get_story_if_id_passed(self):
        resource = resources.StoryResource()
        resource.client = self.mock.MagicMock()
        resource.client.get_story.return_value = 'STORY'
        resource.get(project_id=1122, story_id=1).should.be.equal('STORY')
        resource.client.get_story.assert_called_with(1)


class TasksResourceTest(base.TestCase):
    def test_should_get_list_of_tasks_if_no_id_passed(self):
        resource = resources.TaskResource()
        resource.client = self.mock.MagicMock()
        resource.client.get_story_tasks.return_value = 'STORIES-TASKS'
        resource.get(project_id=1122, story_id=12).should.be.equal('STORIES-TASKS')
        resource.client.get_story_tasks.assert_called_with(12)
        resource.client.project_id.should.be.equal(1122)

    def test_should_get_task_if_id_passed(self):
        resource = resources.TaskResource()
        resource.client = self.mock.MagicMock()
        resource.client.get_story_task.return_value = 'STORY-TASK'
        resource.get(project_id=1122, story_id=12, task_id=123).should.be.equal('STORY-TASK')
        resource.client.get_story_task.assert_called_with(12, 123)
