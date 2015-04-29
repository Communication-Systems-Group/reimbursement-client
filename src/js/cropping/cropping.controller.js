app.controller('CroppingController', function($scope, $stateParams, $state) {
	"use strict";

	if($stateParams.imageUri === null) {
		// Illegal state: Cropping needs an image as parameter.
		$state.go("signature", {}, { location: "replace" });
	}
	$scope.imageUri = $stateParams.imageUri;
});