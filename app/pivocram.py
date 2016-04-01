# -*- coding: utf-8 -*-


class Connect(object):
    PIVOTAL_URL = 'https://www.pivotaltracker.com/services/v5'


class Client(object):
    #projects/#{project.id}/iterations/current

    def __init__(self, token, project_id):
        self.connect = Connect()
        self.token = token
        self.project_id = project_id
        self.story = Story()

    def get_stories(self):
        pass

    def get_story(self, story_id):
        pass

    def get_story_tasks(self, story_id):
        pass

    def get_story_task(self, story_id, task_id):
        pass


class Story(object):
    def __init__(self):
        self.connect = Connect()