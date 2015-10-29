app.directive('signature', ['$state', '$uibModal', 'Modernizr', 'spinnerService', 'signatureRestService', 'base64BinaryConverterService', 'globalMessagesService',

function($state, $uibModal, Modernizr, spinnerService, signatureRestService, base64BinaryConverterService, globalMessagesService) {
	"use strict";

	return {
		restrict: 'E',
		replace: true,
		templateUrl: 'signature/signature.directive.tpl.html',
		scope: {
			isRegistration: '='
		},
		controller: ['$scope', function($scope) {
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
					var modalInstance = $uibModal.open({
						templateUrl : 'signature/signature-qr.tpl.html',
						controller : 'SignatureQRController',
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
				spinnerService.hide('spinnerSignatureImage');
				spinnerService.hide('spinnerSignatureTouch');

				if(type === 'image') {
					globalMessagesService.showError("reimbursement.globalMessage.uploadOrValidationError.title",
						"reimbursement.globalMessage.uploadOrValidationError.message");
					$scope.flow.image.cancel();
				}
				else {
					globalMessagesService.showGeneralError();
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

			function goToNextPage(base64Image) {
				spinnerService.hide('spinnerSignatureImage');
				spinnerService.hide('spinnerSignatureTouch');

				var nextState;
				if($scope.isRegistration) {
					nextState = 'registrationCropping';
				}
				else {
					nextState = 'settingsCropping';
				}

				$state.go(nextState, {
					imageUri : base64Image
				});
			}
		}]
	};

}]);