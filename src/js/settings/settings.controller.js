app.controller('SettingsController', ['$scope', '$state', '$timeout', 'settingsRestService', 'USER', 'globalMessagesService', 'signatureRestService', 'base64BinaryConverterService',

function($scope, $state, $timeout, settingsRestService, USER, globalMessagesService, signatureRestService, base64BinaryConverterService) {
	'use strict';
	$scope.languages = [];

	settingsRestService.getSupportedLanguages().then(function(response) {
		$scope.languages = response.data;
		$timeout(function() {
			$scope.selectedLanguage = USER.language;
		});
	});
	$scope.saveLanguage = function() {
		settingsRestService.putLanguage($scope.selectedLanguage).then(function() {
			globalMessagesService.showInfo('reimbursement.settings.language.submitInfoTitle', 'reimbursement.settings.language.submitInfoMessage');
		});
	};
	$scope.newSignature = function() {
		globalMessagesService.confirmWarning('reimbursement.settings.signature.submitWarningTitle', 'reimbursement.settings.signature.submitWarningMessage').then(function() {
			$state.go('signature');
		});
	};
	signatureRestService.getSignature().then(function(response) {
		$scope.signatureImage = base64BinaryConverterService.toBase64FromJson(response.data);
	});
}]);
