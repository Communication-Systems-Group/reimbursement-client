(function initializeLanguagesBeforeApplicationStart() {
	"use strict";

	deferredBootstrapper.bootstrap({
		element : document.body,
		module : 'reimbursement',
		resolve : {
			LANGUAGES : ['$http',
			function($http) {
				return $http.get('/languages/languages.json');
			}]
		}
	});
})();



var app = angular.module('reimbursement', ['reimbursement.templates', 'ui.router', 'ui.bootstrap', 'pascalprecht.translate', 'monospaced.qrcode', 'flow', 'ui.utils.masks']);

app.constant("Modernizr", Modernizr);

app.config(['$stateProvider', '$urlRouterProvider', '$translateProvider', '$locationProvider', '$httpProvider','LANGUAGES','flowFactoryProvider',
	function ($stateProvider, $urlRouterProvider, $translateProvider, $locationProvider, $httpProvider, LANGUAGES, flowFactoryProvider) {
		"use strict";

		for (var key in LANGUAGES) {
			if (LANGUAGES.hasOwnProperty(key)) {
				$translateProvider.translations(key, LANGUAGES[key]);
			}
		}
		$translateProvider.preferredLanguage('en');

		$httpProvider.defaults.withCredentials = true;

		$stateProvider.state('login', {
			url: "/login",
			templateUrl: "login/login.tpl.html",
			controller: 'LoginController'

		}).state('signature', {
					url: "/signature",
					templateUrl: "signature/signature.tpl.html",
					controller: "SignatureController"

				}).state('cropping', {
					url: "/cropping",
					params: {
						imageUri: null
					},
					templateUrl: "cropping/cropping.tpl.html",
					controller: "CroppingController"

				}).state('dashboard', {
					url: "/dashboard",
					templateUrl: "dashboard/dashboard.tpl.html",
					controller: "DashboardController"

				}).state('expense', {
					url: "/expense/:id",
					templateUrl: "expense/expense.tpl.html",
					controller: "ExpenseController"

				}).state('csrfTestingPage', {
					url: "/csrfTestingPage",
					templateUrl: "csrfTestingPage/csrfTestingPage.tpl.html",
					controller: 'CsrfTestingPageController'
				});

		$urlRouterProvider.otherwise('/signature');

		$locationProvider.hashPrefix("!");

		// ng-Flow flow.js configuration
		flowFactoryProvider.defaults = {
			headers : function() {
				return {
					'X-XSRF-TOKEN' : document.cookie.replace(/(?:(?:^|.*;\s*)XSRF-TOKEN\s*\=\s*([^;]*).*$)|^.*$/, "$1")
				};
			},
			withCredentials: true
		};


	}]);

app.run(function run($http) {
	'use strict';

	//Make a first get to get the csrf Token
	$http.get('http://localhost:8080/api/user/test-uuid/');

	// For CSRF token compatibility with Spring Security via CORS
	$http.defaults.headers.post['X-XSRF-TOKEN'] = function () {
		return document.cookie.replace(/(?:(?:^|.*;\s*)XSRF-TOKEN\s*\=\s*([^;]*).*$)|^.*$/, "$1");
	};
});