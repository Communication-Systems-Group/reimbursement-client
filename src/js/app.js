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
					//var host = '//localhost:8080';
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

var app = angular.module('reimbursement', ['reimbursement.templates', 'ui.router', 'ui.bootstrap', 'pascalprecht.translate', 'monospaced.qrcode', 'flow', 'ui.utils.masks']);

app.constant("Modernizr", Modernizr);
app.constant("moment", moment);
app.constant("HOST", window.location.protocol + "//" + window.location.host.split(":")[0]);
//app.constant("HOST", "//localhost:8080");

app.config(['$stateProvider', '$urlRouterProvider', '$translateProvider', '$locationProvider', '$httpProvider', 'LANGUAGES', 'flowFactoryProvider',
	function ($stateProvider, $urlRouterProvider, $translateProvider, $locationProvider, $httpProvider, LANGUAGES, flowFactoryProvider) {
		"use strict";

		for (var key in LANGUAGES) {
			if (LANGUAGES.hasOwnProperty(key)) {
				$translateProvider.translations(key, LANGUAGES[key]);
			}
		}

		$translateProvider.preferredLanguage('de');
		$translateProvider.useSanitizeValueStrategy('escape');

		$httpProvider.defaults.withCredentials = true;
		$httpProvider.interceptors.push('httpInterceptor');

		function requireAuthentication() {
			return ['$state', 'USER', function ($state, USER) {
				if (!USER.loggedIn) {
					$state.go('login');
				}
			}];
		}

		function requireAuthenticatioWithRoles(roles) {
			return ['$state', 'USER', function ($state, USER) {
				if (!USER.loggedIn) {
					$state.go('login');
				}

				var hasInsufficientRights = false;
				for (var i=0; i<roles.length; i++) {
					if (USER.roles.indexOf(roles[i]) === -1) {
						hasInsufficientRights = true;
						break;
					}
				}

				if(hasInsufficientRights) {
					$state.go('dashboard');
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

			}).state('administration', {
				url: "/administration",
				templateUrl: "administration/administration.tpl.html",
				controller: "AdministrationController",
				onEnter: requireAuthenticatioWithRoles(['FINANCE_ADMIN'])

			}).state('attachment', {
				url: "/attachment",
				templateUrl: "attachment/attachment.tpl.html",
				controller: "AttachmentController",
				onEnter: requireAuthentication()

			}).state('attachmentMobile', {
				url: "/attachment-mobile/:token",
				templateUrl: "attachment/attachment-mobile.tpl.html",
				controller: "AttachmentMobileController"

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

			}).state('create-expense', {
				url: "/create-expense",
				templateUrl: "expense/create-expense.tpl.html",
				controller: "CreateExpenseController",
				onEnter: requireAuthentication()

			}).state('create-expense-step2', {
				url: "/create-expense-step2/:uid",
				templateUrl: "expense/create-expense-step2.tpl.html",
				controller: "CreateExpenseStep2Controller",
				onEnter: requireAuthentication()

			}).state('expense', {
				url: "/expense/:id/:isReview",
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

	$http.defaults.headers.common['X-XSRF-TOKEN'] = function () {
		return document.cookie.replace(/(?:(?:^|.*;\s*)XSRF-TOKEN\s*\=\s*([^;]*).*$)|^.*$/, "$1");
	};

}]);

app.filter('to_trusted', ['$sce', function ($sce) {
	'use strict';

	return function (text) {
		return $sce.trustAsHtml(text);
	};
}]);
