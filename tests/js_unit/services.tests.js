describe('App services', function() {
    var $httpBackend, $resource, appConfig, Login, Project, Story, StoryTask, AuthService;
    beforeEach(module('pivocram'));
    beforeEach(inject(function(_$httpBackend_, _$resource_, _appConfig_, _Login_, _Project_, _Story_, _StoryTask_, _AuthService_) {
        $httpBackend = _$httpBackend_;
        $resource = _$resource_;
        appConfig = _appConfig_;
        Login = _Login_;
        Project = _Project_;
        Story = _Story_;
        StoryTask = _StoryTask_;
        AuthService = _AuthService_;
    }));
    describe('definitions', function() {
        it('should have resource to login', function() {
            expect(Login).toBeDefined();
        });
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
    describe('Authentication', function() {
        beforeEach(function() {
            localStorage.removeItem('XSRF-TOKEN');
            localStorage.removeItem('USER-NAME');
        });
        it('should set values in localStorage', function() {
            expect(localStorage.getItem('XSRF-TOKEN')).toBeNull();
            expect(localStorage.getItem('USER-NAME')).toBeNull();
            AuthService.update('TOKEN', 123);
            expect(localStorage.getItem('XSRF-TOKEN')).toBe('TOKEN');
            expect(localStorage.getItem('USER-NAME')).toBe('123');
        });
        it('should have properties for token and user_id', function() {
            AuthService.update('TOKEN', 123);
            expect(AuthService.token).toBe('TOKEN');
            expect(AuthService.userName).toBe('123');
        });
        it('should inform if user is logged based on token in localStorage', function() {
            expect(AuthService.userIsLogged()).toBeFalsy();
            localStorage.setItem('XSRF-TOKEN', 'TOKEN');
            expect(AuthService.userIsLogged()).toBeTruthy();
        });
    });
    describe('resources', function() {
        describe('for login', function() {
            it('should call api/login when send login data', function() {
                $httpBackend.expect(
                    "POST",
                    "{0}/api/login".format([appConfig.backendURL]), {email: 'test@test.com', password: '1234'}
                ).respond(200, {token: 'TOKEN', userId: 123});
                var login = new Login({
                    email: 'test@test.com',
                    password: '1234'
                });
                login.$save();
                $httpBackend.flush();
                expect(login.token).toBe('TOKEN');
            });
            it('should call api/projects/:projectId when get project', function() {
                $httpBackend.expect("GET", "{0}/api/projects/123".format([appConfig.backendURL])).respond(200, {project: 'project-1'});
                var project = Project.get({"projectId": 123});
                $httpBackend.flush();
                expect(project.project).toBe('project-1');
            });
        });
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
            it('should call api/projects/:projectId/stories when get project`s currents stories', function() {
                $httpBackend.expect("GET", "{0}/api/projects/123/stories".format([appConfig.backendURL])).respond(200, {planned: [{story: 'story-1'}]});
                var stories = Story.currents({projectId: 123});
                $httpBackend.flush();
                expect(stories.planned[0].story).toBe('story-1');
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