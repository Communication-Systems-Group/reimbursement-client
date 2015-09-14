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
		if (USER.hasRole('FINANCE_ADMIN') || USER.hasRole('PROF')) {
			$scope.showReviewSection = true;
			myReviewExpenses = dashboardRestService.getReviewExpenses();
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

		// ordering of table
		$scope.stateOrdering = function(expense) {
			var states = [
				"DRAFT",
				"REJECTED",
				"ACCEPTED",
				"ASSIGNED_TO_PROFESSOR",
				"ASSIGNED_TO_FINANCE_ADMIN",
				"PRINTED"
			];
			var stateNr = states.length - states.indexOf(expense.state);
			var shortDate = (expense.date+"").substring(0, (expense.date+"").length - 3);
			return parseInt("-" + stateNr + shortDate, 10);
		};
	}
]);