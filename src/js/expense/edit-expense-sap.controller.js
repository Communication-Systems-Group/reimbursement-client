app.controller('EditExpenseSapController', ['$scope', '$uibModalInstance', 'spinnerService', 'globalMessagesService', 'expenseRestService', 'accountingText', 'expenseUid',

function($scope, $uibModalInstance, spinnerService, globalMessagesService, expenseRestService, accountingText, expenseUid) {
	"use strict";

	$scope.dismiss = $uibModalInstance.dismiss;
	$scope.accountingText = accountingText;
	$scope.formSAP = {};

	$scope.saveAccountingText = function() {
		if($scope.formSAP.$invalid || !$scope.formSAP.$dirty) {
			globalMessagesService.showInfoMd('reimbursement.globalMessage.expense.info.accountingTextMissingTitle',
				'reimbursement.globalMessage.expense.info.accountingTextMissingMessage');
		}
		else {
			spinnerService.show('spinnerEditExpenseSap');

			expenseRestService.putExpense(expenseUid, $scope.accountingText).then(function() {
				$uibModalInstance.close({ accountingText: $scope.accountingText });
			})['finally'](function() {
				spinnerService.hide('spinnerEditExpenseSap');
			});
		}
	};

}]);
