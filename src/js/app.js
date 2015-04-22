var app = angular.module('reimbursement', [ 'ui.router', 'ui.bootstrap',
		'pascalprecht.translate', 'monospaced.qrcode' ]);

app.constant("Modernizr", Modernizr);

app.config([ '$stateProvider', '$urlRouterProvider', '$translateProvider', '$locationProvider',
		function($stateProvider, $urlRouterProvider, $translateProvider, $locationProvider) {
			"use strict";

			$translateProvider.useStaticFilesLoader({
				prefix : '/build/languages/',
				suffix : '.json'
			});
			$translateProvider.preferredLanguage('de');

			$stateProvider.state('signature', {
				url : "/signature",
				templateUrl : "templates/signature.html",
				controller : "SignatureController"
			}).state('cropping', {
				url : "/cropping",
				templateUrl : "templates/cropping.html",
				controller : "CroppingController"
			});

			$urlRouterProvider.otherwise('/signature');
			
			$locationProvider.hashPrefix("!");
		}

]);
