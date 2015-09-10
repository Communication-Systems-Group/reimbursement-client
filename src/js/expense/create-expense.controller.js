app.controller('CreateExpenseController', ['$scope', '$state', '$stateParams', '$timeout', 'spinnerService', 'globalMessagesService', 'createExpenseRestService',

function($scope, $state, $stateParams, $timeout, spinnerService, globalMessagesService, createExpenseRestService) {
	"use strict";

	$scope.expenseUid = $stateParams.uid;
	$scope.expenseItems = [];

	$scope.submitButtonShown = false;

	$scope.$watch('expenseItems', function(newValue) {
		$scope.submitButtonShown = false;
		for(var i=0; i<newValue.length; i++) {
			if(newValue[i].state !== "INITIAL") {
				$scope.submitButtonShown = true;
				break;
			}
		}
	});

	$scope.submitToProf = function() {
		if(!$scope.submitButtonDisabled) {

			globalMessagesService.confirmInfoMd('reimbursement.expense.submitInfoTitle',
				'reimbursement.expense.submitInfoMessage').then(function() {

				spinnerService.show('spinnerCreateExpense');
				createExpenseRestService.assignToProf($scope.expenseUid).then(function() {

					$state.go('dashboard');

				})['finally'](function() {
					spinnerService.hide('spinnerCreateExpense');
				});
			});

		}
	};

}]);
