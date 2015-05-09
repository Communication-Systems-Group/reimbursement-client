app.directive('signaturePad', ['$window', '$timeout', 'base64BinaryConverterService',

function($window, $timeout, base64BinaryConverterService) {
	"use strict";

	return {
		restrict : 'E',
		replace : false,
		templateUrl : 'signature/signature-pad.directive.tpl.html',
		scope : {
			submit : "="
		},
		link : function($scope, $element) {
			var canvas = $element.find("canvas");
			var signaturePad = new SignaturePad(canvas[0]);

			setCanvasSize();

			$scope.clearSignature = function() {
				signaturePad.clear();
				setCanvasSize();
			};

			$scope.submitSignature = function() {
				if (!signaturePad.isEmpty()) {
					var dataBase64 = signaturePad.toDataURL();
					var file = convertBase64ToFile(dataBase64);

					// TODO sebi | find out why it is necessary to have $timeout here.
					// removing it leads to "Error: [$rootScope:inprog] $apply already in progress"
					$timeout(function() {
						$scope.submit(file);
					});
				}
			};

			function convertBase64ToFile(dataBase64) {
				return base64BinaryConverterService.toBinary(dataBase64);
			}

			function setCanvasSize() {
				var width1 = parseInt(jQuery('#signatureCaptureImage').css('width'), 10);
				var width2 = parseInt(jQuery('#signatureCaptureTouch').css('width'), 10);

				var width = Math.max(width1, width2);
				var height = width * 1 / 3;

				canvas.attr('width', width);
				canvas.attr('height', height);
				$scope.signatureWidth = width;
				$scope.signatureHeight = height;
			}


			$window.addEventListener("resize", $scope.clearSignature, false);
			$window.addEventListener("orientationchange", $scope.clearSignature, false);
		}
	};

}]);