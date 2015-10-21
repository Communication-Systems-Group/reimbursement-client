app.controller('RegistrationFormController', ['$scope', '$state', 'USER',

function($scope, $state, USER) {
	"use strict";

	$scope.next = function() {
		$state.go('registrationSignature');
	};

	$scope.USER = USER;

}]);
