'use strict';
var util = require('util');
var yeoman = require('yeoman-generator');
var path = require('path');
var chalk = require('chalk');
var yosay = require('yosay');

var FbGenerator = yeoman.generators.Base.extend({
  initializing: function () {
    this.pkg = yeoman.file.readJSON(path.join(__dirname, '../package.json'));
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
      default: 'A simple Frontend Boilerplate to start a web project from the scratch'
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
      message: 'Would you like to add test folder? We using Mocha',
      default: true
    }, {
      type: 'confirm',
      name: 'addSampleContent',
      message: 'Would you like to add sample bower content?',
      default: false
    }];

    this.prompt(prompts, function(props) {
      this.appName = props.appName;
      this.appDescription = props.appDescription;
      this.appKeywords = props.appKeywords;
      this.appAuthor = props.appAuthor;
      this.addTestsFolder = props.addTestsFolder;
      this.addSampleContent = props.addSampleContent;

      this.slugifiedAppName = this._.slugify(this.appName);
      this.humanizedAppName = this._.humanize(this.appName);
      this.capitalizedAppAuthor = this._.capitalize(this.appAuthor);

      done();
    }.bind(this));
  },

  appPreprocessor: function () {
    var done = this.async();

    var prompts = [{
      type: 'checkbox',
      name: 'modules',
      message: 'Which Preprocessor would you like to include?',
        choices: [{
          value: 'recess',
          name: 'less',
          checked: false
        }, {
          value: 'gruntSass',
          name: 'sass',
          checked: false
        }, {
          value: 'gruntStylus',
          name: 'stylus',
          checked: false
        }, {
          value: 'css',
          name: 'css',
          checked: false
        }]
    }];

    this.prompt(prompts, function (props) {
      this.recess = this._.contains(props.modules, 'recess');
      this.gruntSass = this._.contains(props.modules, 'gruntSass');
      this.gruntStylus = this._.contains(props.modules, 'gruntStylus');
      this.css = this._.contains(props.modules, 'css');

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
			this.mkdir('assets/css');
			this.mkdir('assets/fonts');
			this.mkdir('assets/images');
			this.mkdir('assets/js');
			this.mkdir('lib');
      this.mkdir('src/scripts');
      this.mkdir('src/vendor');

      //this.copy('assets/css/frontendboilerplate-style.css'); 
      //this.copy('assets/js/frontendboilerplate-scripts.js');
      //this.copy('assets/js/frontendboilerplate-scripts.min.js');
      this.copy('src/scripts/sample1.js'); 
      this.copy('src/scripts/sample2.js');
		
			if (this.recess) {
				this.mkdir('src/less');
        this.copy('src/less/sample.less');
			}
		
			if (this.gruntSass) {
				this.mkdir('src/sass');
        this.copy('src/sass/sample.scss');
			}

      if (this.gruntStylus) {
        this.mkdir('src/stylus');
        this.copy('src/stylus/sample.stylus');
      }

      if (this.css) {
        this.mkdir('src/css');
        this.copy('src/css/sample.css');
      }
			
			if (this.addTestsFolder) {
				this.mkdir('test/mocha');
				this.mkdir('test/mocha/css');
				this.mkdir('test/mocha/js');
				this.mkdir('test/spec');

        //this.copy('test/test.html');
        this.copy('test/mocha/css/mocha.css');
        this.copy('test/mocha/js/mocha.js'); 
        this.copy('test/mocha/js/chai.js');
        this.copy('test/spec/app-test.js');   
			}

      if (this.addSampleContent) {}
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
      bower: false
    });
    this.spawnCommand('grunt', ['build']);
  }
});

module.exports = FbGenerator;