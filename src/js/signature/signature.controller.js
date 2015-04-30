app.controller('SignatureController', function($scope, $state, $modal, Modernizr, spinnerService, signatureRestService, base64BinaryConverterService) {
	"use strict";

	$scope.postSignaturePath = signatureRestService.postSignaturePath();
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
			templateUrl: 'templates/signature/signature-qr.tpl.html',
			controller: 'SignatureQRController'
		});

		modalInstance.result.then(function(response) {
			base64BinaryConverterService.toBase64(response.data, goToNextPage);
		});
	};

	$scope.getImageAndGoToNextPage = function() {
		var fileWrapper = $scope.flow.image.files[0] || $scope.flow.touch.files[0];
		base64BinaryConverterService.toBase64(fileWrapper.file, goToNextPage);
	};

	function goToNextPage(base64Image) {
		spinnerService.hide('spinnerSignatureImage');
		spinnerService.hide('spinnerSignatureTouch');

		$state.go('cropping', {imageUri: base64Image});
	}


});