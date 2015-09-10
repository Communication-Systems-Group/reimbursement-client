app.controller('AddExpenseItemController', ['$scope', '$modalInstance', 'globalMessagesService', 'spinnerService', 'expenseItemsRestService', 'expenseItemUid',

function($scope, $modalInstance, globalMessagesService, spinnerService, expenseItemsRestService, expenseItemUid) {
	"use strict";

	$scope.expenseItemUid = expenseItemUid;
	$scope.form = {};
	$scope.validatingFunction = null;

	$scope.dismissWithConfirmation = dismissWithConfirmation;
	$scope.submit = submitForm;

	function dismissWithConfirmation() {
		globalMessagesService.confirmWarning("reimbursement.add-expense-item.closeWarningTitle",
			"reimbursement.add-expense-item.closeWarningMessage").then(function() {

			expenseItemsRestService.deleteExpenseItem(expenseItemUid).then()['finally'](function() {
				$modalInstance.dismiss();
			});
		});
	}

	function submitForm() {
		var formIsValid = $scope.validatingFunction($scope.form);
		if(formIsValid) {
			spinnerService.show('spinnerExpenseItemForm');
			$scope.hideClose = true;
			expenseItemsRestService.putExpenseItem(expenseItemUid, $scope.form).then(function() {
				$modalInstance.close();
			})['finally'](function() {
				$scope.hideClose = false;
				spinnerService.hide('spinnerExpenseItemForm');
			});
		}
		else {
			globalMessagesService.showInfo("reimbursement.expense.warning.formNotComplete.title",
			"reimbursement.expense.warning.formNotComplete.message");
		}
	}

}]);
