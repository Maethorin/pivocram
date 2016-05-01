describe('Board module', function() {
    var $route, appConfig, $controller, $rootScope, $httpBackend, Project, Story, StoryTask;

    var qMock = {
        all: function() {
            return {
                then: function(callback) {
                    callback();
                }
            }
        }
    };
    beforeEach(module('pivocram'));
    beforeEach(inject(function(_$route_, _appConfig_, _$controller_, _$rootScope_, _$httpBackend_, _Project_, _Story_, _StoryTask_) {
        $route = _$route_;
        appConfig = _appConfig_;
        $controller = _$controller_;
        $rootScope = _$rootScope_;
        $httpBackend = _$httpBackend_;
        Project = _Project_;
        Story = _Story_;
        StoryTask = _StoryTask_;
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
        var $scope, spyService, iteration, estimates, pointsPerColumn;
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
            estimates = {
                planned: 8,
                unstarted: 0,
                started: 4,
                finished: 2,
                delivered: 2,
                accepted: 2
            };
            pointsPerColumn = [
                { column: 'accepted', point: 1 },
                { column: 'accepted', point: 2 },
                { column: 'delivered', point: 3 },
                { column: 'delivered', point: 4 },
                { column: 'finished', point: 5 },
                { column: 'finished', point: 6 },
                { column: 'started', point: 7 },
                { column: 'started', point: 8 },
                { column: 'started', point: 9 },
                { column: 'started', point: 10 },
                { column: 'planned', point: 11 },
                { column: 'planned', point: 12 },
                { column: 'planned', point: 13 },
                { column: 'planned', point: 14 },
                { column: 'planned', point: 15 },
                { column: 'planned', point: 16 },
                { column: 'planned', point: 17 },
                { column: 'planned', point: 18 }
            ];
            iteration = {
                'start': '2016-04-24blablabla',
                'finish': '2016-05-09blablabla',
                'stories': {
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
                }
            };
            spyService = spyOn(Story, 'currents');
            spyService.and.returnValue(iteration);
            var $routeParams = {projectId: 123};
            $controller('BoardController', {$scope: $scope, $routeParams: $routeParams, $q: qMock});
        });
        it('should have a project list', function() {
            expect($scope.iteration).toEqual(iteration);
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
                $scope.iteration = iteration;
                $scope.today = new Date(2016, 4, 3);
                $scope.updateStoryData();
            });
            it('should define that story has task if it was planned', function() {
                expect(iteration.stories['planned'][0].hasTasks).toBeTruthy();
            });
            it('should define that story has task if it was unstarted', function() {
                expect(iteration.stories['planned'][3].hasTasks).toBeTruthy();
            });
            it('should define that story has task if it was started', function() {
                expect(iteration.stories['started'][0].hasTasks).toBeTruthy();
            });
            it('should define that story dos not has task if it was finished', function() {
                expect(iteration.stories['finished'][0].hasTasks).toBeFalsy();
            });
            it('should define that story dos not has task if it was delivered', function() {
                expect(iteration.stories['delivered'][0].hasTasks).toBeFalsy();
            });
            it('should define that story dos not has task if it was accepted', function() {
                expect(iteration.stories['accepted'][0].hasTasks).toBeFalsy();
            });
            it('should fill estimates per column', function() {
                expect($scope.estimates).toEqual(estimates);
            });
            it('should define dev days if in same month', function() {
                $scope.today = new Date(2016, 3, 27);
                $scope.updateStoryData();
                expect($scope.devDays).toEqual([
                    { id: 24, day: 25, points: 1.8, passed: true, isToday: false },
                    { id: 25, day: 26, points: 1.8, passed: true, isToday: false },
                    { id: 26, day: 27, points: 1.8, passed: false, isToday: true },
                    { id: 27, day: 28, points: 1.8, passed: false, isToday: false },
                    { id: 28, day: 29, points: 1.8, passed: false, isToday: false },
                    { id: 31, day: 2, points: 1.8, passed: false, isToday: false },
                    { id: 32, day: 3, points: 1.8, passed: false, isToday: false },
                    { id: 33, day: 4, points: 1.8, passed: false, isToday: false },
                    { id: 34, day: 5, points: 1.8, passed: false, isToday: false },
                    { id: 35, day: 6, points: 1.8, passed: false, isToday: false }
                ]);
            });
            it('should define dev days if in different month', function() {
                $scope.today = new Date(2016, 4, 1);
                $scope.updateStoryData();
                expect($scope.devDays).toEqual([
                    { id: 24, day: 25, points: 1.8, passed: true, isToday: false },
                    { id: 25, day: 26, points: 1.8, passed: true, isToday: false },
                    { id: 26, day: 27, points: 1.8, passed: true, isToday: false },
                    { id: 27, day: 28, points: 1.8, passed: true, isToday: false },
                    { id: 28, day: 29, points: 1.8, passed: true, isToday: false },
                    { id: 31, day: 2, points: 1.8, passed: false, isToday: false },
                    { id: 32, day: 3, points: 1.8, passed: false, isToday: false },
                    { id: 33, day: 4, points: 1.8, passed: false, isToday: false },
                    { id: 34, day: 5, points: 1.8, passed: false, isToday: false },
                    { id: 35, day: 6, points: 1.8, passed: false, isToday: false }
                ]);
            });
            it('should define points per column', function() {
                expect($scope.pointsPerColumn).toEqual(pointsPerColumn);
            });
            describe('getting tasks', function() {
                it('should define getTasks function on planned', function() {
                    expect(iteration.stories['planned'][0].getTasks).toBeDefined();
                });
                it('should define getTasks function on started', function() {
                    expect(iteration.stories['started'][0].getTasks).toBeDefined();
                });
                it('should not define getTasks function on finished', function() {
                    expect(iteration.stories['finished'][0].getTasks).not.toBeDefined();
                });
                it('should call StoryTask resource', function() {
                    var spyStoryTask = spyOn(StoryTask, 'query').and.returnValue([1, 2, 3]);
                    iteration.stories['started'][0].getTasks();
                    expect(spyStoryTask).toHaveBeenCalledWith({projectId: 123, storyId: 3}, jasmine.any(Function));
                    expect(iteration.stories['started'][0].tasks).toEqual([1, 2, 3]);
                });
                it('should tasks loading to false when finihing load tasks', function() {
                    $httpBackend.expect('GET', '{0}/api/projects/123/stories/3/tasks'.format([appConfig.backendURL])).respond(200, [1, 2, 3]);
                    expect(iteration.stories['started'][0].taskLoading).toBeTruthy();
                    iteration.stories['started'][0].getTasks();
                    $httpBackend.flush();
                    expect(iteration.stories['started'][0].taskLoading).toBeFalsy();
                });
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
            it('should set story current state when moving', function() {
                $scope.storyDragged = {id: 12344};
                $httpBackend.expect('PUT', '{0}/api/projects/123/stories/12344'.format([appConfig.backendURL]), {"current_state": "started"}).respond(200, {});
                var dataSpy = spyOn($.fn, 'data');
                dataSpy.and.returnValue('started');
                $scope.saveCurrentState({target: '<div></div>'});
                $httpBackend.flush();
                expect($scope.storyDragged.current_state).toBe('started');
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
            it('should update column estimates', function() {
                $scope.updateStoryData();
                expect($scope.estimates).toEqual(estimates);
                $scope.stories = {
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
                        createMockStory(5, 'finished'),
                        createMockStory(6, 'finished')
                    ],
                    'delivered': [
                    ],
                    'accepted': [
                        createMockStory(7, 'accepted'),
                        createMockStory(8, 'accepted')
                    ]
                };
                $scope.dropStory();
                expect($scope.estimates).toEqual({
                    planned: 8,
                    unstarted: 0,
                    started: 4,
                    finished: 4,
                    delivered: 0,
                    accepted: 4
                });
            });
            it('should update points', function() {
                $scope.updateStoryData();
                expect($scope.pointsPerColumn).toEqual(pointsPerColumn);
                $scope.stories = {
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
                        createMockStory(5, 'finished'),
                        createMockStory(6, 'finished')
                    ],
                    'delivered': [
                    ],
                    'accepted': [
                        createMockStory(7, 'accepted'),
                        createMockStory(8, 'accepted')
                    ]
                };
                $scope.dropStory();
                expect($scope.pointsPerColumn).toEqual([
                    { column: 'accepted', point: 1 },
                    { column: 'accepted', point: 2 },
                    { column: 'accepted', point: 3 },
                    { column: 'accepted', point: 4 },
                    { column: 'finished', point: 5 },
                    { column: 'finished', point: 6 },
                    { column: 'finished', point: 7 },
                    { column: 'finished', point: 8 },
                    { column: 'started', point: 9 },
                    { column: 'started', point: 10 },
                    { column: 'started', point: 11 },
                    { column: 'started', point: 12 },
                    { column: 'planned', point: 13 },
                    { column: 'planned', point: 14 },
                    { column: 'planned', point: 15 },
                    { column: 'planned', point: 16 },
                    { column: 'planned', point: 17 },
                    { column: 'planned', point: 18 },
                    { column: 'planned', point: 19 },
                    { column: 'planned', point: 20 }
                ]);
            })
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
            });
            it('should do nothing if task are already changing', function() {
                var task = {complete: false, id: 12345, changing: true};
                $scope.changeTaskStatus(task, 1234);
                expect(task.complete).toBeFalsy();
            });
        })
    });
});