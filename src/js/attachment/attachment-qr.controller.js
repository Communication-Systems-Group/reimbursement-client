app.controller('AttachmentQRController', ['$scope', '$modalInstance', 'THIS_HOST', 'attachmentRestService', 'spinnerService', 'globalMessagesService', 'token','expenseItemUid',

function($scope, $modalInstance, THIS_HOST, attachmentRestService, spinnerService, globalMessagesService, token, expenseItemUid) {
	"use strict";

	$scope.qrUrl = THIS_HOST + "/#!attachment-mobile/" + token;
	$scope.dismiss = $modalInstance.dismiss;

	$scope.checkAndClose = function() {
		spinnerService.show('spinnerAttachmentQR');

		attachmentRestService.getAttachment(expenseItemUid).then(function(image) {
			$modalInstance.close(image);
		}, function() {

			globalMessagesService.showError("reimbursement.globalMessage.attachmentQrNoImage.title",
				"reimbursement.globalMessage.attachmentQrNoImage.message");

		})['finally'](function() {
			spinnerService.hide('spinnerAttachmentQR');
		});

	};

}]);