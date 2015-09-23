app.controller('AdminPoolController', ['$scope', 'administrationRestService',

function($scope, administrationRestService) {
	'use strict';
	$scope.roles = [];
	$scope.expenses = [];
	$scope.form = {};

	administrationRestService.getRoles().then(function(response) {
		$scope.roles = response.data;
	});

	$scope.search = function() {
		administrationRestService.search($scope.form).then(function(response) {
			$scope.expenses = response.data;
		});
	};

}]);
