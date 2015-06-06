app.controller('SignatureMobileController', ['$scope', '$stateParams', 'signatureRestService', 'spinnerService',

function($scope, $stateParams, signatureRestService, spinnerService) {
	"use strict";

	$scope.postSignaturePath = signatureRestService.postSignatureMobilePath($stateParams.token);
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
		spinnerService.hide("spinnerSignatureTouchMobile");
		$scope.isComplete = true;
	};

	$scope.error = function() {
		spinnerService.hide("spinnerSignatureTouchMobile");
		$scope.isError = true;
	};

}]);