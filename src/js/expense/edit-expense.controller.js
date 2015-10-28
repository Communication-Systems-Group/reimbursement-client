app.controller('EditExpenseController', ['$scope', '$state', '$stateParams', '$timeout', '$uibModal', 'spinnerService', 'globalMessagesService', 'expenseRestService',

function($scope, $state, $stateParams, $timeout, $uibModal, spinnerService, globalMessagesService, expenseRestService) {
	"use strict";

	$scope.expenseUid = $stateParams.uid;
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
		expenseRestService.getExpense($scope.expenseUid).then(function(response) {
			$scope.expenseAccountingText = response.data.accounting;
			$scope.expense = response.data;
		});
	}
	updateExpense();

	$scope.editExpenseSap = function() {
		var modalInstance = $uibModal.open({
			templateUrl: 'expense/edit-expense-sap.tpl.html',
			controller: 'EditExpenseSapController',
			resolve: {
				accountingText: function() {
					return $scope.expenseAccountingText;
				},
				expenseUid: function() {
					return $scope.expenseUid;
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
				expenseRestService.assignToManager($scope.expenseUid).then(function() {

					$state.go('dashboard');

				})['finally'](function() {
					spinnerService.hide('spinnerCreateExpense');
				});
			});

		}
	};

}]);
