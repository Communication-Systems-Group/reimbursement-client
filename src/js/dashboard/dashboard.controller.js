app.controller('DashboardController', ['$scope', 'dashboardRestService', 'globalMessagesService', '$filter', '$state', 'expenseRestService',

	function ($scope, dashboardRestService, globalMessagesService, $filter, $state, expenseRestService) {
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

		$scope.addExpense = function () {
			expenseRestService.postExpense({bookingText: 'dghgh', assignedManagerUid: 'dfghdfgh', state: 'CREATED'})
				.success(function (response) {
					$state.go('expense', {id: response.uid});
				})
				.error(function () {
					$filter('translate')('reimbursement.error.title');
					$filter('translate')('reimbursement.error.body');
				});
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