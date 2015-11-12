app.controller('AddExpenseItemController', ['$scope', '$uibModalInstance', 'globalMessagesService', 'spinnerService', 'expenseItemsRestService', 'expenseItemUid', '$filter',

function($scope, $uibModalInstance, globalMessagesService, spinnerService, expenseItemsRestService, expenseItemUid, $filter) {
	"use strict";

	$scope.expenseItemUid = expenseItemUid;
	$scope.form = {};
	$scope.formExpenseItem = {};
	$scope.validate = null;

	$scope.dismissWithConfirmation = dismissWithConfirmation;
	$scope.submit = submitForm;

	function dismissWithConfirmation() {
		globalMessagesService.confirmWarning("reimbursement.expenseItem.closeWarningTitle",
		"reimbursement.expenseItem.closeWarningMessage").then(function() {

			expenseItemsRestService.deleteExpenseItem(expenseItemUid).then()['finally'](function() {
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

			expenseItemsRestService.putExpenseItem(expenseItemUid, data).then(function() {
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
