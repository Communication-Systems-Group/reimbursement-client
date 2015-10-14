app.controller('AdminPoolSearchController', ['moment', '$scope', '$timeout', 'administrationRestService', '$filter',

function(moment, $scope, $timeout, administrationRestService, $filter) {
	'use strict';
	$scope.roles = [];
	$scope.form = {};
	$scope.searchConducted = false;
	$scope.form.startTime = moment().subtract(6, 'months').format('DD.MM.YYYY');
	$scope.form.endTime = moment().format('DD.MM.YYYY');

	$scope.sortingOrder = '';
	$scope.reverse = false;
	$scope.filteredItems = [];
	$scope.groupedItems = [];
	$scope.itemsPerPage = 5;
	$scope.pagedItems = [];
	$scope.currentPage = 0;
	$scope.items = [];

	administrationRestService.getRoles().then(function(response) {
		$scope.roles = response.data;
	});

	// init the filtered items
	$scope.search = function() {
		var data = $scope.form;
		data.startTime = $filter('getISODate')(data.startTime);
		data.endTime = $filter('getISODate')(data.endTime);
		administrationRestService.search(data).then(function(response) {
			$scope.form.startTime = moment().subtract(6, 'months').format('DD.MM.YYYY');
			$scope.form.endTime = moment().format('DD.MM.YYYY');
			$scope.items = response.data;
			$scope.searchConducted = true;

			$scope.filteredItems = $filter('filter')($scope.items, function(item) {
				for (var attr in item) {
					if (searchMatch(item[attr], $scope.query)) {
						return true;
					} else {
						return false;
					}
				}
			});
			// take care of the sorting order
			if ($scope.sortingOrder !== '') {
				$scope.filteredItems = $filter('orderBy')($scope.filteredItems, $scope.sortingOrder, $scope.reverse);
			}
			$scope.currentPage = 0;
			// now group by pages
			$scope.groupToPages();
		});
	};

	function createDatePickerStartTime() {
		jQuery('.datepicker-start-time').datetimepicker({
			format: 'DD.MM.YYYY',
			viewMode: 'months',
			allowInputToggle: true,
			maxDate: $filter('getISODate')($scope.form.endTime),
			calendarWeeks: true
		}).on('dp.hide', function() {
			$scope.form.startTime = jQuery('.datepicker-start-time').find('input').first().val();
		});
	}

	$timeout(function() {
		createDatePickerStartTime();
		jQuery('.datepicker-end-time').datetimepicker({
			format: 'DD.MM.YYYY',
			viewMode: 'months',
			allowInputToggle: true,
			maxDate: moment().valueOf(),
			calendarWeeks: true
		}).on('dp.hide', function() {
			$scope.form.endTime = jQuery('.datepicker-end-time').find('input').first().val();
			jQuery('.datepicker-start-time').datetimepicker('destroy');
			jQuery('.datepicker-start-time').datetimepicker("change", { maxDate: $filter('getISODate')($scope.form.endTime) });
		});
	});

	function searchMatch(haystack, needle) {
		if (!needle) {
			return true;
		} else {
			return haystack.toLowerCase().indexOf(needle.toLowerCase()) !== -1;
		}
	}

	// calculate page in place
	$scope.groupToPages = function() {
		$scope.pagedItems = [];

		for (var i = 0; i < $scope.filteredItems.length; i++) {
			if (i % $scope.itemsPerPage === 0) {
				$scope.pagedItems[Math.floor(i / $scope.itemsPerPage)] = [$scope.filteredItems[i]];
			} else {
				$scope.pagedItems[Math.floor(i / $scope.itemsPerPage)].push($scope.filteredItems[i]);
			}
		}
	};

	$scope.range = function(start, end) {
		var ret = [];
		if (!end) {
			end = start;
			start = 0;
		}
		for (var i = start; i < end; i++) {
			ret.push(i);
		}
		return ret;
	};

	$scope.prevPage = function() {
		if ($scope.currentPage > 0) {
			$scope.currentPage--;
		}
	};

	$scope.nextPage = function() {
		if ($scope.currentPage < $scope.pagedItems.length - 1) {
			$scope.currentPage++;
		}
	};

	$scope.setPage = function() {
		$scope.currentPage = this.n;
	};

	// change sorting order
	$scope.sort_by = function(newSortingOrder) {
		if ($scope.sortingOrder === newSortingOrder) {
			$scope.reverse = !$scope.reverse;
		}

		$scope.sortingOrder = newSortingOrder;

		// icon setup
		jQuery('th i').each(function() {
			// icon reset
			jQuery(this).removeClass().addClass('fa fa-sort');
		});
		if ($scope.reverse) {
			jQuery('th.' + newSortingOrder + ' i').removeClass().addClass('fa fa-sort-asc');
		} else {
			jQuery('th.' + newSortingOrder + ' i').removeClass().addClass('fa fa-sort-desc');
		}
	};

}]);
