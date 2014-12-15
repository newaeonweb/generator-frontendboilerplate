'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');

module.exports = yeoman.generators.Base.extend({
  initializing: function () {
    this.pkg = require('../package.json');
  },

  prompting: function () {
    var done = this.async();

    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the good' + chalk.red('Frontendboilerplate') + ' generator!'
    ));

    var prompts = [{
      type: 'checkbox',
      name: 'modules',
      message: 'Which Preprocessor would you like to include?',
        choices: [{
        value: 'less',
        name: 'recess',
        checked: false
        }, {
        value: 'sass',
        name: 'grunt-sass',
        checked: false
        }, {
        value: 'stylus',
        name: 'grunt-stylus',
        checked: false
        }, {
        value: 'css',
        name: 'css',
        checked: false
        }]
    }];

    this.prompt(prompts, function (props) {
      this.less = this._.contains(props.modules, 'recess');
      this.sass = this._.contains(props.modules, 'grunt-sass');
      this.stylus = this._.contains(props.modules, 'grunt-stylus');
      this.css = this._.contains(props.modules, 'css');

      done();
    }.bind(this));
  },

  prompting2: function() {
    var done = this.async();

    var prompts = [{
      type: 'confirm',
      name: 'modules',
      message: 'Do you like to include test folders?',
        choices: [{
        value: 'test',
        name: 'test',
        checked: true
        }]
    }];

    this.prompt(prompts, function (props) {
      this.less = this._.contains(props.modules, 'test');

      done();
    }.bind(this));
  },

  prompting3: function() {
    var done = this.async();

    var prompts = [{
      type: 'confirm',
      name: 'modules',
      message: 'Do you like to include sample content?',
        choices: [{
        value: 'sample',
        name: 'sample',
        checked: true
        }]
    }];

    this.prompt(prompts, function (props) {
      this.less = this._.contains(props.modules, 'test');

      done();
    }.bind(this));
  },

  writing: {
    app: function () {
      this.fs.copy(
        this.templatePath('_package.json'),
        this.destinationPath('package.json')
      );
      this.fs.copy(
        this.templatePath('_bower.json'),
        this.destinationPath('bower.json')
      );
    },

    projectfiles: function () {
      this.fs.copy(
        this.templatePath('editorconfig'),
        this.destinationPath('.editorconfig')
      );
      this.fs.copy(
        this.templatePath('jshintrc'),
        this.destinationPath('.jshintrc')
      );
    }
  },

  install: function () {
    this.installDependencies({
      skipInstall: this.options['skip-install']
    });
  }
});
