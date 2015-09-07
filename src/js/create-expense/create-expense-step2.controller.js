app.controller('CreateExpenseStep2Controller', ['$scope', '$stateParams', 'USER', 'spinnerService', 'globalMessagesService', 'createExpenseRestService',

function($scope, $stateParams, USER, spinnerService, globalMessagesService, createExpenseRestService) {
	"use strict";

	$scope.expenseUid = $stateParams.uid;
	$scope.expenseItems = [];

	$scope.submitButtonDisabled = true;
	if(typeof USER.manager !== "undefined" && USER.manager !== null) {
		$scope.professorName = { professor: USER.manager.lastName };
	}
	else {
		$scope.professorName = { professor: null };
	}

	$scope.$watch('expenseItems', function(newValue) {
		$scope.submitButtonDisabled = true;
		for(var i=0; i<newValue.length; i++) {
			if(newValue[i].state !== "INITIAL") {
				$scope.submitButtonDisabled = false;
				break;
			}
		}
	});

	$scope.submitToProf = function() {
		if(!$scope.submitButtonDisabled) {
			globalMessagesService.confirmInfoMd('reimbursement.expense.submitInfoTitle',
				'reimbursement.expense.submitInfoMessage').then(function() {
				spinnerService.show('spinnerCreateExpense');
				createExpenseRestService.assignToProf($scope.expenseUid);
			}, function() {
				globalMessagesService.showGeneralError();
			})['finally'](function() {
				spinnerService.hide('spinnerCreateExpense');
			});
		}
	};

}]);
