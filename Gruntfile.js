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
					app: true,
					window: true,
					document: true,
					jQuery: true,
					angular: true,
					Uint8Array: false,
					ArrayBuffer: false
				}
			},
			prod: {
				src: ['src/js/**/*.js']
			},
			dev: {
				options: {
					globals: {
						// console is allowed in dev mode
						app: true,
						console: true,
						window: true,
						document: true,
						jQuery: true,
						angular: true,
						Uint8Array: false,
						ArrayBuffer: false
					}
				},
				src: ['src/js/**/*.js']
			},
			gruntfile: {
				options: {
					strict: true,
					globals: {
						require: true,
						module: true,
						Uint8Array: false,
						ArrayBuffer: false
					}
				},
				src: ['Gruntfile.js']
			}
		},

		jscs: {
			final: {
				options: {
					disallowArrowFunctions: true,
					disallowEmptyBlocks: true,
					disallowIdentifierNames: ['temp', 'foo', 'bar'],
					disallowMixedSpacesAndTabs: true,
					disallowMultiLineTernary: true,
					disallowMultipleLineBreaks: true,
					disallowMultipleLineStrings: true,
					disallowMultipleSpaces: true,
					disallowNestedTernaries: true,
					disallowNewlineBeforeBlockStatements: true,
					disallowOperatorBeforeLineBreak: ["+", "."],
					disallowSpaceAfterObjectKeys: true,
					disallowSpaceBeforeComma: true,
					disallowSpaceBeforeSemicolon: true,
					disallowSpacesInCallExpression: true,
					disallowTrailingComma: true,
					disallowTrailingWhitespace: true,
					disallowUnusedParams: true,
					disallowYodaConditions: true,
					requireBlocksOnNewline: true,
					requireCamelCaseOrUpperCaseIdentifiers: true,
					requireCommaBeforeLineBreak: true,
					requireCurlyBraces: true,
					requireKeywordsOnNewLine: ["else"],
					requireLineBreakAfterVariableAssignment: true,
					requireMatchingFunctionName: true,
					requirePaddingNewLinesAfterUseStrict: true,
					requireParenthesesAroundIIFE: true,
					requireSemicolons: true,
					requireSpaceAfterBinaryOperators: true,
					requireSpaceAfterComma: true,
					requireSpaceAfterLineComment: true,
					requireSpaceBeforeBinaryOperators: true,
					requireSpaceBeforeBlockStatements: true,
					requireSpaceBeforeObjectValues: true,
					requireSpaceBetweenArguments: true,
					requireSpacesInConditionalExpression: true,
					requireSpacesInForStatement: true,
					requireSpacesInsideObjectBrackets: "all",
					validateParameterSeparator: ", ",
					validateIndentation: "\t"
				},
				files: {
					src: ['src/js/**/*.js']
				}
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
					// fonts
					expand: true,
					flatten: true,
					src: ['bower_components/font-awesome/fonts/*.*', 'bower_components/bootstrap/fonts/*.*'],
					dest: 'dist/fonts/'
				}, {
					// images
					expand: true,
					flatten: true,
					src: ['bower_components/jcrop/css/*.gif', 'src/images/*'],
					dest: 'dist/styles/'
				}, {
					// index.html
					expand: true,
					cwd: 'src/html/',
					src: ['index.html'],
					dest: 'dist/'
				}]
			}
		},

		// converts language.json into productive form
		convertLanguageJson: {
			json: {
				options: {
					prefix: "reimbursement."
				},
				files: [{
					src: 'src/languages/languages.json',
					dest: 'dist/languages/languages.json',
					destType: 'file'
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

		filerev: {
			options: {
				algorithm: 'md5',
				length: 25
			},
			dist: {
				files: [{
					src: [
						'dist/languages/*.json',
						'dist/javascript/*.js',
						'dist/styles/*.css'
					]
				}]
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
			html: ['dist/index.html'],
			options: {
				assetsDirs: ['dist']
			}
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

		htmlmin: {
			indexFile: {
				options: {
					collapseBooleanAttributes: true,
					collapseWhitespace: true,
					removeComments: true
					// conservative collapse is not necessary in index.html, because it contains no
					// elements styles with display: inline-block. if that changes, change this property
					/* conservativeCollapse: true */
				},
				files: {
					'dist/index.html': 'dist/index.html'
				}
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
				files: [{
					expand: true,
					cwd: 'dist',
					src: ['**'],
					dest: ''
				}]
			}
		},

		// upload the built war file
		http_upload: {
			prod: {
				options: {
					url: 'http://<%=deploy.username%>:<%=deploy.password%>@192.41.136.228/manager/text/deploy?path=&update=true',
					method: 'PUT',
					rejectUnauthorized: true
				},
				src: 'dist/reimbursement-frontend.war',
				dest: 'reimbursement-frontend'
			},
			int: {
				options: {
					url: 'http://<%=deploy.username%>:<%=deploy.password%>@192.41.136.227/manager/text/deploy?path=&update=true',
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
		'jshint:gruntfile',
		'jshint:dev',
		'jscs',
		'clean',
		'sass',
		'useminPrepare',
		'concat:generated',
		'html2js:dev',
		'concat:appWithTemplates',
		'autoprefixer',
		'copy',
		'convertLanguageJson',
		'filerev',
		'usemin',
		'clean:tmp'
	]);

	// the productive process, which also minifies. it can be started by calling "grunt prod"
	grunt.registerTask('prod', [
		'jshint:gruntfile',
		'jshint:prod',
		'jscs',
		'clean',
		'sass',
		'useminPrepare',
		'concat:generated',
		'html2js:prod',
		'concat:appWithTemplates',
		'autoprefixer',
		'copy',
		'convertLanguageJson',
		'uglify',
		'cssmin',
		'filerev',
		'usemin',
		'htmlmin',
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

	// deploys the application to the production tomcat server
	grunt.registerTask('deploy-prod', [
		'prod',
		'war',
		'http_upload:prod'
	]);
	
	// deploys the application to the integration tomcat server
	grunt.registerTask('deploy-int', [
		'prod',
		'war',
		'http_upload:int'
	]);

};
