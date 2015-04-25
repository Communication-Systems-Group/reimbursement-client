app.directive('signaturePad', function($window, $timeout) {
	"use strict";

	return {
		restrict : 'E',
		replace : false,
		templateUrl : 'templates/signature-pad.directive.html',
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
				var type = dataBase64.split(',')[0].split(':')[1].split(";base64")[0];

				var binaryData = window.atob(dataBase64.split(',')[1]);
				var binaryLength = binaryData.length;
				var arrayBuffer = new window.ArrayBuffer(binaryLength);
				var uint8Array = new window.Uint8Array(arrayBuffer);

				for(var i=0; i<binaryLength; i++) {
					uint8Array[i] = binaryData.charCodeAt(i);
				}

				var blob = new window.Blob([binaryData], {type: type});
				blob.lastModifiedDate = new Date();
				blob.name = new Date().toUTCString()+".png";

				var file = blob;
				return file;
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
});