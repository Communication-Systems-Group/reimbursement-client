module.exports = function(grunt) {
	"use strict";

	//TODO if it is sure that the localdeploy task is not used anymore (after mid Junde weeks or so^^ ) - remove it.

	// initializes all grunt tasks, no need to load every task by itself
	require('load-grunt-tasks')(grunt);

	// create some nice statistics for time consumation of every task
	require('time-grunt')(grunt);

	grunt.initConfig({

		// reads the package.json and provide e.g. the package name
		pkg: grunt.file.readJSON('package.json'),

		// be aware to not store credentials in a public git repository!
		secret: grunt.file.readJSON('secret.json'),

		compress: {
			main: {
				options: {
					archive: 'public/archive.tar'
				},
				files: [{
						// includes files in path
						src: ['dist/*'],
						dest: '/',
						filter: 'isFile'
					}, {
						// flattens results to a single level
						flatten: true,
						src: ['dist/**'],
						dest: '/',
						filter: 'isFile'
					}
				]
			}
		},

		sftp: {
			upload: {
				files: {
					"./": "public/*"
				},
				options: {
					privateKey: '<%= grunt.file.read(secret.rsa_private_key) %>',
					passphrase: '<%= secret.passphrase %>',
					host: '<%= secret.host %>',
					username: '<%= secret.username %>',
					showProgress: true,
					srcBasePath: "public/",
					path: 'client',
					createDirectories: false
				}
			}
		},

		sshconfig: {
			"vm_ifi": {
				privateKey: '<%= grunt.file.read(secret.rsa_private_key) %>',
				passphrase: '<%= secret.passphrase %>',
				host: '<%= secret.host %>',
				username: '<%= secret.username %>'
			}
		},

		sshexec: {
			extract: {
				command: 'echo <%= secret.password %> | sudo -S tar -xf /home/<%= secret.username %>/client/archive.tar -C /var/www/html/client/ --strip-components=1',
				options: {
					config: 'vm_ifi'
				}
			},

			clean: {
				command: 'echo <%= secret.password %> | sudo -S rm /home/<%= secret.username %>/client/archive.tar',
				options: {
					config: 'vm_ifi'
				}
			},
			prepare: {
				command: 'echo <%= secret.password %> | sudo -S rm -rf /var/www/html/client && echo <%= secret.password %> | sudo -S mkdir /var/www/html/client',
				options: {
					config: 'vm_ifi'
				}
			}
		},

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
			regular: {
				files: [{
					//fonts
					expand: true,
					flatten: true,
					src: ['bower_components/font-awesome/fonts/*.*'],
					dest: 'dist/fonts/'
				}, {
					//images
					expand: true,
					flatten: true,
					src: ['bower_components/jcrop/css/*.gif'],
					dest: 'dist/styles/'
				}, {
					//index.html
					expand: true,
					cwd: 'src/html/',
					src: ['index.html'],
					dest: 'dist/'
				}, {
					//languages
					expand: true,
					flatten: true,
					src: ['src/languages/**/*.json'],
					dest: 'dist/languages/'
				}]
			},
			localdeploy: {
				files: [{
					cwd: 'dist',
					src: '**/*',
					dest: '../reimbursement-server/src/main/webapp/static/',
					expand: true
				}]
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

		// process, which monitors all source files and recompiles after a change
		watch: {
			options: {
				livereload: true
			},
			dev: {
				files: ['src/**/*.*'],
				tasks: ['default-no-bower']
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

	grunt.registerTask('default-no-bower', [
		'clean',
		'sass',
		'useminPrepare',
		'concat:generated',
		'jshint:gruntfile',
		'jshint:dev',
		'html2js:dev',
		'concat:appWithTemplates',
		'autoprefixer',
		'copy:regular',
		'usemin',
		'clean:tmp'
	]);

	// the default process, which can be started by calling "grunt"
	// PROD SHOULD BE VERY SIMILAR!
	grunt.registerTask('default', [
		'bower:install',
		'default-no-bower'
	]);

	// the productive process, which also minifies. it can be started by calling "grunt prod"
	grunt.registerTask('prod', [
		'bower:install',
		'clean',
		'useminPrepare',
		'sass',
		'concat:generated',
		'jshint:gruntfile',
		'jshint:prod',
		'html2js:prod',
		'concat:appWithTemplates',
		'autoprefixer',
		'copy:regular',
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

	// deploys the application to the local reimbursement-server project
	grunt.registerTask('localdeploy', [
		'prod',
		'copy:localdeploy'
	]);

	// deploys the application to the tomcat
	grunt.registerTask('deploy', [
		'prod',
		'compress:main',
		'sftp:upload',
		'sshexec:prepare',
		'sshexec:extract',
		'sshexec:clean'
	]);

};
