// Grunt tasks
module.exports = function (grunt) {
	
	'use strict';
	
	// Setup folders name, so if you wnat use a different folder structure, just update this variables
	var config = {
		dirName: 'assets',
		srcName: 'src'
	}

	// Unified Watch Object asign variables for easy editing
	var watchFiles = {
		clientJS:   [config.dirName + '/js/*.js', config.dirName + '/js/vendor/*.js'],
		clientSrc:  [config.srcName + '/scripts/*.js'],
		clientCSS:  [config.dirName + '/css/**/*.css'],
		clientPreprocessor: [config.srcName + '/preprocessor/*.less', config.srcName + '/preprocessor/*.scss'],
		clientHTML: ['/*.html'],
		mochaTests: [config.dirName + '/test/unit/*.js'],
		concatBase: [config.srcName + '/scripts/*js', 'src/vendor/*js' ]
	};
	// Ask for jshint reporter
	var jshintReporter = require('jshint-stylish');
	
	// Define the configuration for all the tasks
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		banner: '/*!\n' +
			'* <%%= pkg.name %> - v<%%= pkg.version %> - MIT LICENSE <%%= grunt.template.today("yyyy-mm-dd") %>. \n' +
			'* @author <%%= pkg.author %>\n' +	
			'*/\n',
		// Project settings		
		clean: {
			build: {
				src: [ config.dirName + '/css/*.css', config.dirName + '/js/*.js']
			},
			// use this task to run before start coding
			//reset: {
			//	src: [config.srcName + 'preprocessor', config.srcName + 'scripts', 'lib']
			//}
		},
		// Watches files for changes and runs tasks based on the changed files
		watch: {
			clientJS: {
				files: watchFiles.clientJS,
				tasks: ['jshint'],
				options: {
					livereload: true
				}
			},
			clientCSS: {
				files: watchFiles.clientCSS,
				tasks: ['csslint'],
				options: {
					livereload: true
				}
			},
			clientPreprocessor: {
				files: watchFiles.clientPreprocessor,
				tasks: [<% if (recess) { %>'less'<% } %><% if (gruntSass) { %>'buildsass'<% } %><% if (gruntStylus) { %>'buildstylus'<% } %><% if (css) { %>'cssmin'<% } %>],
				options: {
					livereload: true
				}
			},
			clientHTML: {
				files: watchFiles.clientHTML,
				//tasks: ['csslint'],
				options: {
					livereload: true
				}
			}
		},
		// Make sure code styles are up to par and there are no obvious mistakes
		jshint: {
			all: {
				src: watchFiles.clientJS.concat(watchFiles.clientSrc),
				options: {
					jshintrc: '.jshintrc',
					reporter: jshintReporter,
					ignores: ['assets/js/*.min.js']
				}
			}
		},
		csslint: {
			options: {
				csslintrc: '.csslintrc'
			},
			all: {
				src: watchFiles.clientCSS
			}
		},
		concat: {
			options: {
				banner: '<%%= banner %>',
				stripBanners: false
			},
			base: {
				src: watchFiles.concatBase,
				dest: 'assets/js/<%%= pkg.name %>-scripts.js'
			}
		},
		uglify: {
			options: {
				banner: '<%%= banner %>',
				report: 'min'
			},
			base: {
				src: ['<%%= concat.base.dest %>'],
				dest: config.dirName + '/js/<%%= pkg.name %>-scripts.min.js'
			}
		},
		<% if (recess) { %>
		recess: {
			options: {
				compile: true,
				banner: '<%%= banner %>'
			},
			style: {
				options: {
					compress: false
				},
				src: [config.srcName + '/less/*.less'],
				dest: config.dirName + '/css/<%%= pkg.name %>-style.css'
			}
		},<% } %>
		<% if (gruntSass) { %>
		sass: {
			dist: {
				files: [{
					'assets/css/<%%= pkg.name %>-style.css': 'src/sass/*.scss'
				}]
			}
		},<% } %>
		<% if (gruntStylus) { %>
		stylus: {
			build: {
				options: {
					compress: false,
					banner: '<%%= banner %>'
				},
				files: {
					'assets/css/<%%= pkg.name %>-style.css': 'src/stylus/*.styl'
					// to compile and concat into single file, using inside the array
					//'path/to/another.css': ['path/to/sources/*.styl', 'path/to/more/*.styl'] 
				}
			}
		},<% } %>
		<% if (css) { %>
		cssmin: {
			add_banner: {
				options: {
					banner: '<%%= banner %>'
				},
				files: {
					'assets/css/<%%= pkg.name %>-style.css': ['src/css/*.css']
				}
			}
		},<% } %>				
		connect: {
			server: {
				options: {
					keepalive: true,
					port: 8000,
					base: '.',
					hostname: 'localhost',
					debug: true,
					livereload: true,
					open: true
				}
			}
		},
		concurrent: {
			tasks: ['connect', 'watch'],
			options: {
				logConcurrentOutput: true
			}
		},
		injector: {
			options: {
				min: true,
				addRootSlash: false,
				relative: true
			},
			// Uncomment to use with others files.
			//local_dependencies: {
				//files: {
					//'index.html': ['js/*.js', 'css/*.css'],
				//}
			//},
			bower_dependencies: {
				files: {
					'index.html': ['bower.json'],
				}
			}
		},
		mocha: {
			test: {
				src: ['test/**/*.html'],
				options: {
					timeout: 10000,
					page: {
						settings: {
							// disable cors checks in phantomjs
							webSecurityEnabled: false  
						}
					},
					reporter: 'Spec',
					// Indicates whether 'mocha.run()' should be executed in'bridge.js'
					run: true
				}
			}
		}
	});
	
	// Time grunt to measure the tasks time
	require('time-grunt')(grunt);

	// Load grunt tasks automatically
	require('load-grunt-tasks')(grunt);

	// Making grunt default to force in order not to break the project if something fail.
	grunt.option('force', true);

	// Development task(s).
	grunt.registerTask('dev', ['concurrent']);
	
	// Css task(s).
	// Using Less with Grunt-Recess or Using Sass with Grunt-sass or Using Stylus with Grunt-contrib-stylus or Using CSS with Grunt-contrib-cssmin
	<% if (recess) { %>grunt.registerTask('less', ['recess']);<% } %><% if (gruntSass) { %>grunt.registerTask('buildsass', ['sass']);<% } %><% if (gruntStylus) { %>grunt.registerTask('buildstylus', ['stylus']);<% } %><% if (css) { %>grunt.registerTask('css', ['cssmin']);<% } %>
	
	// Lint task(s).
	grunt.registerTask('lint', ['jshint', 'csslint']);
	
	// Unit Testing with Karma
	grunt.registerTask('test', ['mocha']);
	
	// Build task(s).
	grunt.registerTask('build', [
		'lint', 
		'concat', 
		'uglify',
		<% if (recess) { %>'less',<% } %><% if (gruntSass) { %>'buildsass',<% } %><% if (gruntStylus) { %>'buildstylus',<% } %><% if (css) { %>'cssmin',<% } %>
		'injector',
		'test',
		'dev'
	]);
};
