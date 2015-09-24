app.controller('AttachmentMobileController', ['$scope', '$location', 'attachmentRestService', 'spinnerService','base64BinaryConverterService','fileExtensionService','globalMessagesService',

function($scope, $location, attachmentRestService, spinnerService, base64BinaryConverterService, fileExtensionService,globalMessagesService) {
	"use strict";

	var tokenUid = $location.path().split("/")[2];
	$scope.postAttachmentPath = attachmentRestService.postAttachmentMobilePath(tokenUid);
	$scope.flow = {};
	$scope.isComplete = false;
	$scope.isError = false;


	$scope.showSpinner = function(spinnerId) {
		$scope.spinnerId = spinnerId;
		spinnerService.show($scope.spinnerId);
	};

	$scope.success = function() {
		spinnerService.hide($scope.spinnerId);
		$scope.isComplete = true;
	};

	$scope.error = function() {
		spinnerService.hide($scope.spinnerId);
		$scope.isError = true;
	};

	$scope.validateFile = function($file) {
		if(typeof $file !== "undefined" && typeof $file.name !== "undefined" && $file.name !== "") {
			return fileExtensionService.isImageFile($file.name) || fileExtensionService.isPdfFile($file.name);
		}
		else {
			globalMessagesService.showWarning("reimbursement.globalMessage.notAnImage.title", "reimbursement.globalMessage.notAnImage.message");
			return false;
		}
	};

}]);