# -*- coding: utf-8 -*-
from functools import wraps
import re

from flask import request, g, Response
from flask_restful import Resource

from app import models, pivocram, config as config_module

config = config_module.get_config()


def camel_to_snake(name):
    s1 = re.sub('(.)([A-Z][a-z]+)', r'\1_\2', name)
    return re.sub('([a-z0-9])([A-Z])', r'\1_\2', s1).lower()


def snake_to_camel(name):
    result = []
    for index, part in enumerate(name.split('_')):
        if index == 0:
            result.append(part.lower())
        else:
            result.append(part.capitalize())
    return ''.join(result)


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
        return {camel_to_snake(key): value for key, value in request.json.iteritems()}

    def options(self, *args, **kwargs):
        return {'result': True}

    def response(self, data_dict):
        return {snake_to_camel(key): value for key, value in data_dict.iteritems()}


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
        return self.response(g.user.to_dict())

    @login_required
    def post(self):
        return self.response(models.User.create(self.payload).to_dict())

    @login_required
    def put(self):
        if self.payload:
            g.user.update(self.payload)
        return self.response(g.user.to_dict())


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
            if current_state in ['unstarted', 'rejected']:
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


class AccountMembersResource(ResourceBase):
    @login_required
    def get(self, account_id, member_id):
        client = pivocram.Client(g.user)
        return client.get_account_member(account_id, member_id)
