app.controller('SignatureQRController', ['$scope', '$modalInstance', 'THIS_HOST', 'signatureRestService', 'spinnerService', 'globalMessagesService', 'token',

function($scope, $modalInstance, THIS_HOST, signatureRestService, spinnerService, globalMessagesService, token) {
	"use strict";

	$scope.qrUrl = THIS_HOST + "/signature-mobile/" + token;
	$scope.dismiss = $modalInstance.dismiss;

	$scope.checkAndClose = function() {
		spinnerService.show('spinnerSignatureQR');

		var promise = signatureRestService.getSignature();
		promise.then(function(image) {
			$modalInstance.close(image);
		}, function(response) {
			response.errorHandled = true;
			globalMessagesService.showError("reimbursement.globalMessage.signatureQrNoImage.title",
				"reimbursement.globalMessage.signatureQrNoImage.message");

		})['finally'](function() {
			spinnerService.hide('spinnerSignatureQR');
		});

	};

}]);