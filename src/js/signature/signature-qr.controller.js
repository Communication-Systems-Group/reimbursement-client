app.controller('SignatureQRController', ['$scope', '$modalInstance', '$modal', 'signatureRestService', 'spinnerService', 'globalMessagesService', 'token',

function($scope, $modalInstance, $modal, signatureRestService, spinnerService, globalMessagesService, token) {
	"use strict";

	$scope.qrUrl = "//" + window.location.host + "/#!signature-mobile/" + token;
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