app.controller('CreateExpenseController', ['$scope', '$state', '$stateParams', '$timeout', 'USER', 'spinnerService', 'globalMessagesService', 'createExpenseRestService',

function($scope, $state, $stateParams, $timeout, USER, spinnerService, globalMessagesService, createExpenseRestService) {
	"use strict";

	$scope.expenseUid = $stateParams.uid;
	$scope.expenseItems = [];

	$scope.USER = USER;

	$scope.submitButtonShown = false;
	$scope.professors = [];

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

				spinnerService.show('spinnerCreateExpenseStep2');
				createExpenseRestService.assignToProf($scope.expenseUid).then(function() {

					$state.go('dashboard');

				}, function() {
					globalMessagesService.showGeneralError();
				})['finally'](function() {
					spinnerService.hide('spinnerCreateExpenseStep2');
				});
			});

		}
	};

}]);
