app.controller('SignatureController', function($scope, $state, Modernizr, spinnerService, $modal) {
	"use strict";

	$scope.Modernizr = Modernizr;
	$scope.showUploadImage = false;
	$scope.showTouchInput = true;
	$scope.forceSignaturePad = false;
	$scope.flow = {};

	$scope.selectTouchTab = function() {
		$scope.showUploadImage = false;
		$scope.showTouchInput = true;
	};
	$scope.selectUploadTab = function() {
		$scope.showUploadImage = true;
		$scope.showTouchInput = false;
	};

	$scope.submitTouch = function(file) {
		$scope.flow.touch.addFile(file);
		$scope.flow.touch.upload();
	};

	$scope.showSpinner = function(spinnerId) {
		spinnerService.show(spinnerId);
	};

	$scope.goToNextPage = function() {
		spinnerService.hide('spinnerSignatureImage');
		spinnerService.hide('spinnerSignatureTouch');
		$state.go('cropping');
	};

	$scope.showQR = function() {
		var modalInstance = $modal.open({
			templateUrl: 'templates/signature-qr.html',
			controller: 'SignatureQRController'
		});

		modalInstance.result.then(function() {
			$scope.goToNextPage();
		});
	};

});