app.controller('AttachmentController', ['$scope', '$state', '$modal', 'Modernizr', 'spinnerService', 'attachmentRestService', 'base64BinaryConverterService', 'fileExtensionService', 'globalMessagesService','$log',

function($scope, $state, $modal, Modernizr, spinnerService, attachmentRestService, base64BinaryConverterService, fileExtensionService, globalMessagesService, $log) {
	"use strict";

	$scope.postAttachmentPath = attachmentRestService.postAttachmentPath($scope.expenseItemUid);
	$scope.Modernizr = Modernizr;
	$scope.flow = {};

	$scope.showAttachmentImage = false;
	$scope.showAttachmentUpload = true;

	$scope.showAttachment = function(){
		attachmentRestService.getAttachment($scope.expenseItemUid).then(function(response) {
			if(response.data.content){
					showAttachmentInForm(base64BinaryConverterService.toBase64FromJson(response.data));
					$scope.selectShowTab();
				}
			}, function(reason){
				reason.errorHandled = true;
			});
		};
	$scope.showAttachment();


	//TODO make this smart
	function showAttachmentInForm(responseAsBase64){
		jQuery("#showAttachment").attr({"src":responseAsBase64});
	}

	$scope.showSpinner = function(spinnerId) {
		spinnerService.show(spinnerId);
	};

	$scope.showQR = function() {
		attachmentRestService.postAttachmentMobileToken($scope.expenseItemUid).then(function(response) {
			var modalInstance = $modal.open({
				templateUrl : 'attachment/attachment-qr.tpl.html',
				controller : 'AttachmentQRController',
				resolve : {
					token : function() {
						return response.data.uid;
					},
					expenseItemUid : function(){
						return $scope.expenseItemUid;
					}
				}
			});

			modalInstance.result.then(function(response) {
				var imageAsBase64 = base64BinaryConverterService.toBase64FromJson(response.data);
				//TODO make all pretty for example with directive features element instead of jQ
				//$scope.addImageToElement(imageAsBase64);
				showAttachmentInForm(imageAsBase64);

			});
		});
	};

	$scope.onAttachmentUploadError = function(type) {
		spinnerService.hide('spinnerAttachmentImage');
		globalMessagesService.showGeneralError();
		if(type === 'image') {
			$scope.flow.image.cancel();
		}
		else {
			$scope.flow.touch.cancel();
		}
	};

	//TODO check if this method is names correctly, I doubt it
	$scope.onAttachmentUploadSuccess = function() {
		var fileWrapper = $scope.flow.image.files[0];

		// file was not accepted by the validator
		if(typeof fileWrapper === "undefined" || typeof fileWrapper.file === "undefined") {
			globalMessagesService.showWarning("reimbursement.globalMessage.notAnImage.title", "reimbursement.globalMessage.notAnImage.message");
			$scope.showAttachment();
			spinnerService.hide("spinnerAttachmentImage");
		}
		else {
			$scope.showAttachment();
			spinnerService.hide("spinnerAttachmentImage");
		}
	};

	$scope.validateFile = function($file) {
		if(typeof $file !== "undefined" && typeof $file.name !== "undefined" && $file.name !== "") {
			return fileExtensionService.isImageFile($file.name) || fileExtensionService.isPdfFile($file.name);
		}
		else {
			$log.error("File has not passed the validateFile check.");
			return false;
		}
	};

	$scope.selectShowTab = function() {
		$scope.showAttachmentImage = true;
		$scope.showAttachmentUpload = false;
	};
	$scope.selectUploadTab = function() {
		$scope.showAttachmentImage = false;
		$scope.showAttachmentUpload = true;
	};

}]);