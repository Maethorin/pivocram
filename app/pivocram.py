# -*- coding: utf-8 -*-
import requests
from app import config as module_config


class Connect(object):
    PIVOTAL_URL = 'https://www.pivotaltracker.com/services/v5'

    def __init__(self, pivotal_token):
        self.headers = {'X-TrackerToken': pivotal_token}

    def projects_url(self, project_id=None):
        return '{}/projects{}'.format(self.PIVOTAL_URL, '/{}'.format(project_id) if project_id else '')

    def account_member_url(self, account_id, member_id):
        return '{}/accounts/{}/memberships/{}'.format(self.PIVOTAL_URL, account_id, member_id)

    def iterations_url(self, project_id, iteration_id):
        return '{}/iterations/{}'.format(self.projects_url(project_id), iteration_id)

    def project_story_url(self, project_id, story_id):
        return '{}/stories/{}'.format(self.projects_url(project_id), story_id)

    def project_story_tasks_url(self, project_id, story_id):
        return '{}/tasks'.format(self.project_story_url(project_id, story_id))

    def project_story_task_url(self, project_id, story_id, task_id):
        return '{}/{}'.format(self.project_story_tasks_url(project_id, story_id), task_id)

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

    def get_account_member(self, account_id, member_id):
        url = self.account_member_url(account_id, member_id)
        return self.get(url)

    def get_current_iteration(self, project_id, iteration_id):
        url = self.iterations_url(project_id, iteration_id)
        return self.get(url)

    def get_project_story_tasks(self, project_id, story_id):
        url = self.project_story_tasks_url(project_id, story_id)
        return self.get(url)

    def update_story(self, project_id, story_id, data):
        url = self.project_story_url(project_id, story_id)
        return self.put(url, data)

    def update_story_task(self, project_id, story_id, task_id, data):
        url = self.project_story_task_url(project_id, story_id, task_id)
        return self.put(url, data)


class Client(object):

    def __init__(self, user, project_id=None):
        self.connect = Connect(user.pivotal_token)
        self.project_id = project_id
        self._current_iteration_number = None
        self._current_iteration = None

    def get_projects(self):
        projects = self.connect.get_projects()
        return projects if projects else []

    def get_account_member(self, account_id, member_id):
        return self.connect.get_account_member(account_id, member_id)

    @property
    def current_iteration_number(self):
        if self._current_iteration_number is None:
            project = self.connect.get_project(self.project_id)
            self._current_iteration_number = project['current_iteration_number']
        return self._current_iteration_number

    @property
    def current_iteration(self):
        if self._current_iteration is None:
            self._current_iteration = self.connect.get_current_iteration(self.project_id, self.current_iteration_number)
        return self._current_iteration

    def get_story(self, story_id):
        pass

    def get_story_tasks(self, story_id):
        return self.connect.get_project_story_tasks(self.project_id, story_id)

    def get_story_task(self, story_id, task_id):
        pass

    def update_story(self, story_id, data):
        return self.connect.update_story(self.project_id, story_id, data)

    def complete_story_task(self, story_id, task_id, data):
        return self.connect.update_story_task(self.project_id, story_id, task_id, data)
