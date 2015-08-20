'use strict';
var util = require('util');
var yeoman = require('yeoman-generator');
var path = require('path');
var chalk = require('chalk');
var yosay = require('yosay');
var slugify = require("underscore.string/slugify");
var _ = require('underscore');
_.mixin(require('underscore.inflections'));
var mkdirp = require('mkdirp');


var FbGenerator = yeoman.generators.Base.extend({
  initializing: function () {
    this.pkg = require('../package.json');
  },

  appDetails: function () {
    var done = this.async();

    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to ' + chalk.red('Frontendboilerplate') + ' generator!'
    ));

    var prompts = [{
      name: 'appName',
      message: 'What would you like to call your application?',
      default: 'Frontendboilerplate'
    }, {
      name: 'appDescription',
      message: 'How would you describe your application?',
      default: 'Frontend Boilerplate Yeoman generator to scaffold web applications'
    }, {
      name: 'appKeywords',
      message: 'How would you describe your application in comma seperated key words?',
      default: 'FrontendBoilerplate, Yeoman-Generator'
    }, {
      name: 'appAuthor',
      message: 'What is your company/author name?',
      default: 'Mr. FrontendBoilerplate'
    }, {
      type: 'confirm',
      name: 'addTestsFolder',
      message: 'Would you like to add test folder? (We are using Mocha)',
      default: true
    }, {
      type: 'confirm',
      name: 'addSampleContent',
      message: 'Would you like to add sample bower content? (We are using Bootstrap 3)',
      default: true
    }];

    this.prompt(prompts, function(props) {
      this.appName = props.appName;
      this.appDescription = props.appDescription;
      this.appKeywords = props.appKeywords;
      this.appAuthor = props.appAuthor;
      this.addTestsFolder = props.addTestsFolder;
      this.addSampleContent = props.addSampleContent;

      this.slugifiedAppName = slugify(this.appName);
      this.humanizedAppName = _.titleize(this.appName);
      this.capitalizedAppAuthor = _.camelize(this.appAuthor);

      done();
    }.bind(this));
  },

  appPreprocessor: function () {
    var done = this.async();

    var prompts = [{
      type: 'list',
      name: 'stylesheet',
      default: 0,
      message: 'Which Preprocessor would you like to include?',
      choices: [ "CSS", "Sass", "Stylus", "Less"]

    }];

    this.prompt(prompts, function(props) {
    
      if (props.stylesheet === 'CSS') {
            this.css = true;
            mkdirp('src/css');
            this.copy('src/css/sample.css');
      } else {
            this.css = false;
      }

      if (props.stylesheet === 'Less') {
          this.recess = true;
          mkdirp('src/less');
          this.copy('src/less/sample.less');
      } else {
            this.recess = false;
      }

      if (props.stylesheet === 'Sass') {
          this.gruntSass = true;
          mkdirp('src/sass');
          this.copy('src/sass/sample.scss');
      } else {
            this.gruntSass = false;
      }

      if (props.stylesheet === 'Stylus') {
          this.gruntStylus = true;
          mkdirp('src/stylus');
          this.copy('src/stylus/sample.styl');
      } else {
            this.gruntStylus = false;
      }
      
      if (this.addTestsFolder) {
        mkdirp('test/mocha');
        mkdirp('test/mocha/css');
        mkdirp('test/mocha/js');
        mkdirp('test/spec');

        //this.copy('test/test.html');
        this.copy('test/mocha/css/mocha.css');
        this.copy('test/mocha/js/mocha.js'); 
        this.copy('test/mocha/js/chai.js');
        this.copy('test/spec/app-test.js');   
      }

      if (this.addSampleContent) {
        mkdirp('assets/lib');
      }

      done();
    }.bind(this));
  },

  writing: {
    app: function () {
      this.template('_package.json', 'package.json');
      this.template('_bower.json', 'bower.json');
      this.template('_index.html', 'index.html');
      this.template('_Gruntfile.js', 'Gruntfile.js');

      this.template('test/_test.html', 'test/test.html')      
    },
    
    appFolders: function () {
      mkdirp('assets/css');
      mkdirp('assets/fonts');
      mkdirp('assets/images');
      mkdirp('assets/js');
      mkdirp('src/scripts');

      //this.copy('assets/css/frontendboilerplate-style.css'); 
      //this.copy('assets/js/frontendboilerplate-scripts.js');
      //this.copy('assets/js/frontendboilerplate-scripts.min.js');
      this.copy('src/scripts/sample1.js'); 
      this.copy('src/scripts/sample2.js');
    
      
    },
      

    // Add dot files and Gruntfile.js
    projectfiles: function () {
      this.fs.copy(
        this.templatePath('editorconfig'),
        this.destinationPath('.editorconfig')
      );
      this.fs.copy(
        this.templatePath('jshintrc'),
        this.destinationPath('.jshintrc')
      );
      this.fs.copy(
        this.templatePath('csslintrc'),
        this.destinationPath('.csslintrc')
      );
      this.fs.copy(
        this.templatePath('travis.yml'),
        this.destinationPath('.travis.yml')
      );
      this.fs.copy(
        this.templatePath('gitignore'),
        this.destinationPath('.gitignore')
      );
      this.fs.copy(
        this.templatePath('bowerrc'),
        this.destinationPath('.bowerrc')
      );
      this.fs.copy(
        this.templatePath('Dockerfile'),
        this.destinationPath('Dockerfile')
      );
    }
  },

  install: function () {

    this.installDependencies({
      skipInstall: this.options['skip-install'],
      bower: true
    });

  }
});

module.exports = FbGenerator;