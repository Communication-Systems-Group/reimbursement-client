app.controller('DashboardController', ['$scope', 'dashboardRestService', '$state',

	function ($scope, dashboardRestService, $state) {
		'use strict';

		dashboardRestService.getExpenses()
			.success(function (result) {
				$scope.expenses = result;
			})
			.error(function (result) {

				if (result.type === 'ExpenseNotFoundException') {
					$scope.expenses = [];
				}

			});

		$scope.go = function (state, params) {
			$state.go(state, params);
		};

		$scope.deleteExpense = function (uid) {
			// ToDo confirmation
			dashboardRestService.deleteExpense(uid);
		};

	}]);