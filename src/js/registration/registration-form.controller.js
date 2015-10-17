app.controller('RegistrationFormController', ['$scope', '$state',

function($scope, $state) {
	"use strict";

	$scope.submit = function() {
		$state.go('registrationSignature');
	};

}]);
