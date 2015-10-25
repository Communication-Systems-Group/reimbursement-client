app.controller('AttachmentQRController', ['$scope', '$modalInstance', 'THIS_HOST', 'attachmentRestService', 'spinnerService', 'globalMessagesService', 'token','expenseItemUid',

function($scope, $modalInstance, THIS_HOST, attachmentRestService, spinnerService, globalMessagesService, token, expenseItemUid) {
	"use strict";

	$scope.qrUrl = THIS_HOST + "/attachment-mobile/" + token;
	$scope.dismiss = $modalInstance.dismiss;

	$scope.checkAndClose = function() {
		spinnerService.show('spinnerAttachmentQR');

		attachmentRestService.getAttachment(expenseItemUid).then(function(image) {
			$modalInstance.close(image);

		}, function(response) {
			response.errorHandled = true;
			globalMessagesService.showWarning("reimbursement.captureAttachment.qr.notYetCaptured.title",
				"reimbursement.captureAttachment.qr.notYetCaptured.message");

		})['finally'](function() {
			spinnerService.hide('spinnerAttachmentQR');
		});

	};

}]);