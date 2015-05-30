app.controller('SignatureController', ['$scope', '$state', '$modal', 'Modernizr', 'spinnerService', 'signatureRestService', 'base64BinaryConverterService', 'fileExtensionService',

function($scope, $state, $modal, Modernizr, spinnerService, signatureRestService, base64BinaryConverterService, fileExtensionService) {
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
			templateUrl : 'signature/signature-qr.tpl.html',
			controller : 'SignatureQRController'
		});

		modalInstance.result.then(function(response) {
			base64BinaryConverterService.toBase64(response.data, goToNextPage);
		});
	};

	$scope.getImageAndGoToNextPage = function() {
		var fileWrapper = $scope.flow.image.files[0] || $scope.flow.touch.files[0];

		// file was not accepted by the validator
		if(typeof fileWrapper === "undefined" || typeof fileWrapper.file === "undefined") {
			// TODO sebi | show message in a global error modal instead of alert
			window.alert("Not a valid image.");
			spinnerService.hide("spinnerSignatureImage");
		}
		else {
			base64BinaryConverterService.toBase64(fileWrapper.file, goToNextPage);
		}
	};

	$scope.validateFile = function($file) {
		if(typeof $file !== "undefined" && typeof $file.name !== "undefined" && $file.name !== "") {
			var ext = fileExtensionService.fromFilename($file.name);
			if(ext === "jpg" || ext === "jpeg" || ext === "png" || ext === "gif") {
				return true;
			}
			else {
				return false;
			}
		}
		else {
			return false;
		}
	};

	function goToNextPage(base64Image) {
		spinnerService.hide('spinnerSignatureImage');
		spinnerService.hide('spinnerSignatureTouch');

		$state.go('cropping', {
			imageUri : base64Image
		});
	}

}]);