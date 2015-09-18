app.controller('AdminPoolController', ['$scope', 'administrationRestService',

function($scope, administrationRestService) {
	'use strict';
	$scope.roles = [];
	$scope.expenses = [];
	$scope.costCategories = [];

	administrationRestService.getRoles().then(function(response) {
		$scope.roles = response.data;
	});

	administrationRestService.getCostCategories().then(function(response) {
		$scope.costCategories = response.data;
	});

	$scope.search = function() {
		administrationRestService.search().then(function(response) {
		$scope.expenses = response.data;
		});
	};
}]);
