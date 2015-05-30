app.directive('signaturePad', ['$window', '$timeout', 'base64BinaryConverterService',

function($window, $timeout, base64BinaryConverterService) {
	"use strict";

	return {
		restrict : 'E',
		replace : false,
		templateUrl : 'signature/signature-pad.directive.tpl.html',
		scope : {
			submit : "=",
			parents: "=",
			full: "="
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
				var width = 0;
				var height = 0;

				// if $scope.parents is an array
				if(typeof $scope.parents === "object") {
					for(var i=0; i<$scope.parents.length; i++) {
						var newWidth = parseInt(jQuery($scope.parents[i]).css('width'), 10);
						if(newWidth > width) {
							width = newWidth;
						}
					}
					if($scope.full) {
						for(var j=0; i<$scope.parents.length; j++) {
							var newHeight = parseInt(jQuery($scope.parents[j]).css('height'), 10);
							if(newHeight > height) {
								height = newHeight;
							}
						}
					}
					else {
						height = width * (1 / 3);
					}
				}
				// if $scope.parents is not an array
				else {
					width = parseInt(jQuery($scope.parents).css('width'), 10);
					if($scope.full) {
						height = parseInt(jQuery($scope.parents).css('height'), 10);
					}
					else {
						height = width * (1 / 3);
					}
				}

				canvas.attr('width', width);
				canvas.attr('height', height);
				$scope.signatureWidth = width;
				$scope.signatureHeight = height;

				// not every digest cycle needs this and causes error
				$timeout(function() {
					$scope.$apply();
				});
			}

			$window.addEventListener("resize", $scope.clearSignature, false);
			$window.addEventListener("orientationchange", $scope.clearSignature, false);
		}
	};

}]);