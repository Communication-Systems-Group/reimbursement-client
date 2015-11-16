app.controller('RegistrationCroppingController', ['$scope', '$state', '$stateParams', 'USER', 'loginRestService',

function($scope, $state, $stateParams, USER, loginRestService) {
	"use strict";

	$scope.image = $stateParams.imageUri;

	if ($stateParams.imageUri === null) {
		// Illegal state: Cropping needs an image as parameter.
		$state.go("registrationSignature");
	}

	$scope.submit = function() {
		loginRestService.getUser().then(function(response) {
			var data = response.data;
			for(var key in data) {
				if(data.hasOwnProperty(key)) {
					USER[key] = data[key];
				}
			}

			$state.go('dashboard');
		});
	};

}]);
