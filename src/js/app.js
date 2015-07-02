(function initializeLanguagesBeforeApplicationStart() {
	"use strict";

	deferredBootstrapper.bootstrap({
		element: document.body,
		module: 'reimbursement',
		resolve: {
			LANGUAGES: ['$http',
				function ($http) {
					return $http.get('/languages/languages.json');
				}],
			USER: ['$q', '$http',
				function ($q, $http) {
					var deferred = $q.defer();
					var host = window.location.protocol + "//" + window.location.host.split(':')[0];
					$http.get(host + "/api/user", {withCredentials: true}).then(
						function (response) {
							var data = response.data;
							data.loggedIn = true;
							deferred.resolve(data);
						}, function () {
							var data = {loggedIn: false};
							deferred.resolve(data);
						});
					return deferred.promise;
				}]
		}
	});
})();


var app = angular.module('reimbursement', ['reimbursement.templates', 'ui.router', 'ui.bootstrap', 'pascalprecht.translate', 'monospaced.qrcode', 'flow', 'ui.utils.masks', 'mgcrea.ngStrap.datepicker']);

app.constant("Modernizr", Modernizr);
app.constant("HOST", window.location.protocol + "//" + window.location.host.split(":")[0]);

app.config(['$stateProvider', '$urlRouterProvider', '$translateProvider', '$locationProvider', '$httpProvider', 'LANGUAGES', 'flowFactoryProvider',
	function ($stateProvider, $urlRouterProvider, $translateProvider, $locationProvider, $httpProvider, LANGUAGES, flowFactoryProvider) {
		"use strict";

		for (var key in LANGUAGES) {
			if (LANGUAGES.hasOwnProperty(key)) {
				$translateProvider.translations(key, LANGUAGES[key]);
			}
		}
		$translateProvider.preferredLanguage('en');
		$translateProvider.useSanitizeValueStrategy('escape');

		$httpProvider.defaults.withCredentials = true;

		function requireAuthentication() {
			return ['$state', 'USER', function ($state, USER) {
				if (!USER.loggedIn) {
					$state.go('login');
				}
			}];
		}

		$stateProvider.state('login', {
			// no url, because the login should not be opened manually
			templateUrl: "login/login.tpl.html",
			controller: 'LoginController'

		}).state('logout', {
				// no url, because the logout should not be opened manually
				templateUrl: "logout/logout.tpl.html",
				controller: 'LogoutController'

			}).state('signature', {
				url: "/signature",
				templateUrl: "signature/signature.tpl.html",
				controller: "SignatureController",
				onEnter: requireAuthentication()

			}).state('signatureMobile', {
				url: "/signature-mobile/:token",
				templateUrl: "signature/signature-mobile.tpl.html",
				controller: "SignatureMobileController"

			}).state('cropping', {
				// no url, because the cropping should not be opened manually
				params: {
					imageUri: null
				},
				templateUrl: "cropping/cropping.tpl.html",
				controller: "CroppingController",
				onEnter: requireAuthentication()

			}).state('dashboard', {
				url: "/dashboard",
				templateUrl: "dashboard/dashboard.tpl.html",
				controller: "DashboardController",
				onEnter: requireAuthentication()

			}).state('expense', {
				url: "/expense/:id",
				templateUrl: "expense/expense.tpl.html",
				controller: "ExpenseController",
				onEnter: requireAuthentication()

			}).state('newExpense', {
				url: "/expense",
				templateUrl: "expense/expense.tpl.html",
				controller: "ExpenseController",
				onEnter: requireAuthentication()

			}).state('testingPage', {
				url: "/testingPage",
				templateUrl: "testingPage/testingPage.tpl.html",
				controller: 'TestingPageController'
			});

		$urlRouterProvider.otherwise('/signature');

		$locationProvider.hashPrefix("!");

		// ng-Flow flow.js configuration
		flowFactoryProvider.defaults = {
			headers: function () {
				return {
					'X-XSRF-TOKEN': document.cookie.replace(/(?:(?:^|.*;\s*)XSRF-TOKEN\s*\=\s*([^;]*).*$)|^.*$/, "$1")
				};
			},
			withCredentials: true
		};

	}]);

app.run(['$http', function ($http) {
	'use strict';

	$http.defaults.headers.post['X-XSRF-TOKEN'] = function () {
		return document.cookie.replace(/(?:(?:^|.*;\s*)XSRF-TOKEN\s*\=\s*([^;]*).*$)|^.*$/, "$1");
	};

}]);
