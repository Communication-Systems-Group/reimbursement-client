app.controller('ArchiveController', ['$scope', '$filter', 'archiveRestService',

function($scope, $filter, archiveRestService) {
	'use strict';
	$scope.archivedExpenses = [];
	$scope.itemsPerPage = 15;
	$scope.pagedExpenses = [];
	$scope.currentPage = 1;

	archiveRestService.getArchivedExpenses().then(function(response) {
		$scope.archivedExpenses = response.data;
		sortItems();
		groupItemsToPages();
	});

	function sortItems() {
		$scope.archivedExpenses = $filter('orderBy')($scope.archivedExpenses, 'date', true);
	}

	function groupItemsToPages() {
		$scope.pagedExpenses = [];

		for (var i = 0; i < $scope.archivedExpenses.length; i++) {
			if (i % $scope.itemsPerPage === 0) {
				$scope.pagedExpenses[Math.floor(i / $scope.itemsPerPage) + 1] = [$scope.archivedExpenses[i]];
			} else {
				$scope.pagedExpenses[Math.floor(i / $scope.itemsPerPage) + 1].push($scope.archivedExpenses[i]);
			}
		}

		$scope.currentPage = 1;
	}

}]);
