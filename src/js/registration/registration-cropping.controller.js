app.controller('RegistrationCroppingController', ['$scope', '$state', '$stateParams',

function($scope, $state, $stateParams) {
	"use strict";

	$scope.image = $stateParams.imageUri;

	if ($stateParams.imageUri === null) {
		// Illegal state: Cropping needs an image as parameter.
		$state.go("registrationSignature");
	}

	$scope.submit = function() {
		window.location.reload();
	};

}]);
