app.factory('settingsRestService', ['$http', 'HOST',

function($http, HOST) {
	"use strict";

	function getSupportedLanguages() {
		return $http({
			method: 'GET',
			url: HOST + '/api/public/languages'
		});
	}

	function putSettings(language, personnelNumber, phoneNumber, active) {
		return $http({
			method: 'PUT',
			url: HOST + '/api/user/settings',
			data: {
				language: language,
				personnelNumber: personnelNumber,
				phoneNumber: phoneNumber,
				active: active
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
		putSettings: putSettings,
		getSignature: getSignature
	};
}]);
