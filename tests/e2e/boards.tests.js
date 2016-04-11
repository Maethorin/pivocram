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
    it('should see a project list', function() {
        browser.get('/#/boards/1234');
        expect(element.all(by.css('.current-stories')).count()).toBeGreaterThan(0);
    })
});
