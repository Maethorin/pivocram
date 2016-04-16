# -*- coding: utf-8 -*-
import requests
from app import config as module_config

config = module_config.get_config()


class Connect(object):
    PIVOTAL_URL = 'https://www.pivotaltracker.com/services/v5'

    def __init__(self):
        self.headers = {'X-TrackerToken': config.PIVOTAL_TOKEN}

    def projects_url(self, project_id=None):
        return '{}/projects{}'.format(self.PIVOTAL_URL, '/{}'.format(project_id) if project_id else '')

    def iterations_url(self, project_id, iteration_id):
        return '{}/iterations/{}'.format(self.projects_url(project_id), iteration_id)

    def project_stories_url(self, project_id, story_id):
        return '{}/stories/{}'.format(self.projects_url(project_id), story_id)

    def get(self, url):
        return requests.get(url, headers=self.headers).json()

    def put(self, url, data):
        return requests.put(url, data, headers=self.headers).json()

    def get_projects(self):
        url = self.projects_url()
        return self.get(url)

    def get_project(self, project_id):
        url = self.projects_url(project_id)
        return self.get(url)

    def get_current_iteration(self, project_id, iteration_id):
        url = self.iterations_url(project_id, iteration_id)
        return self.get(url)

    def update_story(self, project_id, story_id, data):
        url = self.project_stories_url(project_id, story_id)
        return self.put(url, data)


class Client(object):

    def __init__(self, project_id=None):
        self.connect = Connect()
        self.project_id = project_id
        self._current_iteration = None
        self._current_stories = None

    def get_projects(self):
        projects = self.connect.get_projects()
        return projects if projects else []

    @property
    def current_iteration(self):
        if self._current_iteration is None:
            project = self.connect.get_project(self.project_id)
            self._current_iteration = project['current_iteration_number']
        return self._current_iteration

    @property
    def current_stories(self):
        if self._current_stories is None:
            iteration = self.connect.get_current_iteration(self.project_id, self.current_iteration)
            self._current_stories = iteration['stories']
        return self._current_stories

    def get_story(self, story_id):
        pass

    def get_story_tasks(self, story_id):
        pass

    def get_story_task(self, story_id, task_id):
        pass
