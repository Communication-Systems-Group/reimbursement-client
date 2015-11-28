app.controller('EditExpenseItemController', ['$scope', '$uibModalInstance', 'globalMessagesService', 'spinnerService', 'expenseItemsRestService', 'expenseItem', '$filter',

function($scope, $uibModalInstance, globalMessagesService, spinnerService, expenseItemsRestService, expenseItem, $filter) {
	"use strict";

	$scope.expenseItem = expenseItem;
	$scope.form = {};
	$scope.formExpenseItem = {};
	$scope.validate = null;

	$scope.dismissWithConfirmation = dismissWithConfirmation;
	$scope.submit = submitForm;

	function dismissWithConfirmation() {
		globalMessagesService.confirmWarning("reimbursement.expenseItem.closeWarningEditTitle",
		"reimbursement.expenseItem.closeWarningEditMessage").then(function() {

			$uibModalInstance.dismiss();
		});
	}

	function submitForm() {
		var formIsValid = $scope.validate();
		if(formIsValid && !$scope.formExpenseItem.$invalid) {
			spinnerService.show('spinnerExpenseItemForm');
			$scope.hideClose = true;

			var data = $scope.form;
			data.date = $filter('getISODate')(data.date);
			expenseItemsRestService.putExpenseItem(expenseItem.uid, $scope.form).then(function() {
				$uibModalInstance.close();
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
