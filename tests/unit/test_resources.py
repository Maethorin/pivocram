# -*- coding: utf-8 -*-
from tests import base
from app import resources


class CasingTest(base.TestCase):
    def test_should_convert_camel_to_snake(self):
        resources.camel_to_snake('getThisSnaked').should.be.equal('get_this_snaked')

    def test_should_convert_snake_to_camel(self):
        resources.snake_to_camel('get_this_camelled').should.be.equal('getThisCamelled')

    def test_should_convert_snake_upper_to_camel(self):
        resources.snake_to_camel('GET_THIS_CAMELLED').should.be.equal('getThisCamelled')

    def test_should_convert_pascal_to_snake(self):
        resources.camel_to_snake('GetThisSnaked').should.be.equal('get_this_snaked')


class ResourceBaseTest(base.TestCase):
    @base.TestCase.mock.patch('app.resources.g', base.TestCase.mock.MagicMock(user=None))
    @base.TestCase.mock.patch('app.resources.Response')
    def test_login_required_return_401_if_no_user(self, response_mock):
        @resources.login_required
        def required_login():
            False.should.be.truthy
        required_login()
        response_mock.assert_called_with('{"result": "Not Authorized"}', 401, content_type='application/json')

    @base.TestCase.mock.patch('app.resources.g', base.TestCase.mock.MagicMock(user='User'))
    def test_login_required_call_function_if_user(self):
        @resources.login_required
        def required_login():
            return 'I WAS CALLED'
        required_login().should.be.equal('I WAS CALLED')

    @base.TestCase.mock.patch('app.resources.request')
    def test_should_return_request_json_as_payload(self, request_mock):
        request_mock.json = {'one': 'One', 'two': 2}
        base_resource = resources.ResourceBase()
        base_resource.payload.should.be.equal({'one': 'One', 'two': 2})

    @base.TestCase.mock.patch('app.resources.request')
    def test_should_snake_case_payload(self, request_mock):
        request_mock.json = {'oneThing': 'One', 'twoThings': 2}
        base_resource = resources.ResourceBase()
        base_resource.payload.should.be.equal({'one_thing': 'One', 'two_things': 2})

    def test_should_have_option_respond_true(self):
        base_resource = resources.ResourceBase()
        base_resource.options().should.be.equal({'result': True})

    def test_should_respond_converting_to_camel_casing(self):
        base_resource = resources.ResourceBase()
        base_resource.response({'user': 'Zas', 'convert_this': 'Zis'}).should.be.equal({'user': 'Zas', 'convertThis': 'Zis'})


class LoginResourceTest(base.TestCase):
    @base.TestCase.mock.patch('app.models.User')
    @base.TestCase.mock.patch('app.resources.request')
    @base.TestCase.mock.patch('app.resources.g')
    def test_return_token_if_login_is_successfull(self, g_mock, request_mock, user_cls_mock):
        request_mock.json = {'email': 'test@test.com', 'password': '1234'}
        user_mock = self.mock.MagicMock()
        user_mock.name = 'User Name'
        user_mock.check_password.return_value = True
        user_mock.generate_auth_token.return_value = 'OTTTOKEN'
        user_cls_mock.get_by_email.return_value = user_mock
        resource = resources.LoginResource()
        resource.post().should.be.equal({'token': 'OTTTOKEN', 'userName': 'User Name'})
        g_mock.user.should.be.equal(user_mock)

    @base.TestCase.mock.patch('app.models.User')
    @base.TestCase.mock.patch('app.resources.request')
    @base.TestCase.mock.patch('app.resources.g')
    def test_return_not_authorized_if_password_does_not_match(self, g_mock, request_mock, user_cls_mock):
        request_mock.json = {'email': 'test@test.com', 'password': '1234'}
        user_mock = self.mock.MagicMock()
        user_mock.id = 'USER-ID'
        user_mock.check_password.return_value = False
        user_cls_mock.get_by_email.return_value = user_mock
        resource = resources.LoginResource()
        resource.post().should.be.equal(({'result': 'Not Authorized'}, 401))
        g_mock.user.should.be.equal(user_mock)

    @base.TestCase.mock.patch('app.models.User')
    @base.TestCase.mock.patch('app.resources.request')
    @base.TestCase.mock.patch('app.resources.g')
    def test_return_not_authorized_if_no_user_id_found(self, g_mock, request_mock, user_cls_mock):
        request_mock.json = {'email': 'test@test.com', 'password': '1234'}
        user_cls_mock.get_by_email.return_value = None
        resource = resources.LoginResource()
        resource.post().should.be.equal(({'result': 'Not Authorized'}, 401))
        g_mock.user.should.be.none


