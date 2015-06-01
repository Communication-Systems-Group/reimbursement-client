app.controller('SignatureQRController', ['$scope', '$modalInstance', '$modal', 'signatureRestService', 'spinnerService', 'globalMessagesService',

function($scope, $modalInstance, $modal, signatureRestService, spinnerService, globalMessagesService) {
	"use strict";

	$scope.qrUrl = "http://localhost:9005/#!signature-mobile";
	$scope.dismiss = $modalInstance.dismiss;

	$scope.checkAndClose = function() {
		spinnerService.show('spinnerSignatureQR');

		var promise = signatureRestService.getSignature();
		promise.then(function(image) {
			$modalInstance.close(image);
		}, function() {

			globalMessagesService.showError("reimbursement.globalMessage.signatureQrNoImage.title",
				"reimbursement.globalMessage.signatureQrNoImage.message");

		})['finally'](function() {
			spinnerService.hide('spinnerSignatureQR');
		});

	};

}]);