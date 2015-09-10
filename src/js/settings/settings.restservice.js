app.factory('settingsRestService', ['$http', 'HOST',

function($http, HOST) {
	"use strict";

	function getSupportedLanguages() {
		return $http({
			method: 'GET',
			url: HOST + '/api/public/languages'
		});
	}

	function putLanguage(language) {
	return $http({
		method: 'PUT',
		url: HOST + '/api/user/language',
		data: {
			language: language
		}
	});
	}

	return {
		getSupportedLanguages: getSupportedLanguages,
		putLanguage: putLanguage

	};
}]);
