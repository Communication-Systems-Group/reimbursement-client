app.controller('SignatureMobileController', ['$scope', 'signatureRestService', 'spinnerService',

function($scope, signatureRestService, spinnerService) {
	"use strict";

	$scope.postSignaturePath = signatureRestService.postSignaturePath();
	$scope.flow = {};
	$scope.isComplete = false;

	$scope.submit = function(file) {
		$scope.flow.touchMobile.addFile(file);
		$scope.flow.touchMobile.upload();
	};

	$scope.showSpinner = function(spinnerId) {
		spinnerService.show(spinnerId);
	};

	$scope.complete = function() {
		spinnerService.hide("spinnerSignatureTouchMobile");
		$scope.isComplete = true;
	};

}]);