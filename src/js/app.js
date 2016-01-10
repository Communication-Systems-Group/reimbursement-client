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
				}
			],
			VALIDATIONS: ['$http',
				function ($http) {
					var host = window.location.protocol + "//" + window.location.host.split(':')[0];
					return $http.get(host + "/api/public/validations", { withCredentials: true });
				}
			],
			USER: ['$q', '$http',
				function($q, $http) {
					var deferred = $q.defer();
					var host = window.location.protocol + "//" + window.location.host.split(':')[0];

					function hasRole(role, roles) {
						return roles.indexOf(role) !== -1;
					}

					$http.get(host + "/api/user", { withCredentials: true }).then(
						function (response) {
							var data = response.data;
							data.loggedIn = true;
							data.hasRole = function(role) {
								return hasRole(role, data.roles);
							};
							deferred.resolve(data);

						}, function () {

							var language = "DE";
							if(typeof window.navigator.language !== "undefined") {
								var browserLanguage = window.navigator.language.substr(0, 2).toUpperCase();
								if(browserLanguage === "DE" || browserLanguage === "EN") {
									language = browserLanguage;
								}
							}

							var data = {
								loggedIn: false,
								language: language,
								roles: []
							};
							data.hasRole = function(role) {
								return hasRole(role, data.roles);
							};
							deferred.resolve(data);
						});

					return deferred.promise;
				}
			]
		}
	});
})();

var app = angular.module('reimbursement', ['reimbursement.templates', 'ngAnimate', 'ui.router', 'ui.bootstrap', 'pascalprecht.translate', 'monospaced.qrcode', 'flow', 'ngCapsLock']);

app.constant("Modernizr", window.Modernizr);
app.constant("moment", window.moment);
app.constant("c3", window.c3);
app.constant("PDFSIGN", window.PDFSIGN);
app.constant("HOST", window.location.protocol + "//" + window.location.host.split(":")[0]);
app.constant("THIS_HOST", window.location.protocol + "//" + window.location.host + "/#!");
app.constant("MAX_UPLOAD_SIZE", "100000000"); // maximum chunk size of documents that will be uploaded

