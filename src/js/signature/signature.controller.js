app.controller('SignatureController', function($scope, $state, $modal, Modernizr, spinnerService, signatureRESTService) {
	"use strict";

	$scope.postSignaturePath = signatureRESTService.postSignaturePath();
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

	$scope.showQR = function() {
		var modalInstance = $modal.open({
			templateUrl: 'templates/signature-qr.html',
			controller: 'SignatureQRController'
		});

		modalInstance.result.then(parseBinaryDataAndGoToNextPage);
	};

	$scope.getImageAndGoToNextPage = function() {
		// TODO sebi | get image from flow instead as from server.
		signatureRESTService.getSignature().then(parseBinaryDataAndGoToNextPage);
	};

	function parseBinaryDataAndGoToNextPage(response) {
		// TODO sebi | move to utility service
		var fileReader = new window.FileReader();
		fileReader.onload = function() {
			goToNextPage(fileReader.result);
		};
		fileReader.readAsDataURL(response.data);
	}

	function goToNextPage(base64Image) {
		spinnerService.hide('spinnerSignatureImage');
		spinnerService.hide('spinnerSignatureTouch');

		$state.go('cropping', {imageUri: base64Image});
	}


});