class UserResourceTest(base.TestCase):
    @base.TestCase.mock.patch('app.resources.g', base.TestCase.mock.MagicMock())
    @base.TestCase.mock.patch('app.models.User')
    @base.TestCase.mock.patch('app.resources.request')
    def test_should_create_user_in_post(self, request_mock, user_cls):
        request_mock.json = {
            'email': 'test@user.com',
            'name': 'User Name',
            'password': '1234'
        }
        user = self.mock.MagicMock()
        user.to_dict.return_value = {
            'email': 'test@user.com',
            'name': 'User Name',
        }
        user_cls.create.return_value = user
        resource = resources.UserResource()
        resource.post().should.be.equal({
            'email': 'test@user.com',
            'name': 'User Name',
        })
        user_cls.create.assert_called_with(request_mock.json)

    @base.TestCase.mock.patch('app.resources.g')
    def test_should_get_user(self, g_mock):
        user = self.mock.MagicMock()
        user.to_dict.return_value = {
            'email': 'test@user.com',
            'name': 'User Name',
            'pivotal_token': 'TOKEN'
        }
        g_mock.user = user
        resource = resources.UserResource()
        resource.get().should.be.equal({
            'email': 'test@user.com',
            'name': 'User Name',
            'pivotalToken': 'TOKEN'
        })

    @base.TestCase.mock.patch('app.resources.models.db.session', base.TestCase.mock.MagicMock())
    @base.TestCase.mock.patch('app.resources.request')
    @base.TestCase.mock.patch('app.resources.g')
    def test_should_update_user(self, g_mock, request_mock):
        user = resources.models.User()
        user.email = 'test@user.com'
        user.name = 'User Name'
        user.pivotal_token = 'TOKEN-1'
        request_mock.json = {
            'pivotal_token': 'TOKEN-2'
        }
        g_mock.user = user
        resource = resources.UserResource()
        resource.put().should.be.equal({
            'email': 'test@user.com',
            'name': 'User Name',
            'pivotalToken': 'TOKEN-2'
        })

    @base.TestCase.mock.patch('app.resources.request')
    @base.TestCase.mock.patch('app.resources.g')
    def test_should_not_update_user_if_request_json_is_empty(self, g_mock, request_mock):
        user = resources.models.User()
        user.email = 'test@user.com'
        user.name = 'User Name'
        user.pivotal_token = 'TOKEN'
        user.update = self.mock.MagicMock()
        request_mock.json = {}
        g_mock.user = user
        resource = resources.UserResource()
        resource.put().should.be.equal({
            'email': 'test@user.com',
            'name': 'User Name',
            'pivotalToken': 'TOKEN'
        })
        user.update.assert_not_called()


class ProjectsResourceTest(base.TestCase):
    @base.TestCase.mock.patch('app.resources.g', base.TestCase.mock.MagicMock(user='OneUser'))
    @base.TestCase.mock.patch('app.resources.pivocram.Client', spec=True)
    def test_should_get_list_of_projects_if_no_id_passed(self, class_mock):
        resource = resources.ProjectResource()
        client_mock = class_mock.return_value
        client_mock.get_projects.return_value = 'PROJECTS'
        resource.get().should.be.equal('PROJECTS')
        class_mock.assert_called_with('OneUser')


