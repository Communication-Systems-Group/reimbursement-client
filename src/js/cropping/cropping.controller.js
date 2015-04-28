app.controller('CroppingController', function($scope, $stateParams) {
	"use strict";

	if($stateParams.imageUri === null) {
		// TODO sebi | download image when not transmitted
		throw new Error('Cropping needs an image as parameter.');
	}

	$scope.imageUri = $stateParams.imageUri;
});