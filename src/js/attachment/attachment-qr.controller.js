app.controller('AttachmentQRController', ['$scope', '$modalInstance', '$modal', 'attachmentRestService', 'spinnerService', 'globalMessagesService', 'token','expenseItemUid',

function($scope, $modalInstance, $modal, attachmentRestService, spinnerService, globalMessagesService, token, expenseItemUid) {
	"use strict";

	$scope.qrUrl = window.location.protocol + "//" + window.location.host + "/#!attachment-mobile/" + token;
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