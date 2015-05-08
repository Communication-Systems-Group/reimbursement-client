module.exports = function(grunt) {

	"use strict";

	// initializes all grunt tasks, no need to load every task by itself
	require('load-grunt-tasks')(grunt);

	// create some nice statistics for time consumation of every task
	require('time-grunt')(grunt);

	var jsFiles = [ 'src/js/app.js',
			'src/js/utility/base64BinaryConverter.service.js',
			'src/js/spinner/spinner.service.js',
			'src/js/spinner/spinner.directive.js',
			'src/js/signature/signature.restservice.js',
			'src/js/signature/signature-qr-error.controller.js',
			'src/js/signature/signature-qr.controller.js',
			'src/js/signature/signature-pad.directive.js',
			'src/js/signature/signature.controller.js',
			'src/js/cropping/crop.directive.js',
			'src/js/cropping/cropping.restservice.js',
			'src/js/cropping/cropping.controller.js',
			'src/js/dashboard/dashboard.controller.js' ];

	grunt
			.initConfig({

				// reads the package.json and provide e.g. the package name
				pkg : grunt.file.readJSON('package.json'),

				// removes all files from the specified folders
				clean : {
					build : [ 'build/' ],
					tmp : [ 'tmp/' ]
				},

				// concatenates files to one single file
				concat : {
					js : {
						src : jsFiles,
						dest : 'build/app.js'
					},
					css : {
						src : [ 'tmp/css/*.css' ],
						dest : 'build/client.css'
					}
				},

				// checks the style of the javascript files
				jshint : {
					options : {
						curly : true,
						eqeqeq : true,
						unused : true,
						bitwise : true,
						forin : true,
						freeze : true,
						undef : true,
						strict : true,
						globals : {
							window : true,
							document : true,
							d3 : true,
							jQuery : true,
							topojson : true,
							moment : true,
							SignaturePad : true,
							angular : true,
							Modernizr : true,
							deferredBootstrapper : true
						}
					},
					prod : {
						src : [ '<%= concat.js.dest %>' ]
					},
					dev : {
						options : {
							globals : {
								// console is allowed in dev mode
								console : true,
								window : true,
								document : true,
								d3 : true,
								jQuery : true,
								topojson : true,
								moment : true,
								SignaturePad : true,
								angular : true,
								Modernizr : true,
								deferredBootstrapper : true
							}
						},
						src : [ '<%= concat.js.dest %>' ]
					},
					gruntfile : {
						options : {
							strict : true,
							globals : {
								require : true,
								module : true
							}
						},
						src : [ 'Gruntfile.js' ]
					}
				},

				// compiles the sass code to css code
				sass : {
					dist : {
						files : [ {
							expand : true,
							cwd : 'src/sass',
							src : [ '*.{scss,sass}' ],
							dest : 'tmp/css',
							ext : '.css'
						} ]
					}
				},

				// copies the specified files
				copy : {
					html : {
						expand : true,
						cwd : 'src/html/',
						src : [ '**/*.html' ],
						dest : 'build/'
					},
					languages : {
						expand : true,
						flatten : true,
						src : [ 'src/languages/**/*.json' ],
						dest : 'build/languages/'
					}
				},

				// adds some necessary css prefixes like -webkit-
				autoprefixer : {
					options : {
						browsers : '> 2% in CH'
					},
					css : {
						src : 'build/client.css'
					}
				},

				// minifies and renames the javascript code for best space usage
				uglify : {
					dist : {
						files : {
							'build/client.min.js' : 'build/client.js'
						}
					}
				},

				// minifies the css code
				cssmin : {
					options : {
						keepSpecialComments : 0
					},
					target : {
						files : {
							'build/client.min.css' : 'build/client.css'
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

				// process, which monitors all source files and recompiles after
				// a change
				watch : {
					options : {
						livereload : true
					},
					all : {
						files : [ 'src/**/*.*' ],
						tasks : [ 'default' ]
					}
				},

				// starts a server and deploys the specified files
				connect : {
					dist : {
						options : {
							port : 9005,
							base : '',
							open : 'http://<%= connect.dist.options.hostname %>:<%= connect.dist.options.port %>/build',
							hostname : 'localhost',
							livereload : true
						}
					}
				}

			});

	// the default process, which can be started by calling "grunt"
	grunt.registerTask('default', [ 'bower:install', 'clean', 'concat:js',
			'jshint:gruntfile', 'jshint:dev', 'sass', 'concat:css',
			'autoprefixer', 'copy:html', 'copy:languages', 'clean:tmp' ]);

	// the productive process, which also minifies. it can be started by calling
	// "grunt prod"
	grunt
			.registerTask('prod', [ 'default', 'jshint:prod', 'uglify',
					'cssmin' ]);

	// starts a server instance with live deployment. it can be started by
	// calling "grunt serve"
	grunt.registerTask('serve', [ 'default', 'connect', 'watch' ]);

};
