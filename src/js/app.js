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

var app = angular.module('reimbursement', ['ui.router', 'ui.bootstrap', 'pascalprecht.translate', 'monospaced.qrcode', 'flow']);

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

	$stateProvider.state('signature', {
		url : "/signature",
		templateUrl : "templates/signature/signature.tpl.html",
		controller : "SignatureController"
	}).state('cropping', {
		url : "/cropping",
		params : {
			imageUri : null
		},
		templateUrl : "templates/cropping/cropping.tpl.html",
		controller : "CroppingController"
	}).state('dashboard', {
		url : "/dashboard",
		templateUrl : "templates/dashboard/dashboard.tpl.html",
		controller : "DashboardController"
	});
	$urlRouterProvider.otherwise('/signature');

	$locationProvider.hashPrefix("!");

}]);