app.directive('imageCapture', ['$timeout', '$log', 'base64BinaryConverterService',

function($timeout, $log, base64BinaryConverterService) {
	/*global navigator, MediaStreamTrack*/
	"use strict";

	return {
		restrict : 'E',
		replace : false,
		templateUrl : 'attachment/image-capture.directive.tpl.html',
		scope : {
			submit : "=",
			parents : "=",
			full : "="
		},
		link : function($scope) {
			// The width and height of the captured image. We will set the
			// width to the value defined here, but the height will be
			// calculated based on the aspect ratio of the input stream.

			var width = 320;
			// We will scale the image width to this
			var height = 0;
			// This will be computed based on the input stream

			// |streaming| indicates whether or not we're currently streaming
			// video from the camera. Obviously, we start at false.

			var streaming = false;

			// The various HTML elements we need to configure or control.
			var video = document.getElementById('video'), canvas = document.getElementById('canvas'), image = document.getElementById('image'), videoSelect = document.getElementById('videoSource');

			//TODO user modernizer
			//Check webRTC capability
			if ( typeof MediaStreamTrack === 'undefined' || typeof MediaStreamTrack.getSources === 'undefined') {
				$log.error('This browser does not support MediaStreamTrack.\n\nTry Chrome.');
			} else {
				MediaStreamTrack.getSources(gotSources);
			}

			function gotSources(sourceInfos) {
				for (var i = 0; i !== sourceInfos.length; ++i) {
					var sourceInfo = sourceInfos[i];
					var option = document.createElement('option');
					option.value = sourceInfo.id;
					if (sourceInfo.kind === 'video') {
						option.text = sourceInfo.label || 'Camera ' + (videoSelect.length + 1);
						videoSelect.appendChild(option);
					} else {
						$log.log('Some other kind of source: ', sourceInfo);
					}
				}
			}

			navigator.getMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);

			navigator.getMedia({
				"audio" : false,
				"video" : {
					"mandatory" : {
						"minWidth" : 1280,
						"maxWidth" : 1280,
						"minHeight" : 180,
						"maxHeight" : 720
					},
					"optional" : []
				}
			}, function(stream) {
				if (navigator.mozGetUserMedia) {
					video.mozSrcObject = stream;
				} else {
					var vendorURL = window.URL || window.webkitURL;
					video.src = vendorURL.createObjectURL(stream);
				}
				video.play();
			}, function(err) {
				$log.log("An error occured! " + err);
			});

			video.addEventListener('canplay', function() {
				if (!streaming) {
					height = video.videoHeight / (video.videoWidth / width);

					// Firefox currently has a bug where the height can't be read from
					// the video, so we will make assumptions if this happens.

					if (isNaN(height)) {
						height = width / (4 / 3);
					}

					video.setAttribute('width', width);
					video.setAttribute('height', height);
					// canvas.setAttribute('width', width);
					// canvas.setAttribute('height', height);
					streaming = true;
				}
			}, false);

			$scope.clearImage = function() {
				var context = canvas.getContext('2d');
				context.fillRect(0, 0, canvas.width, canvas.height);

				var data = canvas.toDataURL('image/png');
				image.setAttribute('src', data);
			};

			// Capture a image by fetching the current contents of the video
			// and drawing it into a canvas, then converting that to a PNG
			// format data URL. By drawing it on an offscreen canvas and then
			// drawing that to the screen, we can change its size and/or apply
			// other changes before drawing it.

			$scope.captureImage = function() {
				var context = canvas.getContext('2d');
				if (width && height) {
					// canvas.width = width;
					// canvas.height = height;
					context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);

					var data = canvas.toDataURL('image/png');
					image.setAttribute('src', data);
				} else {
					$scope.clearImage();
				}
			};


			$scope.submitImage = function() {
				if (image.src) {
					var dataBase64 = canvas.toDataURL('image/webp');
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

		}
	};
}]);