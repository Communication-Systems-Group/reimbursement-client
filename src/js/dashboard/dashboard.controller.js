app.controller('DashboardController', ['$scope', '$state', '$uibModal', 'USER', 'expenseRestService', 'stateService',

function($scope, $state, $uibModal, USER, expenseRestService, stateService) {
	'use strict';

	$scope.user = USER;
	$scope.myExpenses = [];
	$scope.myReviewExpenses = [];

	$scope.showReviewSection = false;
	if (USER.hasRole('FINANCE_ADMIN') || USER.hasRole('PROF') || USER.hasRole('DEPARTMENT_MANAGER')) {
		$scope.showReviewSection = true;
	}

	$scope.updateMyExpenses = function() {
		expenseRestService.getMyExpenses().then(function(response) {
			$scope.myExpenses = response.data;
		});
	};
	$scope.updateMyExpenses();

	$scope.updateReviewExpenses = function() {
		expenseRestService.getReviewExpenses().then(function(response) {
			$scope.myReviewExpenses = response.data;
		});
	};
	if ($scope.showReviewSection) {
		$scope.updateReviewExpenses();
	}

	$scope.addExpense = function() {
		var modalInstance = $uibModal.open({
			templateUrl: 'expense/create-expense-sap.tpl.html',
			controller: 'CreateExpenseSapController'
		});

		modalInstance.result.then(function(data) {
			$state.go('expense', {
				uid: data.uid
			});
		});
	};

	$scope.stateOrdering = function(expense) {
		return stateService.stateOrder(expense.state, expense.date, 'USER');
	};

	$scope.stateOrderingProfAdmin = function(expense) {
		if (USER.hasRole('PROF')) {
			return stateService.stateOrder(expense.state, expense.date, 'MANAGER');
		}
		if (USER.hasRole('FINANCE_ADMIN')) {
			return stateService.stateOrder(expense.state, expense.date, 'FINANCE_ADMIN');
		}
	};
}]);
