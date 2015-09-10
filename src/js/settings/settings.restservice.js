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

	function getSignature() {
		return $http({
			method: 'GET',
			url: HOST + '/api/user/signature'
		});
	}

	return {
		getSupportedLanguages: getSupportedLanguages,
		putLanguage: putLanguage,
		getSignature: getSignature
	};
}]);
