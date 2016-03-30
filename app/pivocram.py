# -*- coding: utf-8 -*-


class NoProjectDefined(Exception):
    pass


class Client(object):

    def __init__(self, token, project_id=None):
        self.token = token
        self.project_id = project_id

    def _set_project_id(self, project_id):
        if not project_id:
            project_id = self.project_id
        if not project_id:
            raise NoProjectDefined('Define a project passing a project_id or setting Client.project_id')

    def get_stories(self, project_id=None):
        project_id = self._set_project_id(project_id)

    def get_story(self, story_id, project_id=None):
        project_id = self._set_project_id(project_id)

    def get_story_tasks(self, story_id, project_id=None):
        project_id = self._set_project_id(project_id)

    def get_story_task(self, story_id, task_id, project_id=None):
        project_id = self._set_project_id(project_id)
