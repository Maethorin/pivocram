'use strict';

describe('Accessing Home Page', function() {
    it('should go to boards when clicking in BOARDS menu item', function() {
        browser.get('/');
        var boardLink = element.all((by.css('#mainMenu .navbar-nav li a'))).first();
        boardLink.click();
        expect(browser.getLocationAbsUrl()).toMatch("/boards");
    });
});

describe('Acessing Boards Page', function() {
    it('should see a project list', function() {
        browser.get('/#/boards');
        expect(element.all(by.css('table.projects th')).get(0).getText()).toBe('project');
    })
});
describe('Acessing Board Page', function() {
    beforeEach(function() {
        browser.get('/#/boards/1234');
    });
    it('should have columns container', function() {
        expect(element(by.css('.current-stories')).isPresent()).toBeTruthy();
    });
    it('should have planned columns', function() {
        expect(element(by.css('.current-stories .planned')).isPresent()).toBeTruthy();
        expect(element(by.css('.current-stories .planned .panel-heading h3')).getText()).toBe('PLANNED');
    });
    it('should have started columns', function() {
        expect(element(by.css('.current-stories .started')).isPresent()).toBeTruthy();
        expect(element(by.css('.current-stories .started .panel-heading h3')).getText()).toBe('STARTED');
    });
    it('should have started columns', function() {
        expect(element(by.css('.current-stories .finished')).isPresent()).toBeTruthy();
        expect(element(by.css('.current-stories .finished .panel-heading h3')).getText()).toBe('FINISHED');
    });
    it('should have started columns', function() {
        expect(element(by.css('.current-stories .delivered')).isPresent()).toBeTruthy();
        expect(element(by.css('.current-stories .delivered .panel-heading h3')).getText()).toBe('DELIVERED');
    });
});
