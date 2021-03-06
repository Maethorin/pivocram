# -*- coding: utf-8 -*-

"""
This module define all the api endpoints
"""

from flask_restful import Api


def create_api(app):
    """
    Used when creating a Flask App to register the REST API and its resources
    """
    import resources
    api = Api(app)
    api.add_resource(resources.LoginResource,
                     '/api/login')
    api.add_resource(resources.UserResource,
                     '/api/me')
    api.add_resource(resources.ProjectResource,
                     '/api/projects')
    api.add_resource(resources.AccountMembersResource,
                     '/api/accounts/<int:account_id>/members/<int:member_id>')
    api.add_resource(resources.StoryResource,
                     '/api/projects/<int:project_id>/stories',
                     '/api/projects/<int:project_id>/stories/<int:story_id>')
    api.add_resource(resources.TaskResource,
                     '/api/projects/<int:project_id>/stories/<int:story_id>/tasks',
                     '/api/projects/<int:project_id>/stories/<int:story_id>/tasks/<int:task_id>')
