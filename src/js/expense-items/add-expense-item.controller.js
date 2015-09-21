app.controller('AddExpenseItemController', ['$scope', '$modalInstance', 'globalMessagesService', 'spinnerService', 'expenseItemsRestService', 'expenseItemUid', '$filter',

function($scope, $modalInstance, globalMessagesService, spinnerService, expenseItemsRestService, expenseItemUid, $filter) {
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

            var data = $scope.form;
            data.date = $filter('getISODate')(data.date);
			expenseItemsRestService.putExpenseItem(expenseItemUid, data).then(function() {
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