class StoriesResourceTest(base.TestCase):
    def create_mock_story(self, story_id, state='planned', story_type='feature', estimate=2):
        return {
            'current_state': state,
            'description': 'description {}-{}'.format(state, story_id),
            'estimate': estimate,
            'story_type': story_type,
            'id': story_id,
            'labels': [{'name': 'label-{}'.format(story_id)}],
            'name': 'Story {} Name'.format(story_id),
            'owner_ids': [],
            'url': 'https://www.pivotaltracker.com/story/show/{}'.format(story_id)
        }

    @base.TestCase.mock.patch('app.resources.g', base.TestCase.mock.MagicMock(user='User'))
    @base.TestCase.mock.patch('app.resources.pivocram.Client', spec=True)
    def test_should_get_list_of_stories_if_no_id_passed(self, class_mock):
        resource = resources.StoryResource()
        client_mock = class_mock.return_value
        client_mock.current_iteration = {
            'start': '2016-04-19T12:00:05Z',
            'finish': '2016-04-30T12:00:05Z',
            'stories': [
                self.create_mock_story(1),
                self.create_mock_story(2),
                self.create_mock_story(3, 'started'),
                self.create_mock_story(4, 'started'),
                self.create_mock_story(5, 'finished'),
                self.create_mock_story(6, 'delivered'),
                self.create_mock_story(7, 'unstarted'),
                self.create_mock_story(8, 'accepted'),
                self.create_mock_story(9, 'unstarted'),
                self.create_mock_story(10, story_type='release')
            ]
        }
        resource.get(project_id=1122).should.be.equal({
            'start': '2016-04-19T12:00:05Z',
            'finish': '2016-04-30T12:00:05Z',
            'stories': {
                'planned': [
                    self.create_mock_story(1),
                    self.create_mock_story(2),
                    self.create_mock_story(7, 'unstarted'),
                    self.create_mock_story(9, 'unstarted')
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
                    self.create_mock_story(8, 'accepted')
                ]
            }
        })
        class_mock.assert_called_with('User', 1122)

    @base.TestCase.mock.patch('app.resources.g', base.TestCase.mock.MagicMock(user='User'))
    @base.TestCase.mock.patch('app.resources.pivocram.Client', spec=True)
    def test_should_get_story_if_id_passed(self, class_mock):
        resource = resources.StoryResource()
        client_mock = class_mock.return_value
        client_mock.get_story.return_value = 'STORY'
        resource.get(project_id=1122, story_id=1).should.be.equal('STORY')
        client_mock.get_story.assert_called_with(1)

    @base.TestCase.mock.patch('app.resources.g', base.TestCase.mock.MagicMock(user='User'))
    @base.TestCase.mock.patch('app.resources.request')
    @base.TestCase.mock.patch('app.resources.pivocram.Client', spec=True)
    def test_should_update_story_with_data_passed(self, class_mock, request_mock):
        resource = resources.StoryResource()
        client_mock = class_mock.return_value
        request_mock.json = {'data': 'value'}
        client_mock.update_story.return_value = 'UPDATED'
        resource.put(project_id=1122, story_id=1).should.be.equal('UPDATED')
        client_mock.update_story.assert_called_with(1, {'data': 'value'})
        class_mock.assert_called_with('User', 1122)


class TasksResourceTest(base.TestCase):
    @base.TestCase.mock.patch('app.resources.g', base.TestCase.mock.MagicMock(user='User'))
    @base.TestCase.mock.patch('app.resources.pivocram.Client', spec=True)
    def test_should_get_list_of_tasks_if_no_id_passed(self, class_mock):
        resource = resources.TaskResource()
        client_mock = class_mock.return_value
        client_mock.get_story_tasks.return_value = 'STORIES-TASKS'
        resource.get(project_id=1122, story_id=12).should.be.equal('STORIES-TASKS')
        client_mock.get_story_tasks.assert_called_with(12)
        class_mock.assert_called_with('User', 1122)

    @base.TestCase.mock.patch('app.resources.g', base.TestCase.mock.MagicMock(user='User'))
    @base.TestCase.mock.patch('app.resources.pivocram.Client', spec=True)
    def test_should_get_task_if_id_passed(self, class_mock):
        resource = resources.TaskResource()
        client_mock = class_mock.return_value
        client_mock.get_story_task.return_value = 'STORY-TASK'
        resource.get(project_id=1122, story_id=12, task_id=123).should.be.equal('STORY-TASK')
        client_mock.get_story_task.assert_called_with(12, 123)

    @base.TestCase.mock.patch('app.resources.g', base.TestCase.mock.MagicMock(user='User'))
    @base.TestCase.mock.patch('app.resources.request')
    @base.TestCase.mock.patch('app.resources.pivocram.Client', spec=True)
    def test_should_complete_task_on_update(self, class_mock, request_mock):
        resource = resources.TaskResource()
        request_mock.json = {'complete': True}
        client_mock = class_mock.return_value
        client_mock.complete_story_task.return_value = 'completed'
        resource.put(project_id=1122, story_id=12, task_id=123).should.be.equal('completed')
        client_mock.complete_story_task.assert_called_with(12, 123, {'complete': True})
        class_mock.assert_called_with('User', 1122)
