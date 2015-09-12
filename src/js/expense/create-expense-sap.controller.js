app.controller('CreateExpenseSapController', ['$scope', '$modalInstance', 'spinnerService', 'globalMessagesService', 'expenseRestService',

function($scope, $modalInstance, spinnerService, globalMessagesService, expenseRestService) {
	"use strict";

	$scope.accountingText = null;

	$scope.dismiss = $modalInstance.dismiss;

	$scope.nextStep = function() {
		if($scope.accountingText === null || typeof $scope.accountingText === "undefined" || $scope.accountingText.length < 5) {
			globalMessagesService.showInfoMd('reimbursement.expense.info.accountingTextMissingTitle',
				'reimbursement.expense.info.accountingTextMissingMessage');
		}
		else {
			spinnerService.show('spinnerCreateExpenseSap');

			expenseRestService.postCreateExpense($scope.accountingText).then(function(response) {
				$modalInstance.close({ uid: response.data.uid });
			})['finally'](function() {
				spinnerService.hide('spinnerCreateExpenseSap');
			});
		}
	};

}]);
