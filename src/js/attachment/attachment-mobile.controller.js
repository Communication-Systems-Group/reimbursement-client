app.controller('AttachmentMobileController', ['$scope', '$location', 'attachmentRestService', 'spinnerService',

function($scope, $location, attachmentRestService, spinnerService) {
	"use strict";

	var tokenUid = $location.path().split("/")[2];
	$scope.postAttachmentPath = attachmentRestService.postAttachmentMobilePath(tokenUid);
	$scope.flow = {};
	$scope.isComplete = false;
	$scope.isError = false;

	$scope.submit = function(file) {
		$scope.flow.touchMobile.addFile(file);
		$scope.flow.touchMobile.upload();
	};

	$scope.showSpinner = function(spinnerId) {
		spinnerService.show(spinnerId);
	};

	$scope.success = function() {
		spinnerService.hide("spinnerAttachmentTouchMobile");
		$scope.isComplete = true;
	};

	$scope.error = function() {
		spinnerService.hide("spinnerAttachmentTouchMobile");
		$scope.isError = true;
	};

}]);