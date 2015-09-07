app.controller('CreateExpenseController', ['$scope', '$state', 'spinnerService', 'globalMessagesService', 'createExpenseRestService',

function($scope, $state, spinnerService, globalMessagesService, createExpenseRestService) {
	"use strict";

	$scope.accountingText = null;

	$scope.cancel = function() {
		$state.go('dashboard');
	};

	$scope.nextStep = function() {
		if($scope.accountingText === null || typeof $scope.accountingText === "undefined" || $scope.accountingText.length < 5) {
			globalMessagesService.showInfoMd('reimbursement.expense.info.accountingTextMissingTitle',
				'reimbursement.expense.info.accountingTextMissingMessage');
		}
		else {
			spinnerService.show('spinnerCreateExpense');

			createExpenseRestService.postCreateExpense($scope.accountingText).then(function(response) {
				$state.go('create-expense-step2', { uid: response.data.uid });
			}, function() {
				globalMessagesService.showGeneralError();
			})['finally'](function() {
				spinnerService.hide('spinnerCreateExpense');
			});
		}
	};

}]);
