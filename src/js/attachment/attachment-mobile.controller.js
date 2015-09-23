app.controller('AttachmentMobileController', ['$scope', '$location', '$log','attachmentRestService', 'spinnerService','base64BinaryConverterService','fileExtensionService',

function($scope, $location, $log, attachmentRestService, spinnerService, base64BinaryConverterService, fileExtensionService) {
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
			$log.error("File has not passed the validateFile check.");
			return false;
		}
	};

}]);