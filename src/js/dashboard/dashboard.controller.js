app.controller('DashboardController', ['$scope', 'dashboardRestService', 'globalMessagesService', '$filter', '$state',

	function ($scope, dashboardRestService, globalMessagesService, $filter, $state) {
		'use strict';

		function init() {
			dashboardRestService.getExpenses()
				.success(function (response) {
					$scope.expenses = response;
				})
				.error(function (response) {

					if (response.type === 'ExpenseNotFoundException') {
						$scope.expenses = [];
					}

				});
		}

		init();

		$scope.go = function (state, params) {
			$state.go(state, params);
		};

		/**
		 * Deletes an entire expense object from the server.
		 * @param uid
		 */
		$scope.deleteExpense = function (uid) {
			// ToDo confirmation
			dashboardRestService.deleteExpense(uid)
				.success(function () {
					globalMessagesService.showInfo($filter('translate')('reimbursement.success'), $filter('translate')('reimbursement.expense.delete.success'));
					init();
				})
				.error(function () {
					globalMessagesService.showError($filter('translate')('reimbursement.error'), $filter('translate')('reimbursement.expense.delete.error'));
				});

		};

		/**
		 * Complete an expense and send it to the next instance (prof) to review it.
		 * @param uid
		 */
		$scope.sendExpense = function (uid) {
			console.log(uid);
			// ToDo
		};

	}]);