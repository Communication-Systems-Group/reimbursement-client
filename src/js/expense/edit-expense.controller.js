app.controller('EditExpenseController', ['$scope', '$state', '$stateParams', '$timeout', '$uibModal', 'spinnerService', 'globalMessagesService', 'expenseRestService',

function($scope, $state, $stateParams, $timeout, $uibModal, spinnerService, globalMessagesService, expenseRestService) {
	"use strict";

	$scope.expense = $stateParams.expense;
	$scope.expenseItems = [];

	$scope.submitButtonShown = false;

	$scope.$watch('expenseItems', function(newValue) {
		$scope.submitButtonShown = false;
		for(var i=0; i<newValue.length; i++) {
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

	$scope.submitToManager = function() {
		if(!$scope.submitButtonDisabled) {

			globalMessagesService.confirmInfoMd('reimbursement.expense.submitInfoTitle',
				'reimbursement.expense.submitInfoMessage').then(function() {

				spinnerService.show('spinnerCreateExpense');
				expenseRestService.assignToManager($scope.expense.uid).then(function() {

					$state.go('dashboard');

				})['finally'](function() {
					spinnerService.hide('spinnerCreateExpense');
				});
			});

		}
	};

}]);
