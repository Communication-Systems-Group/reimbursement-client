app.directive("fileread", ['$timeout',

function($timeout) {
	"use strict";

	return {
		restrict: 'A',
		scope: false,
		link: function($scope, element, attrs) {
			if(typeof $scope.fileread === "undefined") {
				$scope.fileread = {};
			}

			element.on('change', function(event) {
				$timeout(function() {
					$scope.fileread.isCurrentlyUploading = true;

					var filereader = new window.FileReader();
					var file = event.target.files[0];
					filereader.onload = function(event) {
						$timeout(function() {
							var name = attrs.fileread;
							$scope.fileread[name] = event.target.result;
							$scope.fileread.isCurrentlyUploading = false;
						});
					};
					filereader.readAsArrayBuffer(file);
				});
			});
		}
	};
}]);
