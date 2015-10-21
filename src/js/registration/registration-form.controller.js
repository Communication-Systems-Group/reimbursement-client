app.controller('RegistrationFormController', ['$scope', '$state',

function($scope, $state) {
	"use strict";

	$scope.next = function() {
		$state.go('registrationSignature');
	};

}]);
