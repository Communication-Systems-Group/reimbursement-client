(function initializeLanguagesBeforeApplicationStart() {
	"use strict";

	window.deferredBootstrapper.bootstrap({
		element: document.body,
		module: 'reimbursement',
		resolve: {
			LANGUAGES: ['$http',
				function ($http) {
					var languagePath = "/" + jQuery("#languagesPath").data("path");
					return $http.get(languagePath);
				}],
			USER: ['$q', '$http',
				function($q, $http) {
					var deferred = $q.defer();
					var host = window.location.protocol + "//" + window.location.host.split(':')[0];

					$http.get(host + "/api/user", {withCredentials: true}).then(
						function (response) {
							var data = response.data;
							data.loggedIn = true;
							data.hasRole = function(role) {
								return data.roles.indexOf(role) !== -1;
							};
							deferred.resolve(data);

						}, function () {
							var data = {
								loggedIn: false,
								language: 'DE',
								hasSignature: false,
								roles: [],
								hasRole: function() {
									return false;
								}
							};
							deferred.resolve(data);
						});

					return deferred.promise;
				}
			]
		}
	});
})();

var app = angular.module('reimbursement', ['reimbursement.templates', 'ngAnimate', 'ui.router', 'ui.bootstrap', 'pascalprecht.translate', 'monospaced.qrcode', 'flow']);

app.constant("Modernizr", window.Modernizr);
app.constant("moment", window.moment);
app.constant("c3", window.c3);
app.constant("HOST", window.location.protocol + "//" + window.location.host.split(":")[0]);
app.constant("THIS_HOST", window.location.protocol + "//" + window.location.host + "/#!");

