describe('Board module', function() {
    var $route, appConfig, $controller, $rootScope, $httpBackend, Project, Story;
    var $routeParams = {
        projectId: 123
    };
    beforeEach(module('pivocram'));
    beforeEach(inject(function(_$route_, _appConfig_, _$controller_, _$rootScope_, _$httpBackend_, _Project_, _Story_) {
        $route = _$route_;
        appConfig = _appConfig_;
        $controller = _$controller_;
        $rootScope = _$rootScope_;
        $httpBackend = _$httpBackend_;
        Project = _Project_;
        Story = _Story_;
    }));
    describe('Routes', function() {
        it('should have route to get boards', function() {
            expect($route.routes['/boards']).toBeDefined();
        });
        it('should have route to get the board', function() {
            expect($route.routes['/boards/:projectId']).toBeDefined();
        });
        it('should have configuration for boards route', function() {
            expect($route.routes['/boards'].controller).toBe('BoardsController');
            expect($route.routes['/boards'].templateUrl).toBe('/templates/boards.html');
        });
        it('should have configuration for board route', function() {
            expect($route.routes['/boards/:projectId'].controller).toBe('BoardController');
            expect($route.routes['/boards/:projectId'].templateUrl).toBe('/templates/board.html');
        });
    });
    describe('Initializing Boards', function() {
        var $scope, spyService;
        beforeEach(function() {
            $scope = $rootScope.$new();
            spyService = spyOn(Project, 'query');
            spyService.and.returnValue([1, 2, 3]);
            $controller('BoardsController', {$scope: $scope})
        });
        it('should have a project list', function() {
            expect($scope.projects).toEqual([1, 2, 3]);
            expect(spyService).toHaveBeenCalledWith();
        })
    });
    describe('in board page', function() {
        var $scope, spyService, stories;
        function createMockStory(storyId, state, estimate) {
            if (!state) {
                state = 'planned';
            }
            if (!estimate) {
                estimate = 2;
            }
            return {
                'current_state': state,
                'description': 'description {0}-{1}'.format([state, storyId]),
                'estimate': estimate,
                'id': storyId,
                'labels': [{'name': 'label-{0}'.format([storyId])}],
                'name': 'Story {0} Name'.format([storyId]),
                'owner_ids': [],
                'url': 'https://www.pivotaltracker.com/story/show/{0}'.format([storyId])
            }
        }
        beforeEach(function() {
            $scope = $rootScope.$new();
            stories = {
                'planned': [
                    createMockStory(1),
                    createMockStory(2),
                    createMockStory(7, 'unstarted'),
                    createMockStory(9, 'unstarted')
                ],
                'started': [
                    createMockStory(3, 'started'),
                    createMockStory(4, 'started')
                ],
                'finished': [
                    createMockStory(5, 'finished')
                ],
                'delivered': [
                    createMockStory(6, 'delivered')
                ],
                'accepted': [
                    createMockStory(8, 'accepted')
                ]
            };
            spyService = spyOn(Story, 'currents');
            spyService.and.returnValue(stories);
            var $routeParams = {projectId: 123};
            $controller('BoardController', {$scope: $scope, $routeParams: $routeParams});
        });
        it('should have a project list', function() {
            expect($scope.stories).toEqual(stories);
            expect(spyService).toHaveBeenCalledWith({projectId: 123}, jasmine.any(Function));
        });
        it('should have column list', function() {
            expect($scope.columns).toEqual([
                {name: 'planned', label: 'Planned'},
                {name: 'started', label: 'Started'},
                {name: 'finished', label: 'Finished'},
                {name: 'delivered', label: 'Delivered'},
                {name: 'accepted', label: 'Accepted'}
            ]);
        });
        it('should set correct column size based on label', function() {
            expect($scope.addColumnSize('planned')).toBe('col-md-3');
            expect($scope.addColumnSize('started')).toBe('col-md-3');
            expect($scope.addColumnSize('finished')).toBe('col-md-2');
            expect($scope.addColumnSize('delivered')).toBe('col-md-2');
            expect($scope.addColumnSize('accepted')).toBe('col-md-2');
        });
        it('should point to the column html template using backendURL', function() {
            expect($scope.columnTemplate).toEqual('/templates/include/board-column.html');
        });
        describe('loading stories', function() {
            beforeEach(function() {
                $scope.stories = stories;
                $scope.updateStoryData();
            });
            it('should define that story has task if it was planned', function() {
                expect(stories['planned'][0].hasTasks).toBeTruthy();
            });
            it('should define that story has task if it was unstarted', function() {
                expect(stories['planned'][3].hasTasks).toBeTruthy();
            });
            it('should define that story has task if it was started', function() {
                expect(stories['started'][0].hasTasks).toBeTruthy();
            });
            it('should define that story dos not has task if it was finished', function() {
                expect(stories['finished'][0].hasTasks).toBeFalsy();
            });
            it('should define that story dos not has task if it was delivered', function() {
                expect(stories['delivered'][0].hasTasks).toBeFalsy();
            });
            it('should define that story dos not has task if it was accepted', function() {
                expect(stories['accepted'][0].hasTasks).toBeFalsy();
            });
        });
        describe('dragging a story', function() {
            it('should set story dragged on drag', function() {
                expect($scope.storyDragged).toBe(null);
                $scope.dragStory('', '', 'DRAGGED');
                expect($scope.storyDragged).toBe('DRAGGED');
            });
            it('should use resource to update story current state', function() {
                $scope.storyDragged = {id: 12344};
                $httpBackend.expect('PUT', '{0}/api/projects/123/stories/12344'.format([appConfig.backendURL]), {"current_state": "accepted"}).respond(200, {});
                var dataSpy = spyOn($.fn, 'data');
                dataSpy.and.returnValue('accepted');
                $scope.saveCurrentState({target: '<div></div>'});
                $httpBackend.flush();
                expect(dataSpy).toHaveBeenCalledWith('column');
            });
            it('should set if story has task when moving to started', function() {
                $scope.storyDragged = {id: 12344};
                $httpBackend.expect('PUT', '{0}/api/projects/123/stories/12344'.format([appConfig.backendURL]), {"current_state": "started"}).respond(200, {});
                var dataSpy = spyOn($.fn, 'data');
                dataSpy.and.returnValue('started');
                $scope.saveCurrentState({target: '<div></div>'});
                $httpBackend.flush();
                expect($scope.storyDragged.hasTasks).toBeTruthy();
            });
            it('should set if story has task when moving to finished', function() {
                $scope.storyDragged = {id: 12344};
                $httpBackend.expect('PUT', '{0}/api/projects/123/stories/12344'.format([appConfig.backendURL]), {"current_state": "finished"}).respond(200, {});
                var dataSpy = spyOn($.fn, 'data');
                dataSpy.and.returnValue('finished');
                $scope.saveCurrentState({target: '<div></div>'});
                $httpBackend.flush();
                expect($scope.storyDragged.hasTasks).toBeFalsy();
            });
        });
        describe('changing a task status', function() {
            it('should call function to change task status to complete', function() {
                $httpBackend.expect('PUT', '{0}/api/projects/123/stories/1234/tasks/12345'.format([appConfig.backendURL]), {"complete": "true"}).respond(200, {});
                var task = {complete: false, id: 12345};
                $scope.changeTaskStatus(task, 1234);
                $httpBackend.flush();
                expect(task.complete).toBeTruthy();
            });
            it('should call function to change task status to uncomplete', function() {
                $httpBackend.expect('PUT', '{0}/api/projects/123/stories/1234/tasks/12345'.format([appConfig.backendURL]), {"complete": "false"}).respond(200, {});
                var task = {complete: true, id: 12345};
                $scope.changeTaskStatus(task, 1234);
                $httpBackend.flush();
                expect(task.complete).toBeFalsy();
            });
            it('should call resource to send complete to server', function() {
                var task = {complete: false, id: 12345};
                $httpBackend.expect('PUT', '{0}/api/projects/123/stories/1234/tasks/12345'.format([appConfig.backendURL]), {"complete": "true"}).respond(200, {});
                $scope.changeTaskStatus(task, 1234);
                $httpBackend.flush();
            })
        })
    });
});