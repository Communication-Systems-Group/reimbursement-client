app.controller('AttachmentController', ['$scope', '$state', '$uibModal', 'Modernizr', 'spinnerService', 'attachmentRestService', 'base64BinaryConverterService', 'fileExtensionService', 'globalMessagesService','$log',

function($scope, $state, $uibModal, Modernizr, spinnerService, attachmentRestService, base64BinaryConverterService, fileExtensionService, globalMessagesService, $log) {
	"use strict";

	$scope.postAttachmentPath = attachmentRestService.postAttachmentPath($scope.expenseItemUid);
	$scope.base64 = "";
	$scope.displayAttachment = false;
	$scope.Modernizr = Modernizr;
	$scope.flow = {};

	$scope.showAttachmentLink = function() {
		attachmentRestService.getAttachment($scope.expenseItemUid).then(function(response) {
			if(response.data.content) {
				$scope.base64 = base64BinaryConverterService.toBase64FromJson(response.data);
				$scope.displayAttachment = true;
			}
			else {
				$scope.base64 = "";
				$scope.displayAttachment = false;
			}

		}, function(response) {
			response.errorHandled = true;

			$scope.base64 = "";
			$scope.displayAttachment = false;
		});
	};
	$scope.showAttachmentLink();

	$scope.showSpinner = function(spinnerId) {
		spinnerService.show(spinnerId);
	};

	$scope.showQR = function() {
		attachmentRestService.postAttachmentMobileToken($scope.expenseItemUid).then(function(response) {
			var modalInstance = $uibModal.open({
				templateUrl : 'attachment/attachment-qr.tpl.html',
				controller : 'AttachmentQRController',
				resolve : {
					token : function() {
						return response.data.uid;
					},
					expenseItemUid : function(){
						return $scope.expenseItemUid;
					}
				}
			});

			modalInstance.result.then(function(response) {
				$scope.base64 = base64BinaryConverterService.toBase64FromJson(response.data);
				$scope.displayAttachment = true;
			});
		});
	};

	$scope.onAttachmentUploadError = function() {
		spinnerService.hide('spinnerAttachmentImage');
		$scope.flow.image.cancel();
		globalMessagesService.showGeneralError();
	};

	//TODO check if this method is names correctly, I doubt it
	$scope.onAttachmentUploadSuccess = function() {
		var fileWrapper = $scope.flow.image.files[0];

		// file was not accepted by the validator
		if(typeof fileWrapper === "undefined" || typeof fileWrapper.file === "undefined") {
			globalMessagesService.showWarning("reimbursement.globalMessage.notAnImage.title", "reimbursement.globalMessage.notAnImage.message");
		}
		else {
			$scope.showAttachmentLink();
		}
		spinnerService.hide("spinnerAttachmentImage");
	};

	$scope.validateFile = function($file) {
		if(typeof $file !== "undefined" && typeof $file.name !== "undefined" && $file.name !== "") {
			return fileExtensionService.isImageFile($file.name) || fileExtensionService.isPdfFile($file.name);
		}
		else {
			$log.error("File has not passed the validateFile check.");
			return false;
		}
	};

	$scope.deleteAttachment = function() {
		globalMessagesService.confirmWarning("reimbursement.captureAttachment.deleteAttachment.title",
			"reimbursement.captureAttachment.deleteAttachment.message").then(function() {

			spinnerService.show("spinnerAttachmentImage");
			attachmentRestService.deleteAttachment($scope.expenseItemUid).then(	$scope.showAttachmentLink)
				['finally'](function() {
					spinnerService.hide("spinnerAttachmentImage");
				});
		});
	};

}]);