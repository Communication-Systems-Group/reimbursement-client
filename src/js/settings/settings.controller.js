app.controller('SettingsController', ['$scope', '$state', 'settingsRestService', 'globalMessagesService', 'base64BinaryConverterService',

function($scope, $state, settingsRestService, globalMessagesService, base64BinaryConverterService) {
	'use strict';

	$scope.newSignature = function() {
		globalMessagesService.confirmInfoMd('reimbursement.settings.signature.submitWarningTitle',
			'reimbursement.settings.signature.submitWarningMessage').then(function() {

			$state.go('settingsSignature');
		});
	};

	settingsRestService.getSignature().then(function(response) {
		$scope.signatureImage = base64BinaryConverterService.toBase64FromJson(response.data);
	}, function(response) {
		response.errorHandled = true;
	});

}]);
