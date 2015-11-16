app.controller('AttachmentMobileController', ['$scope', '$location', 'attachmentRestService', 'spinnerService', 'MAX_UPLOAD_SIZE',

function($scope, $location, attachmentRestService, spinnerService, MAX_UPLOAD_SIZE) {
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

	$scope.maxUploadSize = MAX_UPLOAD_SIZE;

	// fix position relative on ui-view-container
	jQuery('.ui-view-container').removeClass('ui-view-container');

}]);