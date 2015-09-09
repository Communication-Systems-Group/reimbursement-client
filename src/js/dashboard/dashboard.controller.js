app.controller('DashboardController', ['$scope', '$filter', '$state', '$modal', 'USER', 'globalMessagesService', 'dashboardRestService',

	function ($scope, $filter, $state, $modal, USER, globalMessagesService, dashboardRestService) {
		'use strict';

		$scope.user = USER;

		$scope.showReviewSection = false;

		function updateMyExpenses() {
			dashboardRestService.getMyExpenses().success(function (response) {
				$scope.myExpenses = response;
			}, function () {
				$scope.myExpenses = [];
			});
		}
		updateMyExpenses();

		var myReviewExpenses = null;
		if (USER.roles.indexOf('FINANCE_ADMIN') !== -1) {
			$scope.showReviewSection = true;
			myReviewExpenses = dashboardRestService.getReviewExpensesAsFinanceAdmin();
		}
		else if (USER.roles.indexOf('PROF') !== -1) {
			$scope.showReviewSection = true;
			myReviewExpenses = dashboardRestService.getReviewExpensesAsProf();
		}

		if (myReviewExpenses !== null) {
			myReviewExpenses.then(function (response) {
				$scope.myReviewExpenses = response.data;
			}, function () {
				$scope.myReviewExpenses = [];
			});
		}

		$scope.go = function (state, params) {
			$state.go(state, params);
		};

		$scope.addExpense = function () {
			var modalInstance = $modal.open({
				templateUrl: 'expense/create-expense-sap.tpl.html',
				controller: 'CreateExpenseSapController',
			});

			modalInstance.result.then(function(data) {
				$state.go('create-expense', { uid: data.uid });
			});
		};

		$scope.deleteExpense = function(uid) {
			globalMessagesService.confirmWarning('reimbursement.expense.confirmDeleteTitle',
			'reimbursement.expense.confirmDeleteMessage').then(function() {
				dashboardRestService.deleteExpense(uid).then(updateMyExpenses);
			});
		};
	}
]);