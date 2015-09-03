app.controller('AttachmentQRController', ['$scope', '$modalInstance', '$modal', 'attachmentRestService', 'spinnerService', 'globalMessagesService', 'token',

function($scope, $modalInstance, $modal, attachmentRestService, spinnerService, globalMessagesService, token) {
	"use strict";

	$scope.qrUrl = window.location.protocol + "//" + window.location.host + "/#!attachment-mobile/" + token;
	$scope.dismiss = $modalInstance.dismiss;

	$scope.checkAndClose = function() {
		spinnerService.show('attachmentSignatureQR');

		var promise = signatureRestService.getSignature();
		promise.then(function(image) {
			$modalInstance.close(image);
		}, function() {

			globalMessagesService.showError("reimbursement.globalMessage.attachmentQrNoImage.title",
				"reimbursement.globalMessage.attachmentQrNoImage.message");

		})['finally'](function() {
			spinnerService.hide('attachmentSignatureQR');
		});

	};

}]);