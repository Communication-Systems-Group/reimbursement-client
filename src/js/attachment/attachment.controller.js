app.controller('AttachmentController', ['$scope', '$state', '$modal', 'Modernizr', 'spinnerService', 'attachmentRestService', 'base64BinaryConverterService', 'fileExtensionService', 'globalMessagesService',"$log",

function($scope, $state, $modal, Modernizr, spinnerService, attachmentRestService, base64BinaryConverterService, fileExtensionService, globalMessagesService, $log) {
	"use strict";

	$scope.postAttachmentPath = attachmentRestService.postAttachmentPath();
	$scope.Modernizr = Modernizr;
	$scope.flow = {};

	$scope.showSpinner = function(spinnerId) {
		$log.log("show spinner with id:"+spinnerId);
		spinnerService.show(spinnerId);
	};

	$scope.showQR = function() {
		attachmentRestService.postAttachmentMobileToken().then(function(response) {
			var modalInstance = $modal.open({
				templateUrl : 'attachment/attachment-qr.tpl.html',
				controller : 'AttachmentQRController',
				resolve : {
					token : function() {
						return response.data.uid;
					}
				}
			});

			modalInstance.result.then(function(response) {
				base64BinaryConverterService.toBase64FromJson(response.data, goToNextPage);
			});
		});
	};

	$scope.showUploadError = function(type) {
		spinnerService.hide('spinnerAttachmentImage');
		globalMessagesService.showGeneralError();
		if(type === 'image') {
			$scope.flow.image.cancel();
		}
		else {
			$scope.flow.touch.cancel();
		}
	};

	$scope.getImageAndGoToNextPage = function() {
		$log.log("get image called");
		var fileWrapper = $scope.flow.image.files[0] || $scope.flow.touch.files[0];

		// file was not accepted by the validator
		if(typeof fileWrapper === "undefined" || typeof fileWrapper.file === "undefined") {
			globalMessagesService.showWarning("reimbursement.globalMessage.notAnImage.title", "reimbursement.globalMessage.notAnImage.message");
			spinnerService.hide("spinnerAttachmentImage");
		}
		else {
			//for cropping
			// base64BinaryConverterService.toBase64(fileWrapper.file, goToNextPage);
			goToNextPage();
		}
	};

	$scope.validateFile = function($file) {
		if(typeof $file !== "undefined" && typeof $file.name !== "undefined" && $file.name !== "") {
			$log.log("validate true");
			return fileExtensionService.isImageFile($file.name);
		}
		else {
			$log.log("validate false");
			return false;
		}
	};

	//for cropping
	// function goToNextPage(base64Image) {
		// spinnerService.hide('spinnerAttachmentImage');
		// $state.go('cropping', {
			// imageUri : base64Image
		// });
	// }

	function goToNextPage() {
		spinnerService.hide('spinnerAttachmentImage');
		$state.go('dashboard');
	}

}]);