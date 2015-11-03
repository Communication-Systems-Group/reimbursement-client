app.controller('CreateExpenseSapController', ['$scope', '$uibModalInstance', 'spinnerService', 'globalMessagesService', 'expenseRestService',

function($scope, $uibModalInstance, spinnerService, globalMessagesService, expenseRestService) {
	"use strict";

	$scope.accountingText = null;

	$scope.dismiss = $uibModalInstance.dismiss;

	$scope.nextStep = function() {
		if($scope.accountingText === null || typeof $scope.accountingText === "undefined" || $scope.accountingText.length < 5) {
			globalMessagesService.showInfoMd('reimbursement.expense.info.accountingTextMissingTitle',
				'reimbursement.expense.info.accountingTextMissingMessage');
		}
		else {
			spinnerService.show('spinnerCreateExpenseSap');

			expenseRestService.postCreateExpense($scope.accountingText).then(function(response) {
				$uibModalInstance.close({ uid: response.data.uid });
			})['finally'](function() {
				spinnerService.hide('spinnerCreateExpenseSap');
			});
		}
	};

}]);
