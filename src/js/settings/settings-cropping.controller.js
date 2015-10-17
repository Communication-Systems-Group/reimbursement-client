app.controller('SettingsCroppingController', ['$scope', '$state', '$stateParams',

function($scope, $state, $stateParams) {
	"use strict";

	$scope.image = $stateParams.imageUri;

	if ($stateParams.imageUri === null) {
		// Illegal state: Cropping needs an image as parameter.
		$state.go("settingsSignature");
	}

	$scope.submit = function() {
		$state.go('settings');
	};

}]);
