app.directive('imageCapture', ['$window', '$timeout',

function($window, $timeout) {
/*global navigator, MediaStreamTrack*/
	"use strict";

	return {
		restrict : 'E',
		replace : false,
		templateUrl : 'attachment/image-capture.directive.tpl.html',
		scope : {
			submit : "=",
			parents: "=",
			full: "="
		},
		link : function($scope) {




var videoElement = document.querySelector('video');
var videoSelect = document.querySelector('select#videoSource');

navigator.getUserMedia  = navigator.getUserMedia ||
                          navigator.webkitGetUserMedia ||
                          navigator.mozGetUserMedia ||
                          navigator.msGetUserMedia;

function gotSources(sourceInfos) {
  for (var i = 0; i !== sourceInfos.length; ++i) {
    var sourceInfo = sourceInfos[i];
    var option = document.createElement('option');
    option.value = sourceInfo.id;
    if (sourceInfo.kind === 'video') {
      option.text = sourceInfo.label || 'Camera ' + (videoSelect.length + 1);
      videoSelect.appendChild(option);
    } else {
      console.log('Some other kind of source: ', sourceInfo);
    }
  }
}

//Check webRTC capability
if (typeof MediaStreamTrack === 'undefined' || typeof MediaStreamTrack.getSources === 'undefined') {
  window.alert('This browser does not support MediaStreamTrack.\n\nTry Chrome.');
} else {
  MediaStreamTrack.getSources(gotSources);
}

function successCallback(stream) {
  window.stream = stream; // make stream available to console
  videoElement.src = window.URL.createObjectURL(stream);
  videoElement.play();
}

function errorCallback(error) {
  console.log('navigator.getUserMedia error: ', error);
}

function start() {
  if (!!window.stream) {
    videoElement.src = null;
    window.stream.stop();
  }
  var videoSource = videoSelect.value;
  var constraints = {
    video: {
      optional: [{
        sourceId: videoSource
      }]
    }
  };
  navigator.getUserMedia(constraints, successCallback, errorCallback);
}
videoSelect.onchange = start;
start();

//snapshot
var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');

$scope.snapshot = function() {
    if (!!window.stream) {
      ctx.drawImage(videoElement, 0, 0);
      // "image/webp" works in Chrome.
      // Other browsers will fall back to image/png.
      document.querySelector('img').src = canvas.toDataURL('image/webp');
    }
 };


			// var signaturePad = new SignaturePad(canvas[0]);

			setCanvasSize();

			// $scope.clearCapture = function() {
				// signaturePad.clear();
				// setCanvasSize();
			// };
//
			// $scope.submitSignature = function() {
				// if (!signaturePad.isEmpty()) {
					// var dataBase64 = signaturePad.toDataURL();
					// var file = convertBase64ToFile(dataBase64);
//
					// // TODO sebi | find out why it is necessary to have $timeout here.
					// // removing it leads to "Error: [$rootScope:inprog] $apply already in progress"
					// $timeout(function() {
						// $scope.submit(file);
					// });
				// }
			// };

			// function convertBase64ToFile(dataBase64) {
				// return base64BinaryConverterService.toBinary(dataBase64);
			// }

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

				canvas.setAttribute('width', width);
				canvas.setAttribute('height', height);
				$scope.captureWidth = width;
				$scope.captureHeight = height;

				// not every digest cycle needs this and causes error
				$timeout(function() {
					$scope.$apply();
				});
			}

			$window.addEventListener("resize", $scope.clearCapture, false);
			$window.addEventListener("orientationchange", $scope.clearCapture, false);
		}
	};

}]);