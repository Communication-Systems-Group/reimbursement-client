app.controller('DashboardController', ['$scope', 'dashboardRestService', 'globalMessagesService', '$filter', '$state', 'expenseRestService', 'USER',

	function ($scope, dashboardRestService, globalMessagesService, $filter, $state, expenseRestService, USER) {
		'use strict';

		$scope.user = USER;

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
			expenseRestService.postExpense({bookingText: '', assignedManagerUid: USER.manager.uid, state: 'CREATED'})
				.success(function (response) {
					$state.go('expense', {id: response.uid});
				})
				.error(function () {
					$filter('translate')('reimbursement.error.title');
					$filter('translate')('reimbursement.error.body');
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