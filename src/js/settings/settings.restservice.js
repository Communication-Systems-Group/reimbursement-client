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
			url: HOST + '/api/user/settings/language',
			params: {
				language: language
			}
		});
	}

	function putPersonnelNumber(personnelNumber) {
		return $http({
			method: 'PUT',
			url: HOST + '/api/user/settings/personnel-number',
			params: {
				personnelNumber: personnelNumber
			}
		});
	}

	function putPhoneNumber(phoneNumber) {
		return $http({
			method: 'PUT',
			url: HOST + '/api/user/settings/phone-number',
			params: {
				phoneNumber: phoneNumber
			}
		});
	}

	function putIsActive(isActive) {
		return $http({
			method: 'PUT',
			url: HOST + '/api/user/settings/is-active',
			params: {
				isActive: isActive
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
		putPersonnelNumber: putPersonnelNumber,
		putPhoneNumber: putPhoneNumber,
		putIsActive: putIsActive,
		getSignature: getSignature
	};
}]);
