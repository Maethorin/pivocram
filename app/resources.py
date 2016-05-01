# -*- coding: utf-8 -*-
from functools import wraps

from flask import request, g, Response
from flask_restful import Resource

from app import models, pivocram, config as config_module

config = config_module.get_config()


def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        user = getattr(g, 'user', None)
        if user is None:
            return Response('{"result": "Not Authorized"}', 401, content_type='application/json')
        return f(*args, **kwargs)
    return decorated_function


class ResourceBase(Resource):
    @property
    def payload(self):
        return request.json

    def options(self, *args, **kwargs):
        return {'result': True}


class LoginResource(ResourceBase):
    def post(self):
        try:
            g.user = models.User.get_by_email(self.payload['email'])
            if g.user.check_password(self.payload['password']):
                return {'token': g.user.generate_auth_token(), 'userName': g.user.name}
        except Exception:
            pass
        return {'result': 'Not Authorized'}, 401


class UserResource(ResourceBase):
    @login_required
    def get(self):
        return g.user.to_dict()

    @login_required
    def post(self):
        return models.User.create(self.payload).to_dict()

    @login_required
    def put(self):
        if self.payload:
            g.user.update(self.payload)
        return g.user.to_dict()


class StoryResource(ResourceBase):
    @login_required
    def put(self, project_id, story_id):
        client = pivocram.Client(g.user, project_id=project_id)
        return client.update_story(story_id, self.payload)

    @login_required
    def get(self, project_id, story_id=None):
        client = pivocram.Client(g.user, project_id=project_id)
        if story_id:
            return client.get_story(story_id)
        current_iteration = client.current_iteration
        iteration = {
            'start': current_iteration['start'],
            'finish': current_iteration['finish'],
            'stories': {
                'planned': [],
                'started': [],
                'finished': [],
                'delivered': [],
                'accepted': []
            }
        }
        for story in current_iteration['stories']:
            if story['story_type'] == 'release':
                continue
            current_state = story['current_state']
            if current_state == 'unstarted':
                current_state = 'planned'
            iteration['stories'][current_state].append(story)
        return iteration


class TaskResource(ResourceBase):
    @login_required
    def get(self, project_id, story_id, task_id=None):
        client = pivocram.Client(g.user, project_id=project_id)
        if task_id:
            return client.get_story_task(story_id, task_id)
        return client.get_story_tasks(story_id)

    @login_required
    def put(self, project_id, story_id, task_id):
        client = pivocram.Client(g.user, project_id=project_id)
        return client.complete_story_task(story_id, task_id, self.payload)


class ProjectResource(ResourceBase):
    @login_required
    def get(self):
        client = pivocram.Client(g.user)
        return client.get_projects()
