app.controller('EditExpenseItemController', ['$scope', '$uibModalInstance', 'globalMessagesService', 'spinnerService', 'expenseItemsRestService', 'expenseItemUid', '$filter',

function($scope, $uibModalInstance, globalMessagesService, spinnerService, expenseItemsRestService, expenseItemUid, $filter) {
	"use strict";

	$scope.expenseItemUid = expenseItemUid;
	$scope.form = {};
	$scope.validatingFunction = null;

	$scope.dismissWithConfirmation = dismissWithConfirmation;
	$scope.submit = submitForm;

	function dismissWithConfirmation() {
		globalMessagesService.confirmWarning("reimbursement.expense-item.closeWarningEditTitle",
			"reimbursement.expense-item.closeWarningEditMessage").then(function() {

			$uibModalInstance.dismiss();
		});
	}

	function submitForm() {
		var formIsValid = $scope.validatingFunction($scope.form);
		if(formIsValid) {
			spinnerService.show('spinnerExpenseItemForm');
			$scope.hideClose = true;

			var data = $scope.form;
			data.date = $filter('getISODate')(data.date);
			expenseItemsRestService.putExpenseItem(expenseItemUid, $scope.form).then(function() {
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
