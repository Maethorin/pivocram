describe('App services', function() {
    var $httpBackend, $resource, appConfig, Project, Story, StoryTask;
    beforeEach(module('pivocram'));
    beforeEach(inject(function(_$httpBackend_, _$resource_, _appConfig_, _Project_, _Story_, _StoryTask_) {
        $httpBackend = _$httpBackend_;
        $resource = _$resource_;
        appConfig = _appConfig_;
        Project = _Project_;
        Story = _Story_;
        StoryTask = _StoryTask_;
    }));
    describe('definitions', function() {
        it('should have resource to projects', function() {
            expect(Project).toBeDefined();
        });
        it('should have resource to stories', function() {
            expect(Story).toBeDefined();
        });
        it('should have resource to tasks', function() {
            expect(StoryTask).toBeDefined();
        });
    });
    describe('resources', function() {
        describe('for projects', function() {
            it('should call api/projects when query projects', function() {
                $httpBackend.expect("GET", "{0}/api/projects".format([appConfig.backendURL])).respond(200, [{project: 'project-1'}]);
                var projects = Project.query();
                $httpBackend.flush();
                expect(projects[0].project).toBe('project-1');
            });
            it('should call api/projects/:projectId when get project', function() {
                $httpBackend.expect("GET", "{0}/api/projects/123".format([appConfig.backendURL])).respond(200, {project: 'project-1'});
                var project = Project.get({"projectId": 123});
                $httpBackend.flush();
                expect(project.project).toBe('project-1');
            });
        });
        describe('for stories', function() {
            it('should call api/projects/:projectId/stories when query project`s stories', function() {
                $httpBackend.expect("GET", "{0}/api/projects/123/stories".format([appConfig.backendURL])).respond(200, [{story: 'story-1'}]);
                var stories = Story.query({projectId: 123});
                $httpBackend.flush();
                expect(stories[0].story).toBe('story-1');
            });
            it('should call api/projects/:projectId/stories/:storyId when get project`s story', function() {
                $httpBackend.expect("GET", "{0}/api/projects/123/stories/1234".format([appConfig.backendURL])).respond(200, {story: 'story-1'});
                var story = Story.get({projectId: 123, storyId: 1234});
                $httpBackend.flush();
                expect(story.story).toBe('story-1');
            });
            it('should call PUT on api/projects/:projectId/stories/:storyId when updating project`s story', function() {
                $httpBackend.expect("PUT", "{0}/api/projects/123/stories/1234".format([appConfig.backendURL])).respond(200, {story: 'story-1'});
                var story = Story.update({projectId: 123, storyId: 1234}, {});
                $httpBackend.flush();
                expect(story.story).toBe('story-1');
            });
        });
        describe('for tasks', function() {
            it('should call api/projects/:projectId/stories/:storyId/tasks when query story`s taks', function() {
                $httpBackend.expect("GET", "{0}/api/projects/123/stories/1234/tasks".format([appConfig.backendURL])).respond(200, [{task: 'task-1'}]);
                var tasks = StoryTask.query({projectId: 123, storyId: 1234});
                $httpBackend.flush();
                expect(tasks[0].task).toBe('task-1');
            });
            it('should call api/projects/:projectId/stories/:storyId/tasks/:taskId when get story`s task', function() {
                $httpBackend.expect("GET", "{0}/api/projects/123/stories/1234/tasks/12345".format([appConfig.backendURL])).respond(200, {task: 'task-1'});
                var task = StoryTask.get({projectId: 123, storyId: 1234, taskId: 12345});
                $httpBackend.flush();
                expect(task.task).toBe('task-1');
            });
            it('should call PUT on api/projects/:projectId/stories/:storyId/tasks/:taskId when updating story`s task', function() {
                $httpBackend.expect("PUT", "{0}/api/projects/123/stories/1234/tasks/12345".format([appConfig.backendURL])).respond(200, {task: 'task-1'});
                var task = StoryTask.update({projectId: 123, storyId: 1234, taskId: 12345}, {});
                $httpBackend.flush();
                expect(task.task).toBe('task-1');
            });
        });
    });
});