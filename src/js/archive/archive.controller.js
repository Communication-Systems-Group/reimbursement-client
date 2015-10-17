app.controller('ArchiveController', ['$scope', 'archiveRestService',

function($scope, archiveRestService) {
	'use strict';
	$scope.archivedExpenses = [];

	archiveRestService.getArchivedExpenses().then(function(response) {
		$scope.archivedExpenses = response.data;
	});
}]);
