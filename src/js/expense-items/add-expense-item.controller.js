app.controller('AddExpenseItemController', ['$scope', '$modalInstance', 'globalMessagesService', 'listExpenseItemsRestService', 'expenseItemUid',

function($scope, $modalInstance, globalMessagesService, listExpenseItemsRestService, expenseItemUid) {
	"use strict";

	$scope.expenseItemUid = expenseItemUid;
	$scope.form = {};
	$scope.validatingFunction = null;

	$scope.dismissWithConfirmation = dismissWithConfirmation;
	$scope.submit = submitForm;

	function dismissWithConfirmation() {
		globalMessagesService.confirmWarning("reimbursement.add-expense-item.closeWarningTitle",
			"reimbursement.add-expense-item.closeWarningMessage").then(function() {

			listExpenseItemsRestService.deleteExpenseItem(expenseItemUid).then(undefined, function(){
				globalMessagesService.showGeneralError();
			})['finally'](function() {
				$modalInstance.dismiss();
			});
		});
	}

	function submitForm() {
		var formIsValid = $scope.validatingFunction($scope.form);
		if(formIsValid) {
			listExpenseItemsRestService.putExpenseItem(expenseItemUid, $scope.form).then(function() {
				$modalInstance.close();
			}, function() {
				globalMessagesService.showGeneralError();
			});
		}
		else {
			globalMessagesService.showWarning("reimbursement.expense.warning.formNotComplete.title",
			"reimbursement.expense.warning.formNotComplete.message");
		}
	}

}]);
