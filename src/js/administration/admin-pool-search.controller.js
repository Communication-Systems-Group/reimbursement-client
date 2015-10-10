app.controller('AdminPoolSearchController', ['moment', '$scope', '$timeout', 'administrationRestService', '$filter',

function(moment, $scope, $timeout, administrationRestService, $filter) {
	'use strict';
	$scope.roles = [];
	$scope.expenses = [];
	$scope.form = {};
	$scope.searchConducted = false;
	$scope.form.startTime = moment().subtract(6, 'months').format('DD.MM.YYYY');
	$scope.form.endTime = moment().format('DD.MM.YYYY');

	administrationRestService.getRoles().then(function(response) {
		$scope.roles = response.data;
	});

	$scope.search = function() {
		var data = $scope.form;
		data.startTime = $filter('getISODate')(data.startTime);
		data.endTime = $filter('getISODate')(data.endTime);
		administrationRestService.search(data).then(function(response) {
			$scope.form.startTime = moment().subtract(6, 'months').format('DD.MM.YYYY');
			$scope.form.endTime = moment().format('DD.MM.YYYY');
			$scope.expenses = response.data;
			$scope.searchConducted = true;
		});
	};

	function createDatePickerStartTime() {
		jQuery('.datepicker-start-time').datetimepicker({
			format: 'DD.MM.YYYY',
			viewMode: 'months',
			allowInputToggle: true,
			maxDate: $scope.form.endTime,
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
			maxDate: moment(),
			calendarWeeks: true
		}).on('dp.hide', function() {
			$scope.form.endTime = jQuery('.datepicker-end-time').find('input').first().val();
			jQuery('.datepicker-start-time').datetimepicker('destroy');
			createDatePickerStartTime();
		});
	});

}]);
