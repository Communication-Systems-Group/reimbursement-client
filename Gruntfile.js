module.exports = function (grunt) {
	"use strict";

	// initializes all grunt tasks, no need to load every task by itself
	require('load-grunt-tasks')(grunt);

	// create some nice statistics for time consumption of every task
	require('time-grunt')(grunt);

	grunt.initConfig({

		// reads the package.json and provide e.g. the package name
		pkg: grunt.file.readJSON('package.json'),

		// reads the deploy parameters username, password
		deploy: grunt.file.readJSON('deploy.json'),

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
				files: [
					{
						expand: true,
						cwd: 'src/sass',
						src: ['*.{scss,sass}'],
						dest: '.tmp/styles',
						ext: '.css'
					}
				]
			}
		},

		// copies the specified files
		copy: {
			regular: {
				files: [
					{
						//fonts
						expand: true,
						flatten: true,
						src: ['bower_components/font-awesome/fonts/*.*', 'bower_components/bootstrap/fonts/*.*'],
						dest: 'dist/fonts/'
					},
					{
						//images
						expand: true,
						flatten: true,
						src: ['bower_components/jcrop/css/*.gif'],
						dest: 'dist/styles/'
					},
					{
						//index.html
						expand: true,
						cwd: 'src/html/',
						src: ['index.html'],
						dest: 'dist/'
					}
				]
			}
		},

		// converts language.json into productive form
		convertLanguageJson: {
			json: {
				options: {
					prefix: "reimbursement."
				},
				files: [
					{
						src: 'src/languages/languages.json',
						dest: 'dist/languages/languages.json',
						destType: 'file'
					}
				]
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
				keepSpecialComments: 0
			},
			target: {
				files: {
					'dist/styles/app.css': 'dist/styles/app.css',
					'dist/styles/libraries.css': 'dist/styles/libraries.css'
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

		// concats only the app.js with templates.js (from html2js)
		concat: {
			appWithTemplates: {
				files: {
					'dist/javascript/app.js': ['.tmp/concat/templates.js', 'dist/javascript/app.js']
				}
			}
		},

		// converts all the html files to one single js template file
		html2js: {
			options: {
				base: 'src/html/templates/',
				module: 'reimbursement.templates',
				quoteChar: '\''
			},
			dev: {
				src: [ 'src/html/templates/**/*.tpl.html' ],
				dest: '.tmp/concat/templates.js'
			},
			prod: {
				options: {
					htmlmin: {
						collapseBooleanAttributes: true,
						collapseWhitespace: true,
						conservativeCollapse: true,
						removeComments: true
					}
				},
				src: [ 'src/html/templates/**/*.tpl.html' ],
				dest: '.tmp/concat/templates.js'
			}
		},

		war: {
			target: {
				options: {
					war_dist_folder: 'dist',
					war_name: 'reimbursement-frontend',
					webxml_welcome: 'index.html',
					webxml_display_name: 'Reimbursement Front-End'
				},
				files: [
					{
						expand: true,
						cwd: 'dist',
						src: ['**'],
						dest: ''
					}
				]
			}
		},

		// upload the built war file
		http_upload: {
			deploy: {
				options: {
					url: 'http://<%=deploy.username%>:<%=deploy.password%>@192.41.136.228/manager/text/deploy?path=&update=true',
					method: 'PUT',
					rejectUnauthorized: true
				},
				src: 'dist/reimbursement-frontend.war',
				dest: 'reimbursement-frontend'
			}
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

	// the default grunt task, just call "grunt" and it will be executed
	grunt.registerTask('default', [
		'clean',
		'sass',
		'useminPrepare',
		'concat:generated',
		'jshint:gruntfile',
		'jshint:dev',
		'html2js:dev',
		'concat:appWithTemplates',
		'autoprefixer',
		'copy',
		'convertLanguageJson',
		'usemin',
		'clean:tmp'
	]);

	// the productive process, which also minifies. it can be started by calling "grunt prod"
	grunt.registerTask('prod', [
		'clean',
		'sass',
		'useminPrepare',
		'concat:generated',
		'jshint:gruntfile',
		'jshint:prod',
		'html2js:prod',
		'concat:appWithTemplates',
		'autoprefixer',
		'copy',
		'convertLanguageJson',
		'usemin',
		'uglify',
		'cssmin',
		'clean:tmp'
	]);

	// starts a server instance with live deployment. it can be started by calling "grunt serve"
	grunt.registerTask('serve', [
		'default',
		'connect',
		'watch:dev'
	]);

	// starts a server instance with live deployment. it always takes the minified and uglified resources.
	grunt.registerTask('prod-serve', [
		'prod',
		'connect',
		'watch:prod'
	]);

	// deploys the application to the tomcat
	grunt.registerTask('deploy', [
		'prod',
		'war',
		'http_upload'
	]);
};
