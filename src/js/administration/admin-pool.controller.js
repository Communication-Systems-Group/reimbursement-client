app.controller('AdminPoolController', ['$scope', 'administrationRestService',

function($scope, administrationRestService) {
	'use strict';
	$scope.roles = [];
	$scope.expenses = [];

	administrationRestService.getRoles().then(function(response) {
		$scope.roles = response.data;
	});

	$scope.search = function() {
		administrationRestService.search().then(function(response) {
		$scope.expenses = response.data;
		});
	};
}]);
