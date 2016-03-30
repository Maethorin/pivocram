# -*- coding: utf-8 -*-
from tests import base
from app import pivocram


class PivocramClientTest(base.TestCase):
    def test_should_be_created_with_token(self):
        client = pivocram.Client('SOME-TOKEN')
        client.token.should.be.equal('SOME-TOKEN')

    def test_should_be_possible_to_create_with_project_id(self):
        client = pivocram.Client('SOME-TOKEN', project_id='PROJECT-ID')
        client.project_id.should.be.equal('PROJECT-ID')

    def test_should_have_method_to_list_stories(self):
        client = pivocram.Client('SOME-TOKEN', project_id='PROJECT-ID')
        hasattr(client, 'get_stories').should.be.truthy

    def test_should_have_method_to_get_story(self):
        client = pivocram.Client('SOME-TOKEN', project_id='PROJECT-ID')
        hasattr(client, 'get_story').should.be.truthy

    def test_should_have_method_to_list_story_tasks(self):
        client = pivocram.Client('SOME-TOKEN', project_id='PROJECT-ID')
        hasattr(client, 'get_story_tasks').should.be.truthy

    def test_should_have_method_to_get_story_task(self):
        client = pivocram.Client('SOME-TOKEN', project_id='PROJECT-ID')
        hasattr(client, 'get_story_tasks').should.be.truthy

    def test_should_raise_if_get_stories_is_called_with_no_project_id_defined(self):
        client = pivocram.Client('SOME-TOKEN')
        try:
            client.get_stories()
            self.assertTrue(False, 'get_stories not raised')
        except pivocram.NoProjectDefined:
            self.assertTrue('Done')

    def test_should_raise_if_get_story_is_called_with_no_project_id_defined(self):
        client = pivocram.Client('SOME-TOKEN')
        try:
            client.get_story(123)
            self.assertTrue(False, 'get_story not raised')
        except pivocram.NoProjectDefined:
            self.assertTrue('Done')

    def test_should_raise_if_get_story_tasks_is_called_with_no_project_id_defined(self):
        client = pivocram.Client('SOME-TOKEN')
        try:
            client.get_story_tasks(123)
            self.assertTrue(False, 'get_story not raised')
        except pivocram.NoProjectDefined:
            self.assertTrue('Done')

    def test_should_raise_if_get_story_task_is_called_with_no_project_id_defined(self):
        client = pivocram.Client('SOME-TOKEN')
        try:
            client.get_story_task(123, 1234)
            self.assertTrue(False, 'get_story not raised')
        except pivocram.NoProjectDefined:
            self.assertTrue('Done')
