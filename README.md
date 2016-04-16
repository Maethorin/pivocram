[![Build Status](https://travis-ci.org/Maethorin/pivocram.svg?branch=master)](https://travis-ci.org/Maethorin/pivocram)
[![Coverage Status](https://coveralls.io/repos/github/Maethorin/pivocram/badge.svg?branch=master)](https://coveralls.io/github/Maethorin/pivocram?branch=master)


# pivocram
Pivotal Tracker Scrum Board

## Project Setup

This project is build on Python using Flask-RESTful as backend and JavaScript using AngularJS as frontend.

### Backend

To create and runtime environment, considering that you already has a ready Python environment with virtualenv installed, just create a virtualenv and install requirements.

Go to the project folder

    $ cd <project-folder>

Create the virtualenv inside project in a folder venv

    $ virtualenv venv

Activate the virtualenv

    $ source venv/bin/activate

Install requirements using pip

    $ pip install -r requirements.txt

Set the system environments variables in the `.env` file located in the root of this project. The PIVOTAL_TOKEN can be obtained in the dashboard of [Pivotal Tracker, https://www.pivotaltracker.com/] in the account that hold the projects to be showed in Pivocram.

After everything installed, run the app

    $ python run.py

### Frontend

The frontend environment uses `Grunt` to build assets. Grunt is based on `Node.JS` and also use `compass` ruby gem to compile sass files in css.

You will need `bower` too to download all JavaScripts dependencies before build the assets with grunt.

Install bower and grunt:

    $ npm install

If you get any error about `command not found` running grunt, you will need to install its client global:

    $ npm install -g grunt-cli

To install compass, you can use gem or bundle:

    $ gem install compass

or

    $ bundle install

Now, install the bower dependencies:

    $ bower install

Build all assets:

    $ grunt heroku


### Open in browser

Finally, you can open the project in a web browser. The default url for localhost is `http://127.0.0.1:8000/` and must be accessed this way because the backend has CORS enable.