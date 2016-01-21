app.controller('DashboardController', ['$scope', '$state', '$uibModal', 'USER', 'expenseRestService', 'stateService', 'globalMessagesService',

function($scope, $state, $uibModal, USER, expenseRestService, stateService, globalMessagesService) {
	'use strict';

	$scope.user = USER;
	$scope.myExpenses = [];
	$scope.myReviewExpenses = [];
	$scope.showingMyExpenseSpinner = true;
	$scope.showingReviewsSpinner = true;

	$scope.showReviewSection = false;
	if (USER.hasRole('FINANCE_ADMIN') || USER.hasRole('PROF') || USER.hasRole('DEPARTMENT_MANAGER') || USER.hasRole('HEAD_OF_INSTITUTE')) {
		$scope.showReviewSection = true;
	}

	$scope.updateMyExpenses = function() {
		$scope.showingMyExpenseSpinner = true;
		expenseRestService.getMyExpenses().then(function(response) {
			$scope.myExpenses = response.data;
		})['finally'](function() {
			$scope.showingMyExpenseSpinner = false;
		});
	};
	$scope.updateMyExpenses();

	$scope.updateReviewExpenses = function() {
		window.console.log("blub");
		$scope.showingReviewsSpinner = true;
		expenseRestService.getReviewExpenses().then(function(response) {
			$scope.myReviewExpenses = response.data;
		})['finally'](function() {
			$scope.showingReviewsSpinner = false;
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
