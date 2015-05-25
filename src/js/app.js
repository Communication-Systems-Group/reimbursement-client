(function initializeLanguagesBeforeApplicationStart() {
	"use strict";

	deferredBootstrapper.bootstrap({
		element : document.body,
		module : 'reimbursement',
		resolve : {
			LANGUAGES : ['$http',
			function($http) {
				return $http.get('./languages/languages.json');
			}]

		}
	});
})();

var app = angular.module('reimbursement', ['reimbursement.templates', 'ui.router', 'ui.bootstrap', 'pascalprecht.translate', 'monospaced.qrcode', 'flow', 'ui.utils.masks']);

app.constant("Modernizr", Modernizr);

app.config(['$stateProvider', '$urlRouterProvider', '$translateProvider', '$locationProvider', 'LANGUAGES',
function($stateProvider, $urlRouterProvider, $translateProvider, $locationProvider, LANGUAGES) {
	"use strict";

	for (var key in LANGUAGES) {
		if (LANGUAGES.hasOwnProperty(key)) {
			$translateProvider.translations(key, LANGUAGES[key]);
		}
	}
	$translateProvider.preferredLanguage('en');

	$stateProvider.state('login', {
		url : "/login",
		templateUrl : "login/login.tpl.html",
		controller : 'LoginController'

	}).state('signature', {
		url : "/signature",
		templateUrl : "signature/signature.tpl.html",
		controller : "SignatureController"

	}).state('cropping', {
		url : "/cropping",
		params : {
			imageUri : null
		},
		templateUrl : "cropping/cropping.tpl.html",
		controller : "CroppingController"

	}).state('dashboard', {
		url : "/dashboard",
		templateUrl : "dashboard/dashboard.tpl.html",
		controller : "DashboardController"

	}).state('expense', {
		url : "/expense/:id",
		templateUrl : "expense/expense.tpl.html",
		controller : "ExpenseController"

	}).state('csrfTestingPage', {
		url : "/csrfTestingPage",
		templateUrl : "csrfTestingPage/csrfTestingPage.tpl.html",
		controller : 'CsrfTestingPageController'
	});

	$urlRouterProvider.otherwise('/signature');

	$locationProvider.hashPrefix("!");

}]);
