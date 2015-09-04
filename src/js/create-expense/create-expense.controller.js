app.controller('CreateExpenseController', ['$scope', '$state', 'globalMessagesService', 'createExpenseRestService',

function($scope, $state, globalMessagesService, createExpenseRestService) {
	"use strict";

	$scope.accountingText = "";

	$scope.cancel = function() {
		$state.go('dashboard');
	};

	$scope.nextStep = function() {
		if($scope.accountingText === "" || $scope.accountingText.length < 5) {
			globalMessagesService.showInfo('reimbursement.expense.info.accountingTextMissingTitle',
				'reimbursement.expense.info.accountingTextMissingMessage');
		}
		else {
			createExpenseRestService.postCreateExpense($scope.accountingText).then(function(response) {
				$state.go('edit-expense', { uid: response.data.uid });
			}, function() {
				globalMessagesService.showGeneralError();
			});
		}
	};

}]);
