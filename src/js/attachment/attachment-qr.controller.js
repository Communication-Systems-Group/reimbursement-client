app.controller('AttachmentQRController', ['$scope', '$uibModalInstance', 'THIS_HOST', 'attachmentRestService', 'spinnerService', 'globalMessagesService', 'token', 'expenseItemUid',

function($scope, $uibModalInstance, THIS_HOST, attachmentRestService, spinnerService, globalMessagesService, token, expenseItemUid) {
	"use strict";

	$scope.qrUrl = THIS_HOST + "/attachment-mobile/" + token;
	$scope.dismiss = $uibModalInstance.dismiss;

	$scope.checkAndClose = function() {
		spinnerService.show('spinnerAttachmentQR');

		attachmentRestService.getAttachment(expenseItemUid).then(function(image) {
			$uibModalInstance.close(image);

		}, function(response) {
			response.errorHandled = true;
			globalMessagesService.showWarning("reimbursement.globalMessage.captureAttachment.qr.notYetCapturedTitle",
				"reimbursement.globalMessage.captureAttachment.qr.notYetCapturedMessage");

		})['finally'](function() {
			spinnerService.hide('spinnerAttachmentQR');
		});

	};

}]);