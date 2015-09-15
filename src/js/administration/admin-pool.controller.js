app.controller('AdminPoolController', ['$scope', 'administrationRestService',

function($scope, administrationRestService) {
	'use strict';
	$scope.roles = [];

	administrationRestService.getRoles().then(function(response) {
		$scope.roles = response.data;
		console.log($scope.roles);
	});
}]);
