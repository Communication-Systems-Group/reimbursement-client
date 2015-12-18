app.controller('SignatureQRController', ['$scope', '$uibModalInstance', 'THIS_HOST', 'signatureRestService', 'spinnerService', 'globalMessagesService', 'token',

function($scope, $uibModalInstance, THIS_HOST, signatureRestService, spinnerService, globalMessagesService, token) {
	"use strict";

	$scope.qrUrl = THIS_HOST + "/signature-mobile/" + token;
	$scope.dismiss = $uibModalInstance.dismiss;

	$scope.checkAndClose = function() {
		spinnerService.show('spinnerSignatureQR');

		var promise = signatureRestService.getSignature();
		promise.then(function(image) {
			$uibModalInstance.close(image);
		}, function(response) {
			response.errorHandled = true;
			globalMessagesService.showError("reimbursement.globalMessage.signatureQrNoImageTitle",
				"reimbursement.globalMessage.signatureQrNoImageMessage");

		})['finally'](function() {
			spinnerService.hide('spinnerSignatureQR');
		});

	};

}]);