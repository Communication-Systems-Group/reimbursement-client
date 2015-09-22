app.controller('SettingsController', ['$scope', '$state', '$timeout', '$translate', 'settingsRestService', 'USER', 'globalMessagesService', 'base64BinaryConverterService',

function($scope, $state, $timeout, $translate, settingsRestService, USER, globalMessagesService, base64BinaryConverterService) {
	'use strict';
	$scope.languages = [];
	$scope.personnelNumber = USER.personnelNumber;
	$scope.phoneNumber = USER.phoneNumber;
	$scope.active = USER.active;

	settingsRestService.getSupportedLanguages().then(function(response) {
		$scope.languages = response.data;
		$timeout(function() {
			$scope.selectedLanguage = USER.language;
		});
	});
	$scope.saveSettings = function() {
		settingsRestService.putSettings($scope.selectedLanguage, $scope.personnelNumber, $scope.phoneNumber, $scope.active).then(function() {
			USER.active = $scope.active;
			USER.personnelNumber = $scope.personnelNumber;
			USER.phoneNumber = $scope.phoneNumber;
			USER.language = $scope.selectedLanguage;
			$translate.use($scope.selectedLanguage.toLowerCase());
			globalMessagesService.showInfo('reimbursement.settings.user.submitInfoTitle',
				'reimbursement.settings.user.submitInfoMessage');
		});
	};
	$scope.newSignature = function() {
		globalMessagesService.confirmWarning('reimbursement.settings.signature.submitWarningTitle',
			'reimbursement.settings.signature.submitWarningMessage').then(function() {

			$state.go('signature');
		});
	};
	settingsRestService.getSignature().then(function(response) {
		$scope.signatureImage = base64BinaryConverterService.toBase64FromJson(response.data);
	}, function(response) {
		response.errorHandled = true;
	});
}]);
