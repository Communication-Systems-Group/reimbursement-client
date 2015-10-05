app.controller('SettingsController', ['$scope', '$state', '$timeout', '$translate', 'settingsRestService', 'USER', 'globalMessagesService', 'base64BinaryConverterService',

function($scope, $state, $timeout, $translate, settingsRestService, USER, globalMessagesService, base64BinaryConverterService) {
	'use strict';

	$scope.form = {};
	$scope.languages = [];
	$scope.form.personnelNumber = USER.personnelNumber;
	$scope.form.phoneNumber = USER.phoneNumber;
	$scope.form.isActive = USER.isActive;

	settingsRestService.getSupportedLanguages().then(function(response) {
		$scope.languages = response.data;
		$timeout(function() {
			$scope.form.language = USER.language;
		});
	});
	$scope.saveSettings = function() {
		settingsRestService.putSettings($scope.form).then(function() {
			USER.isActive = $scope.form.isActive;
			USER.personnelNumber = $scope.form.personnelNumber;
			USER.phoneNumber = $scope.form.phoneNumber;
			USER.language = $scope.form.language;
			$translate.use($scope.form.language.toLowerCase());
			globalMessagesService.showInfo('reimbursement.settings.user.submitInfoTitle',
				'reimbursement.settings.user.submitInfoMessage');
		});
	};
	$scope.newSignature = function() {
		globalMessagesService.confirmInfoMd('reimbursement.settings.signature.submitWarningTitle',
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
