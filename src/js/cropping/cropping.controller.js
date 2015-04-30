app.controller('CroppingController', function($scope, $stateParams, $state, spinnerService, croppingRestService) {
	"use strict";

	if($stateParams.imageUri === null) {
		// Illegal state: Cropping needs an image as parameter.
		$state.go("signature", {}, { location: "replace" });
	}
	$scope.imageUri = $stateParams.imageUri;

	$scope.dimensions = {};
	$scope.hasDimensions = false;

	$scope.$watch('dimensions', function() {
		if(typeof $scope.dimensions.width === "undefined" || $scope.dimensions.width < 40 || $scope.dimensions.height < 30) {
			$scope.hasDimensions = false;
		}
		else {
			$scope.hasDimensions = true;
		}
	});

	$scope.submit = function() {
		if($scope.hasDimensions) {
			spinnerService.show('spinnerCroppingSubmit');

			croppingRestService.postSignatureCropping($scope.dimensions).then(function() {
				goToNextPage();
			}, function() {
				// TODO sebi | exception?
			})['finally'](function() {
				spinnerService.hide('spinnerCroppingSubmit');
			});
		}
	};

	function goToNextPage() {
		$state.go('dashboard');
	}
});
