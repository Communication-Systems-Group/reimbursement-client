app.controller('DashboardController', ['$scope', '$state', '$uibModal', 'USER', 'expenseRestService', 'stateService', 'globalMessagesService', 'spinnerService',

function($scope, $state, $uibModal, USER, expenseRestService, stateService, globalMessagesService, spinnerService) {
	'use strict';

	$scope.user = USER;
	$scope.myExpenses = [];
	$scope.myReviewExpenses = [];

	$scope.showReviewSection = false;
	if (USER.hasRole('FINANCE_ADMIN') || USER.hasRole('PROF') || USER.hasRole('DEPARTMENT_MANAGER') || USER.hasRole('HEAD_OF_INSTITUTE')) {
		$scope.showReviewSection = true;
	}

	$scope.updateMyExpenses = function() {
		angular.element(document).ready(function () {
			spinnerService.show("spinnerMyExpensesSection");
		});
		expenseRestService.getMyExpenses().then(function(response) {
			$scope.myExpenses = response.data;
		})['finally'](function() {
			spinnerService.hide("spinnerMyExpensesSection");
		});
	};
	$scope.updateMyExpenses();

	$scope.updateReviewExpenses = function() {
		angular.element(document).ready(function () {
			spinnerService.show("spinnerReviewSection");
		});
		expenseRestService.getReviewExpenses().then(function(response) {
			$scope.myReviewExpenses = response.data;
		})['finally'](function() {
			spinnerService.hide("spinnerReviewSection");
		});
	};
	if ($scope.showReviewSection) {
		$scope.updateReviewExpenses();
	}

	$scope.addExpense = function() {
		if(!USER.manager) {
			globalMessagesService.showErrorMd('reimbursement.globalMessage.accountHasNoManagerTitle',
			'reimbursement.globalMessage.accountHasNoManagerMessage');
		}
		else {
			var modalInstance = $uibModal.open({
				templateUrl: 'expense/create-expense-sap.tpl.html',
				controller: 'CreateExpenseSapController'
			});

			modalInstance.result.then(function(data) {
				$state.go('expense', {
					uid: data.uid
				});
			});
		}
	};

	$scope.stateOrdering = function(expense) {
		return stateService.stateOrder(expense.state, expense.date, 'USER');
	};

	$scope.stateOrderingProfAdmin = function(expense) {
		if (USER.hasRole('PROF') || USER.hasRole('DEPARTMENT_MANAGER') || USER.hasRole('HEAD_OF_INSTITUTE')) {
			return stateService.stateOrder(expense.state, expense.date, 'MANAGER');
		}
		if (USER.hasRole('FINANCE_ADMIN')) {
			return stateService.stateOrder(expense.state, expense.date, 'FINANCE_ADMIN');
		}
	};
}]);
