module.exports = function(grunt) {

	"use strict";

	// initializes all grunt tasks, no need to load every task by itself
	require('load-grunt-tasks')(grunt);

	// create some nice statistics for time consumation of every task
	require('time-grunt')(grunt);

	grunt.initConfig({

		// reads the package.json and provide e.g. the package name
		pkg: grunt.file.readJSON('package.json'),

		// removes all files from the specified folders
		clean: {
			dist: ['dist/'],
			tmp: ['.tmp/']
		},

		// checks the style of the javascript files
		jshint: {
			options: {
				curly: true,
				eqeqeq: true,
				unused: true,
				bitwise: true,
				forin: true,
				freeze: true,
				undef: true,
				strict: true,
				globals: {
					window: true,
					document: true,
					d3: true,
					jQuery: true,
					topojson: true,
					moment: true,
					SignaturePad: true,
					angular: true,
					Modernizr: true,
					deferredBootstrapper: true
				}
			},
			prod: {
				src: ['dist/javascript/app.js']
			},
			dev: {
				options: {
					globals: {
						// console is allowed in dev mode
						console: true,
						window: true,
						document: true,
						d3: true,
						jQuery: true,
						topojson: true,
						moment: true,
						SignaturePad: true,
						angular: true,
						Modernizr: true,
						deferredBootstrapper: true
					}
				},
				src: ['dist/javascript/app.js']
			},
			gruntfile: {
				options: {
					strict: true,
					globals: {
						require: true,
						module: true
					}
				},
				src: ['Gruntfile.js']
			}
		},

		// compiles the sass code to css code
		sass: {
			dist: {
				files: [{
					expand: true,
					cwd: 'src/sass',
					src: ['*.{scss,sass}'],
					dest: '.tmp/styles',
					ext: '.css'
				}]
			}
		},

		// copies the specified files
		copy: {
			fonts: {
				expand: true,
				flatten: true,
				src: ['bower_components/font-awesome/fonts/*.*'],
				dest: 'dist/fonts/'
			},
			images: {
				expand: true,
				flatten: true,
				src: ['bower_components/jcrop/css/*.gif'],
				dest: 'dist/styles/'
			},
			html: {
				expand: true,
				cwd: 'src/html/',
				src: ['**/*.html'],
				dest: 'dist/'
			},
			languages: {
				expand: true,
				flatten: true,
				src: ['src/languages/**/*.json'],
				dest: 'dist/languages/'
			}
		},

		// adds some necessary css prefixes like -webkit-
		autoprefixer: {
			options: {
				browsers: '> 2% in CH'
			},
			css: {
				src: 'dist/styles/app.css'
			}
		},

		// minifies the css code
		cssmin: {
			options: {
				keepSpecialComments : 0
			},
			target: {
				files:{
					'dist/styles/app.css': 'dist/styles/app.css',
					'dist/styles/libraries.css': 'dist/styles/libraries.css'
				}
			}
		},

		// has to be defined although it's empty, otherwise there is an
		// error in the build: reguired config missing
		bower : {
			install : {
				options : {
					copy : false
				}
			}
		},

		// uglifies the javascript code
		uglify: {
			js: {
				files: {
					'dist/javascript/app.js': 'dist/javascript/app.js',
					'dist/javascript/libraries.js': 'dist/javascript/libraries.js'
				}
			}
		},

		// concats all css & js files from the index.html
		useminPrepare: {
			dev: 'src/html/index.html',
			options: {
				dest: 'dist',
				staging: '.tmp',
				flow: {
					steps: {
						js: ['concat'],
						css: ['concat']
					},
					// bugfix for usemin custom flow:
					post: []
				}
			}
		},

		// replaces the source files from index.html
		usemin: {
			dev: ['dist/index.html']
		},

		// process, which monitors all source files and recompiles after a change
		watch: {
			options: {
				livereload: true
			},
			dev: {
				files: ['src/**/*.*'],
				tasks: ['default']
			},
			prod: {
				files: ['src/**/*.*'],
				tasks: ['prod']
			}
		},

		// starts a server and deploys the specified files
		connect: {
			dist: {
				options: {
					port: 9005,
					base: 'dist',
					open: 'http://<%= connect.dist.options.hostname %>:<%= connect.dist.options.port %>',
					hostname: 'localhost',
					livereload: true
				}
			}
		}

	});

	// the default process, which can be started by calling "grunt"
	grunt.registerTask('default', [
		'bower:install',
		'clean',
		'useminPrepare',
		'sass',
		'concat:generated',
		'jshint:gruntfile',
		'jshint:dev',
		'autoprefixer',
		'copy',
		'usemin',
	 	'clean:tmp'
	]);

	// the productive process, which also minifies. it can be started by calling "grunt prod"
	grunt.registerTask('prod', [
		'default',
		'jshint:prod',
		'uglify',
		'cssmin'
	]);

	// starts a server instance with live deployment. it can be started by calling "grunt serve"
	grunt.registerTask('serve', [
		'default',
		'connect',
		'watch:dev'
	]);

	grunt.registerTask('prod-serve', [
		'prod',
		'connect',
		'watch:prod'
	]);

};
