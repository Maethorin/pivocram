# -*- coding: utf-8 -*-

from flask import request
from flask_restful import Resource

from app import pivocram, config as config_module

config = config_module.get_config()


class ResourceBase(Resource):
    client = pivocram.Client(config.PIVOTAL_TOKEN)

    @property
    def payload(self):
        return request.json

    def options(self, *args, **kwargs):
        return {'result': True}


class StoryResource(ResourceBase):
    def get(self, project_id, story_id=None):
        self.client.project_id = project_id
        if story_id:
            return self.client.get_story(story_id)
        return self.client.get_stories()


class TaskResource(ResourceBase):
    def get(self, project_id, story_id, task_id=None):
        self.client.project_id = project_id
        if task_id:
            return self.client.get_story_task(story_id, task_id)
        return self.client.get_story_tasks(story_id)