app.config(['$stateProvider', '$urlRouterProvider', '$translateProvider', '$locationProvider', '$httpProvider', '$compileProvider', '$logProvider', 'LANGUAGES', 'USER', 'flowFactoryProvider',
	function ($stateProvider, $urlRouterProvider, $translateProvider, $locationProvider, $httpProvider, $compileProvider, $logProvider, LANGUAGES, USER, flowFactoryProvider) {
		"use strict";

		for (var key in LANGUAGES) {
			if (LANGUAGES.hasOwnProperty(key)) {
				$translateProvider.translations(key, LANGUAGES[key]);
			}
		}

		$logProvider.debugEnabled(false);

		$translateProvider.preferredLanguage(USER.language.toLowerCase());
		$translateProvider.useSanitizeValueStrategy('escape');

		$httpProvider.defaults.withCredentials = true;
		$httpProvider.interceptors.push('httpInterceptor');

		function requireNoAuthenticationWithMessage() {
			return {
				redirectCheck: ['$q', 'USER', 'globalMessagesService', function ($q, USER, globalMessagesService) {
					if (USER.loggedIn) {
						globalMessagesService.showError("reimbursement.globalMessage.notAuthenticatedRequiredTitle",
							"reimbursement.globalMessage.notAuthenticatedRequiredMessage");

						return $q.reject({ state: 'dashboard' });
					}
				}]
			};
		}

		function requireNoAuthentication() {
			return {
				redirectCheck: ['$q', 'USER', function ($q, USER) {
					if(USER.loggedIn) {
						return $q.reject({ state: 'dashboard' });
					}
				}]
			};
		}

		function requireAuthentication() {
			return {
				redirectCheck: ['$q', 'USER', function ($q, USER) {
					if (!USER.loggedIn) {
						return $q.reject({ state: 'login' });
					}
				}]
			};
		}

		function requireRegisteredAuthentication() {
			return {
				redirectCheck: ['$q', 'USER', function ($q, USER) {
					if (!USER.loggedIn) {
						return $q.reject({ state: 'login' });
					}
					if (!USER.hasRole("REGISTERED_USER")) {
						return $q.reject({ state: 'registrationForm' });
					}
				}]
			};
		}

		function requireUnregisteredAuthentication() {
			return {
				redirectCheck: ['$q', 'USER', function ($q, USER) {
					if (!USER.loggedIn) {
						return $q.reject({ state: 'login' });
					}
					if(USER.hasRole("REGISTERED_USER")) {
						return $q.reject({ state: 'dashboard' });
					}
				}]
			};
		}

		function requireRegisteredAuthenticationWithAnyRole(roles) {
			return {
				redirectCheck: ['$q', 'USER', function ($q, USER) {
					if (!USER.loggedIn) {
						return $q.reject({ state: 'login' });
					}
					if (!USER.hasRole("REGISTERED_USER")) {
						return $q.reject({ state: 'registrationForm' });
					}

					var hasSufficientRights = false;
					for (var i = 0; i < roles.length; i++) {
						if (USER.hasRole(roles[i])) {
							hasSufficientRights = true;
							break;
						}
					}

					if(!hasSufficientRights) {
						return $q.reject({ state: 'dashboard' });
					}
				}]
			};
		}

		$stateProvider.state('login', {
			templateUrl: "login/login.tpl.html",
			controller: 'LoginController',
			resolve: requireNoAuthentication()

		}).state('logout', {
			templateUrl: "logout/logout.tpl.html",
			controller: 'LogoutController',
			resolve: requireAuthentication()

		}).state('registrationForm', {
			url: "/registration",
			templateUrl: "registration/registration-form.tpl.html",
			controller: "RegistrationFormController",
			resolve: requireUnregisteredAuthentication()

		}).state('registrationSignature', {
			templateUrl: "registration/registration-signature.tpl.html",
			controller: "RegistrationSignatureController",
			resolve: requireUnregisteredAuthentication()

		}).state('registrationCropping', {
			params: {
				imageUri: null
			},
			templateUrl: "registration/registration-cropping.tpl.html",
			controller: "RegistrationCroppingController",
			resolve: requireUnregisteredAuthentication()

		}).state('settingsSignature', {
			url: "/settingsSignature",
			templateUrl: "settings/settings-signature.tpl.html",
			controller: "SettingsSignatureController",
			resolve: requireRegisteredAuthentication()

		}).state('settingsCropping', {
			templateUrl: "settings/settings-cropping.tpl.html",
			controller: "SettingsCroppingController",
			resolve: requireRegisteredAuthentication(),
			params: { imageUri: null }

		}).state('signatureMobile', {
			url: "/signature-mobile/:token",
			templateUrl: "signature/signature-mobile.tpl.html",
			controller: "SignatureMobileController",
			resolve: requireNoAuthenticationWithMessage()

		}).state('attachmentMobile', {
			url: "/attachment-mobile/:token",
			templateUrl: "attachment/attachment-mobile.tpl.html",
			controller: "AttachmentMobileController",
			resolve: requireNoAuthenticationWithMessage()

		}).state('view-cost-category', {
			url: "/view-cost-category",
			templateUrl: "administration/view-cost-category.tpl.html",
			controller: "ViewCostCategoryController",
			resolve: requireRegisteredAuthenticationWithAnyRole(['FINANCE_ADMIN'])

		}).state('admin-pool-search', {
			url: "/admin-pool-search",
			templateUrl: "administration/admin-pool-search.tpl.html",
			controller: "AdminPoolSearchController",
			resolve: requireRegisteredAuthenticationWithAnyRole(['FINANCE_ADMIN'])

		}).state('admin-pool-graphs', {
			url: "/admin-pool-graphs",
			templateUrl: "administration/admin-pool-graphs.tpl.html",
			controller: "AdminPoolGraphsController",
			resolve: requireRegisteredAuthenticationWithAnyRole(['FINANCE_ADMIN'])

		}).state('archive', {
			url: "/archive",
			templateUrl: "archive/archive.tpl.html",
			controller: 'ArchiveController',
			resolve: requireRegisteredAuthentication()

		}).state('settings', {
			url: "/settings",
			templateUrl: "settings/settings.tpl.html",
			controller: 'SettingsController',
			resolve: requireRegisteredAuthentication()

		}).state('dashboard', {
			url: "/dashboard",
			templateUrl: "dashboard/dashboard.tpl.html",
			controller: "DashboardController",
			resolve: requireRegisteredAuthentication()

		}).state('expense', {
			url: "/expense/:uid",
			templateUrl: "expense/expense-redirect.tpl.html",
			controller: "ExpenseRedirectController",
			resolve: requireRegisteredAuthentication()

		}).state('guest-expense', {
			url: "/expense/guest/:token",
			templateUrl: "expense/guest-expense.tpl.html",
			controller: "GuestExpenseController",
			resolve: requireNoAuthenticationWithMessage()

		}).state('edit-expense', {
			templateUrl: "expense/edit-expense.tpl.html",
			controller: "EditExpenseController",
			// no access-control required, because direct access not desired
			params: { expense: null }

		}).state('view-expense', {
			templateUrl: "expense/view-expense.tpl.html",
			controller: "ViewExpenseController",
			// no access-control required, because direct access not desired
			params: { expense: null }

		}).state('print-expense', {
			templateUrl: "expense/print-expense.tpl.html",
			controller: "PrintExpenseController",
			// no access-control required, because direct access not desired
			params: { expense: null }

		}).state('review-expense', {
			templateUrl: "expense/review-expense.tpl.html",
			controller: "ReviewExpenseController",
			// no access-control required, because direct access not desired
			params: { expense: null }

		}).state('sign-expense', {
			templateUrl: "expense/sign-expense.tpl.html",
			controller: "SignExpenseController",
			// no access-control required, because direct access not desired
			params: { expense: null }

		}).state('welcome', {
			// the welcome directive listens to this state
			url: "/welcome"

		}).state('user-guide', {
			templateUrl: "welcome/user-guide.tpl.html",
			controller: "UserGuideController",
			url: "/user-guide"
		});

		$urlRouterProvider.otherwise('/welcome');

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

		// enable data URLs
		$compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|blob|data):/);

	}]);

// reacts to a rejected state (defined above) and transitions to a new state
app.run(['$rootScope', '$state', '$log', function ($rootScope, $state, $log) {
	"use strict";

	$rootScope.$on('$stateChangeError', function (event, toState, toStateParams, fromState, fromStateParams, error) {
		if(error && error.state) {
			// important to prevent faulty behavior (rejection and redirect to previous page)
			event.preventDefault();

			$log.info('Redirected to: "' + error.state + '"');
			$state.targetStateBeforeRedirect = toState.name;
			$state.targetStateParamsBeforeRedirect = toStateParams;

			return $state.go(error.state, error.stateParams, error.stateOptions);
		}
	});
}]);

app.run(['$http', function ($http) {
	'use strict';

	$http.defaults.headers.common['X-XSRF-TOKEN'] = function () {
		return document.cookie.replace(/(?:(?:^|.*;\s*)XSRF-TOKEN\s*\=\s*([^;]*).*$)|^.*$/, "$1");
	};

}]);