app.config(['$stateProvider', '$urlRouterProvider', '$translateProvider', '$locationProvider', '$httpProvider', 'LANGUAGES', 'USER', 'flowFactoryProvider',
	function ($stateProvider, $urlRouterProvider, $translateProvider, $locationProvider, $httpProvider, LANGUAGES, USER, flowFactoryProvider) {
		"use strict";

		for (var key in LANGUAGES) {
			if (LANGUAGES.hasOwnProperty(key)) {
				$translateProvider.translations(key, LANGUAGES[key]);
			}
		}

		$translateProvider.preferredLanguage(USER.language.toLowerCase());
		$translateProvider.useSanitizeValueStrategy('escape');

		$httpProvider.defaults.withCredentials = true;
		$httpProvider.interceptors.push('httpInterceptor');

		function requireRegisteredAuthentication() {
			return ['$state', 'USER', function ($state, USER) {
				if (!USER.loggedIn) {
					$state.go('login');
				}
				if (!USER.hasRole("REGISTERED_USER")) {
					$state.go('registrationForm');
				}
			}];
		}

		function requireUnregisteredAuthentication() {
			return ['$state', 'USER', function ($state, USER) {
				if (!USER.loggedIn) {
					$state.go('login');
				}
				if(USER.hasRole("REGISTERED_USER")) {
					$state.go('dashboard');
				}
			}];
		}

		function requireRegisteredAuthenticationWithAnyRole(roles) {
			return ['$state', 'USER', function ($state, USER) {
				if (!USER.loggedIn) {
					$state.go('login');
				}
				if (!USER.hasRole("REGISTERED_USER")) {
					$state.go('registrationForm');
				}

				var hasSufficientRights = false;
				for (var i=0; i<roles.length; i++) {
					if (USER.hasRole(roles[i])) {
						hasSufficientRights = true;
						break;
					}
				}

				if(!hasSufficientRights) {
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

		}).state('registrationForm', {
			templateUrl: "registration/registration-form.tpl.html",
			controller: "RegistrationFormController",
			onEnter: requireUnregisteredAuthentication()

		}).state('registrationSignature', {
			templateUrl: "registration/registration-signature.tpl.html",
			controller: "RegistrationSignatureController",
			onEnter: requireUnregisteredAuthentication()

		}).state('registrationCropping', {
			params: {
				imageUri: null
			},
			templateUrl: "registration/registration-cropping.tpl.html",
			controller: "RegistrationCroppingController",
			onEnter: requireUnregisteredAuthentication()

		}).state('settingsSignature', {
			url: "/settingsSignature",
			templateUrl: "settings/settings-signature.tpl.html",
			controller: "SettingsSignatureController",
			onEnter: requireRegisteredAuthentication()

		}).state('settingsCropping', {
			params: {
				imageUri: null
			},
			templateUrl: "settings/settings-cropping.tpl.html",
			controller: "SettingsCroppingController",
			onEnter: requireRegisteredAuthentication()

		}).state('signatureMobile', {
			url: "/signature-mobile/:token",
			templateUrl: "signature/signature-mobile.tpl.html",
			controller: "SignatureMobileController"

		}).state('attachmentMobile', {
			url: "/attachment-mobile/:token",
			templateUrl: "attachment/attachment-mobile.tpl.html",
			controller: "AttachmentMobileController"

		}).state('view-cost-category', {
			url: "/view-cost-category",
			templateUrl: "administration/view-cost-category.tpl.html",
			controller: "ViewCostCategoryController",
			onEnter: requireRegisteredAuthenticationWithAnyRole(['FINANCE_ADMIN'])

		}).state('admin-pool-search', {
			url: "/admin-pool-search",
			templateUrl: "administration/admin-pool-search.tpl.html",
			controller: "AdminPoolSearchController",
			onEnter: requireRegisteredAuthenticationWithAnyRole(['FINANCE_ADMIN'])

		}).state('admin-pool-graphs', {
			url: "/admin-pool-graphs",
			templateUrl: "administration/admin-pool-graphs.tpl.html",
			controller: "AdminPoolGraphsController",
			onEnter: requireRegisteredAuthenticationWithAnyRole(['FINANCE_ADMIN'])

		}).state('archive', {
			url: "/archive",
			templateUrl: "archive/archive.tpl.html",
			controller: 'ArchiveController',
			onEnter: requireRegisteredAuthentication()

		}).state('settings', {
			url: "/settings",
			templateUrl: "settings/settings.tpl.html",
			controller: 'SettingsController',
			onEnter: requireRegisteredAuthentication()

		}).state('dashboard', {
			url: "/dashboard",
			templateUrl: "dashboard/dashboard.tpl.html",
			controller: "DashboardController",
			onEnter: requireRegisteredAuthentication()

		}).state('create-expense', {
			url: "/create-expense/:uid",
			templateUrl: "expense/create-expense.tpl.html",
			controller: "CreateExpenseController",
			onEnter: requireRegisteredAuthentication()

		}).state('edit-expense', {
			url: "/edit-expense/:uid",
			templateUrl: "expense/create-expense.tpl.html",
			controller: "CreateExpenseController",
			onEnter: requireRegisteredAuthentication()

		}).state('view-expense', {
			url: "/view-expense/:uid",
			templateUrl: "expense/view-expense.tpl.html",
			controller: "ViewExpenseController",
			onEnter: requireRegisteredAuthentication()

		}).state('print-expense', {
			url: "/print-expense/:uid",
			templateUrl: "expense/print-expense.tpl.html",
			controller: "PrintExpenseController",
			onEnter: requireRegisteredAuthentication()

		}).state('review-expense', {
			url: "/review-expense/:uid",
			templateUrl: "expense/review-expense.tpl.html",
			controller: "ReviewExpenseController",
			onEnter: requireRegisteredAuthenticationWithAnyRole(['PROF', 'FINANCE_ADMIN'])

		}).state('sign-expense', {
			url: "/sign-expense/:uid",
			templateUrl: "expense/sign-expense.tpl.html",
			controller: "SignExpenseController",
			onEnter: requireRegisteredAuthentication()

		}).state('guest-view-expense', {
			url: "/guest-view-expense/:token",
			templateUrl: "expense/guest-view-expense.tpl.html",
			controller: "GuestViewExpenseController"

		}).state('testingPage', {
			url: "/testingPage",
			templateUrl: "testingPage/testingPage.tpl.html",
			controller: 'TestingPageController'

		});
		$urlRouterProvider.otherwise('/dashboard');

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
