app.directive('cropping', ['$state', 'spinnerService', 'croppingRestService',

function($state, spinnerService, croppingRestService) {
	"use strict";

	return {
		restrict: 'E',
		replace: true,
		templateUrl: 'cropping/cropping.directive.tpl.html',
		scope: {
			isRegistration: '=',
			finallyFunction: '=',
			image: '='
		},
		link: function($scope) {
			$scope.dimensions = {};
			$scope.hasDimensions = false;

			$scope.$watch('dimensions', function() {
				if ( typeof $scope.dimensions.width === "undefined" || $scope.dimensions.width < 40 || $scope.dimensions.height < 30) {
					$scope.hasDimensions = false;
				} else {
					$scope.hasDimensions = true;
				}
			});

			$scope.submit = function() {
				if ($scope.hasDimensions) {
					spinnerService.show('spinnerCroppingSubmit');

					croppingRestService.postSignatureCropping($scope.dimensions).then(function() {
						goToNextPage();

					})['finally'](function() {
						spinnerService.hide('spinnerCroppingSubmit');
					});
				}
			};

			function goToNextPage() {
				if(typeof $scope.finallyFunction !== "undefined" && $scope.finallyFunction !== null) {
					$scope.finallyFunction();
				}
			}
		}
	};

}]);
