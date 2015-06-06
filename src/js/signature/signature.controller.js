app.controller('SignatureController', ['$scope', '$state', '$modal', 'Modernizr', 'spinnerService', 'signatureRestService', 'base64BinaryConverterService', 'fileExtensionService', 'globalMessagesService',

function($scope, $state, $modal, Modernizr, spinnerService, signatureRestService, base64BinaryConverterService, fileExtensionService, globalMessagesService) {
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
		signatureRestService.postSignatureMobileToken().then(function(response) {
			var modalInstance = $modal.open({
				templateUrl : 'signature/signature-qr.tpl.html',
				controller : 'SignatureQRController',
				resolve : {
					token : function() {
						return response.data.uid;
					}
				}
			});

			modalInstance.result.then(function(response) {
				base64BinaryConverterService.toBase64(response.data, goToNextPage);
			});
		}, function() {
			globalMessagesService.showGeneralError();
		});
	};

	$scope.showUploadError = function(type) {
		spinnerService.hide('spinnerSignatureImage');
		spinnerService.hide('spinnerSignatureTouch');
		globalMessagesService.showGeneralError();
		if(type === 'image') {
			$scope.flow.image.cancel();
		}
		else {
			$scope.flow.touch.cancel();
		}
	};

	$scope.getImageAndGoToNextPage = function() {
		var fileWrapper = $scope.flow.image.files[0] || $scope.flow.touch.files[0];

		// file was not accepted by the validator
		if(typeof fileWrapper === "undefined" || typeof fileWrapper.file === "undefined") {
			globalMessagesService.showWarning("reimbursement.globalMessage.notAnImage.title", "reimbursement.globalMessage.notAnImage.message");
			spinnerService.hide("spinnerSignatureImage");
		}
		else {
			base64BinaryConverterService.toBase64(fileWrapper.file, goToNextPage);
		}
	};

	$scope.validateFile = function($file) {
		if(typeof $file !== "undefined" && typeof $file.name !== "undefined" && $file.name !== "") {
			return fileExtensionService.isImageFile($file.name);
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