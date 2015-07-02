app.controller('DashboardController', ['$scope', 'dashboardRestService', '$state',

	function ($scope, dashboardRestService, $state) {
		'use strict';

		dashboardRestService.getExpenses()
			.success(function (result) {
				result = [
					{
						id: 1,
						date: '2015-06-01T16:30:00.000+02:00',
						accounting: 'Reise nach New York',
						total_costs: '5380.00',
						state: 'CREATED'
					},
					{
						id: 2,
						date: '2015-03-12T16:30:00.000+02:00',
						accounting: 'beschaffung von Hardware',
						total_costs: '1180.00',
						state: 'ACCEPTED'
					},
					{
						id: 3,
						date: '2015-05-22T16:30:00.000+02:00',
						accounting: 'Reise nach Bern',
						total_costs: '80.00',
						state: 'REJECTED'
					}
				];

				$scope.expenses = result;
			})
			.error(function (result) {

				if (result.type === 'ExpenseNotFoundException') {
					$scope.expenses = [];
				}

			});

		$scope.go = function(state,params) {
			$state.go(state,params);
		};

	}]);