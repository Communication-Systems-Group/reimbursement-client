app.controller('ReviewExpenseController', ['$scope', '$state', '$stateParams', '$timeout', '$uibModal', 'spinnerService', 'globalMessagesService', 'expenseRestService',

function($scope, $state, $stateParams, $timeout, $uibModal, spinnerService, globalMessagesService, expenseRestService) {
	"use strict";

	$scope.expense = $stateParams.expense;
	$scope.expenseItems = [];

	$scope.submitButtonShown = false;

	$scope.$watch('expenseItems', function(newValue) {
		$scope.submitButtonShown = false;
		for(var i = 0; i < newValue.length; i++) {
			if(newValue[i].state !== "INITIAL") {
				$scope.submitButtonShown = true;
				break;
			}
		}
	});

	function updateExpense() {
		expenseRestService.getExpense($scope.expense.uid).then(function(response) {
			$scope.expense = response.data;
		});
	}

	$scope.editExpenseSap = function() {
		var modalInstance = $uibModal.open({
			templateUrl: 'expense/edit-expense-sap.tpl.html',
			controller: 'EditExpenseSapController',
			resolve: {
				accountingText: function() {
					return $scope.expense.accounting;
				},
				expenseUid: function() {
					return $scope.expense.uid;
				}
			}
		});
		modalInstance.result.then(updateExpense);
	};

	$scope.accept = function() {
		if(projectFieldsSet()) {
			var modalInstance = $uibModal.open({
				templateUrl: "expense/accept-expense.tpl.html",
				controller: "AcceptExpenseController",
				resolve: {
					expenseUid: function() {
						return $scope.expense.uid;
					}
				}
			});
			modalInstance.result.then(returnToDashboard);
		}
		else {
			globalMessagesService.showInfoMd('reimbursement.expense.info.projectTextMissingTitle',
				'reimbursement.expense.info.projectTextMissingMessage');
		}
	};

	$scope.decline = function() {
		var modalInstance = $uibModal.open({
			templateUrl: "expense/reject-expense.tpl.html",
			controller: "RejectExpenseController",
			resolve: {
				expenseUid: function() {
					return $scope.expense.uid;
				}
			}
		});
		modalInstance.result.then(returnToDashboard);
	};

	function projectFieldsSet() {
		var allprojectFieldsSet = true;
		for(var i = 0; i < $scope.expenseItems.length; i++) {
			if($scope.expenseItems[i].project === null) {
				allprojectFieldsSet = false;
			}
		}
		return allprojectFieldsSet;
	}

	function returnToDashboard() {
		$state.go('dashboard');
	}

}]);
