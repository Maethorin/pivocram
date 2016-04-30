# -*- coding: utf-8 -*-
from functools import wraps

from flask import request, g, Response
from flask_restful import Resource

from app import pivocram, config as config_module

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
            import models
            g.user = models.User.get_by_email(request.json['email'])
            if g.user.check_password(request.json['password']):
                return {'token': g.user.generate_auth_token(), 'userId': g.user.id}
        except Exception:
            pass
        return {'result': 'Not Authorized'}, 401


class StoryResource(ResourceBase):
    @login_required
    def put(self, project_id, story_id):
        client = pivocram.Client(project_id)
        return client.update_story(story_id, request.json)

    @login_required
    def get(self, project_id, story_id=None):
        client = pivocram.Client(project_id)
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
        client = pivocram.Client(project_id)
        if task_id:
            return client.get_story_task(story_id, task_id)
        return client.get_story_tasks(story_id)

    @login_required
    def put(self, project_id, story_id, task_id):
        client = pivocram.Client(project_id)
        return client.complete_story_task(story_id, task_id, request.json)


class ProjectResource(ResourceBase):
    @login_required
    def get(self):
        client = pivocram.Client()
        return client.get_projects()
