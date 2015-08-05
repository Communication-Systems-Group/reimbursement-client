app.controller('AttachmentMobileController', ['$scope', '$stateParams', 'attachmentRestService', 'spinnerService',

function($scope, $stateParams, attachmentRestService, spinnerService) {
	"use strict";

	$scope.postSignaturePath = attachmentRestService.postSignatureMobilePath($stateParams.token);
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