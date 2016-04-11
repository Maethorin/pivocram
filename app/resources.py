# -*- coding: utf-8 -*-

from flask import request
from flask_restful import Resource

from app import pivocram, config as config_module

config = config_module.get_config()


class ResourceBase(Resource):
    @property
    def payload(self):
        return request.json

    def options(self, *args, **kwargs):
        return {'result': True}


class StoryResource(ResourceBase):
    def get(self, project_id, story_id=None):
        client = pivocram.Client(project_id)
        if story_id:
            return client.get_story(story_id)
        stories = {
            'planned': [],
            'started': [],
            'finished': [],
            'delivered': [],
            'accepted': []
        }
        for story in client.current_stories:
            stories[story['current_state']].append(story)
        return stories


class TaskResource(ResourceBase):
    def get(self, project_id, story_id, task_id=None):
        client = pivocram.Client(project_id)
        if task_id:
            return client.get_story_task(story_id, task_id)
        return client.get_story_tasks(story_id)


class ProjectResource(ResourceBase):
    def get(self):
        client = pivocram.Client()
        return client.get_projects()
