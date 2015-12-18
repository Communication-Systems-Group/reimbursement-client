app.controller('AddExpenseItemController', ['$scope', '$uibModalInstance', 'globalMessagesService', 'spinnerService', 'expenseItemsRestService', 'expenseItem', '$filter',

function($scope, $uibModalInstance, globalMessagesService, spinnerService, expenseItemsRestService, expenseItem, $filter) {
	"use strict";

	$scope.expenseItem = expenseItem;
	$scope.form = {};
	$scope.formExpenseItem = {};
	$scope.validate = null;

	$scope.dismissWithConfirmation = dismissWithConfirmation;
	$scope.submit = submitForm;

	function dismissWithConfirmation() {
		globalMessagesService.confirmWarning("reimbursement.globalMessage.expenseItem.closeWarningTitle",
		"reimbursement.globalMessage.expenseItem.closeWarningMessage").then(function() {

			expenseItemsRestService.deleteExpenseItem(expenseItem.uid).then()['finally'](function() {
				$uibModalInstance.dismiss();
			});
		});
	}

	function submitForm() {
		var formIsValid = $scope.validate();
		if(formIsValid && !$scope.formExpenseItem.$invalid && $scope.formExpenseItem.$dirty) {
			spinnerService.show('spinnerExpenseItemForm');
			$scope.hideClose = true;

			var data = $scope.form;
			data.date = $filter('getISODate')(data.date);

			expenseItemsRestService.putExpenseItem(expenseItem.uid, data).then(function() {
				$uibModalInstance.close();
			})['finally'](function() {
				$scope.hideClose = false;
				spinnerService.hide('spinnerExpenseItemForm');
			});
		}
		else {
			globalMessagesService.showInfo("reimbursement.globalMessage.expense.warning.formNotCompleteTitle",
			"reimbursement.globalMessage.expense.warning.formNotCompleteMessage");
		}
	}

}]);
