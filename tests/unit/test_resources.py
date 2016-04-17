# -*- coding: utf-8 -*-
from tests import base
from app import pivocram, resources


class ResourceBaseTest(base.TestCase):
    @base.TestCase.mock.patch('app.resources.request')
    def test_should_return_request_json_as_payload(self, request_mock):
        request_mock.json = 'PAYLOAD-JSON'
        base_resource = resources.ResourceBase()
        base_resource.payload.should.be.equal('PAYLOAD-JSON')

    def test_should_have_option_respond_true(self):
        base_resource = resources.ResourceBase()
        base_resource.options().should.be.equal({'result': True})


class ProjectsResourceTest(base.TestCase):
    @base.TestCase.mock.patch('app.resources.pivocram.Client', spec=True)
    def test_should_get_list_of_projects_if_no_id_passed(self, class_mock):
        resource = resources.ProjectResource()
        client_mock = class_mock.return_value
        client_mock.get_projects.return_value = 'PROJECTS'
        resource.get().should.be.equal('PROJECTS')
        class_mock.assert_called_with()


class StoriesResourceTest(base.TestCase):
    # accepted, delivered, finished, started, rejected, planned, unstarted, unscheduled

    def create_mock_story(self, story_id, state='planned', estimate=2):
        return {
            'current_state': state,
            'description': 'description {}-{}'.format(state, story_id),
            'estimate': estimate,
            'id': story_id,
            'labels': [{'name': 'label-{}'.format(story_id)}],
            'name': 'Story {} Name'.format(story_id),
            'owner_ids': [],
            'url': 'https://www.pivotaltracker.com/story/show/{}'.format(story_id)
        }

    @base.TestCase.mock.patch('app.resources.pivocram.Client', spec=True)
    def test_should_get_list_of_stories_if_no_id_passed(self, class_mock):
        resource = resources.StoryResource()
        client_mock = class_mock.return_value
        client_mock.current_stories = [
            self.create_mock_story(1),
            self.create_mock_story(2),
            self.create_mock_story(3, 'started'),
            self.create_mock_story(4, 'started'),
            self.create_mock_story(5, 'finished'),
            self.create_mock_story(6, 'delivered'),
            self.create_mock_story(7, 'accepted')
        ]
        resource.get(project_id=1122).should.be.equal({
            'planned': [
                self.create_mock_story(1),
                self.create_mock_story(2)
            ],
            'started': [
                self.create_mock_story(3, 'started'),
                self.create_mock_story(4, 'started')
            ],
            'finished': [
                self.create_mock_story(5, 'finished')
            ],
            'delivered': [
                self.create_mock_story(6, 'delivered')
            ],
            'accepted': [
                self.create_mock_story(7, 'accepted')
            ]
        })
        class_mock.assert_called_with(1122)

    @base.TestCase.mock.patch('app.resources.pivocram.Client', spec=True)
    def test_should_get_story_if_id_passed(self, class_mock):
        resource = resources.StoryResource()
        client_mock = class_mock.return_value
        client_mock.get_story.return_value = 'STORY'
        resource.get(project_id=1122, story_id=1).should.be.equal('STORY')
        client_mock.get_story.assert_called_with(1)

    @base.TestCase.mock.patch('app.resources.request')
    @base.TestCase.mock.patch('app.resources.pivocram.Client', spec=True)
    def test_should_update_story_with_data_passed(self, class_mock, request_mock):
        resource = resources.StoryResource()
        client_mock = class_mock.return_value
        request_mock.json = {'data': 'value'}
        client_mock.update_story.return_value = 'UPDATED'
        resource.put(project_id=1122, story_id=1).should.be.equal('UPDATED')
        client_mock.update_story.assert_called_with(1, {'data': 'value'})


class TasksResourceTest(base.TestCase):
    @base.TestCase.mock.patch('app.resources.pivocram.Client', spec=True)
    def test_should_get_list_of_tasks_if_no_id_passed(self, class_mock):
        resource = resources.TaskResource()
        client_mock = class_mock.return_value
        client_mock.get_story_tasks.return_value = 'STORIES-TASKS'
        resource.get(project_id=1122, story_id=12).should.be.equal('STORIES-TASKS')
        client_mock.get_story_tasks.assert_called_with(12)
        class_mock.assert_called_with(1122)

    @base.TestCase.mock.patch('app.resources.pivocram.Client', spec=True)
    def test_should_get_task_if_id_passed(self, class_mock):
        resource = resources.TaskResource()
        client_mock = class_mock.return_value
        client_mock.get_story_task.return_value = 'STORY-TASK'
        resource.get(project_id=1122, story_id=12, task_id=123).should.be.equal('STORY-TASK')
        client_mock.get_story_task.assert_called_with(12, 123)
