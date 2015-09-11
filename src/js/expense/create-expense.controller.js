app.controller('CreateExpenseController', ['$scope', '$state', '$stateParams', '$timeout', '$modal', 'spinnerService', 'globalMessagesService', 'createExpenseRestService',

function($scope, $state, $stateParams, $timeout, $modal, spinnerService, globalMessagesService, createExpenseRestService) {
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

	function updateExpenseTitle() {
		createExpenseRestService.getExpense($scope.expenseUid).then(function(response) {
			$scope.expenseAccountingText = response.data.accounting;
		}, function(response) {
			response.errorHandled = true;
			$state.go('dashboard');
		});
	}
	updateExpenseTitle();

	$scope.editExpenseSap = function() {
		var modalInstance = $modal.open({
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
		modalInstance.result.then(updateExpenseTitle);
	};

	$scope.submitToProf = function() {
		if(!$scope.submitButtonDisabled) {

			globalMessagesService.confirmInfoMd('reimbursement.expense.submitInfoTitle',
				'reimbursement.expense.submitInfoMessage').then(function() {

				spinnerService.show('spinnerCreateExpense');
				createExpenseRestService.assignToProf($scope.expenseUid).then(function() {

					$state.go('dashboard');

				})['finally'](function() {
					spinnerService.hide('spinnerCreateExpense');
				});
			});

		}
	};

}]);
