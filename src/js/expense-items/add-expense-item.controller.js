app.controller('AddExpenseItemController', ['$scope', '$modalInstance', 'globalMessagesService', 'expenseItemsRestService', 'expenseItemUid',

function($scope, $modalInstance, globalMessagesService, expenseItemsRestService, expenseItemUid) {
	"use strict";

	$scope.expenseItemUid = expenseItemUid;
	$scope.form = {};
	$scope.validatingFunction = null;

	$scope.dismissWithConfirmation = dismissWithConfirmation;
	$scope.submit = submitForm;

	function dismissWithConfirmation() {
		globalMessagesService.confirmWarning("reimbursement.add-expense-item.closeWarningTitle",
			"reimbursement.add-expense-item.closeWarningMessage").then(function() {

			expenseItemsRestService.deleteExpenseItem(expenseItemUid).then(undefined, function(){
				globalMessagesService.showGeneralError();
			})['finally'](function() {
				$modalInstance.dismiss();
			});
		});
	}

	function submitForm() {
		var formIsValid = $scope.validatingFunction($scope.form);
		if(formIsValid) {
			expenseItemsRestService.putExpenseItem(expenseItemUid, $scope.form).then(function() {
				$modalInstance.close();
			}, function() {
				globalMessagesService.showGeneralError();
			});
		}
		else {
			globalMessagesService.showInfo("reimbursement.expense.warning.formNotComplete.title",
			"reimbursement.expense.warning.formNotComplete.message");
		}
	}

}]);
