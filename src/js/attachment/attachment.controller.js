app.controller('AttachmentController', ['$scope', '$uibModal', 'spinnerService', 'attachmentRestService', 'base64BinaryConverterService', 'globalMessagesService',

function($scope, $uibModal, spinnerService, attachmentRestService, base64BinaryConverterService, globalMessagesService) {
	"use strict";

	$scope.postAttachmentPath = attachmentRestService.postAttachmentPath($scope.expenseItemUid);
	$scope.base64 = "";
	$scope.hasAttachment = false;
	$scope.flow = {};

	function showAttachmentLinkOrUploadForm() {
		spinnerService.show("spinnerAttachmentImage");

		attachmentRestService.getAttachment($scope.expenseItemUid).then(function(response) {
			if(response.data.content) {
				$scope.base64 = base64BinaryConverterService.toBase64FromJson(response.data);
				$scope.hasAttachment = true;
			}
			else {
				$scope.base64 = "";
				$scope.hasAttachment = false;
			}

		}, function(response) {
			response.errorHandled = true;

			$scope.base64 = "";
			$scope.hasAttachment = false;

		})["finally"](function() {
			spinnerService.hide("spinnerAttachmentImage");
		});
	}
	showAttachmentLinkOrUploadForm();

	$scope.showSpinner = function(spinnerId) {
		spinnerService.show(spinnerId);
	};

	$scope.showQR = function() {
		attachmentRestService.postAttachmentMobileToken($scope.expenseItemUid).then(function(response) {
			var modalInstance = $uibModal.open({
				templateUrl: 'attachment/attachment-qr.tpl.html',
				controller: 'AttachmentQRController',
				resolve: {
					token: function() {
						return response.data.uid;
					},
					expenseItemUid: function() {
						return $scope.expenseItemUid;
					}
				}
			});

			modalInstance.result.then(function(response) {
				$scope.base64 = base64BinaryConverterService.toBase64FromJson(response.data);
				$scope.hasAttachment = true;
			});
		});
	};

	$scope.onAttachmentUploadError = function() {
		spinnerService.hide('spinnerAttachmentImage');
		globalMessagesService.showError("reimbursement.globalMessage.uploadOrValidationError.title",
			"reimbursement.globalMessage.uploadOrValidationError.message");
		$scope.flow.image.cancel();
	};

	$scope.onAttachmentUploadSuccess = function() {
		var fileWrapper = $scope.flow.image.files[0];

		spinnerService.hide("spinnerAttachmentImage");

		// file was not accepted by the validator
		if(typeof fileWrapper === "undefined" || typeof fileWrapper.file === "undefined") {
			globalMessagesService.showWarning("reimbursement.globalMessage.notAnImage.title",
			"reimbursement.globalMessage.notAnImage.message");
		}
		else {
			showAttachmentLinkOrUploadForm();
		}
	};

	$scope.deleteAttachment = function() {
		globalMessagesService.confirmWarning("reimbursement.captureAttachment.deleteAttachment.title",
		"reimbursement.captureAttachment.deleteAttachment.message").then(function() {

			spinnerService.show("spinnerAttachmentImage");
			attachmentRestService.deleteAttachment($scope.expenseItemUid).then(	function() {
				spinnerService.hide("spinnerAttachmentImage");
				showAttachmentLinkOrUploadForm();
			}, function() {
				spinnerService.hide("spinnerAttachmentImage");
			});
		});
	};

}]);