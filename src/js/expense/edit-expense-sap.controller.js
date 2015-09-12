app.controller('EditExpenseSapController', ['$scope', '$modalInstance', 'spinnerService', 'globalMessagesService', 'expenseRestService', 'accountingText', 'expenseUid',

function($scope, $modalInstance, spinnerService, globalMessagesService, expenseRestService, accountingText, expenseUid) {
	"use strict";

	$scope.dismiss = $modalInstance.dismiss;
	$scope.accountingText = accountingText;

	$scope.saveAccountingText = function() {
		if($scope.accountingText === null || typeof $scope.accountingText === "undefined" || $scope.accountingText.length < 5) {
			globalMessagesService.showInfoMd('reimbursement.expense.info.accountingTextMissingTitle',
				'reimbursement.expense.info.accountingTextMissingMessage');
		}
		else {
			spinnerService.show('spinnerEditExpenseSap');

			expenseRestService.putExpense(expenseUid, $scope.accountingText).then(function() {
				$modalInstance.close({ accountingText: $scope.accountingText });
			})['finally'](function() {
				spinnerService.hide('spinnerEditExpenseSap');
			});
		}
	};

}]);
