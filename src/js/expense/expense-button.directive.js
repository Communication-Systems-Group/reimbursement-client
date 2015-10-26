app.directive('expenseButton', ['$state', 'stateService', 'expenseRestService', 'globalMessagesService',

function($state, stateService, expenseRestService, globalMessagesService) {
	"use strict";

	return {
		restrict: 'E',
		replace: true,
		scope: {
			expenseUid: '=',
			assignToMeCallback: '=',
			deleteExpenseCallback: '='
		},
		templateUrl: 'expense/expense-button.tpl.html',
		link: function ($scope) {

			stateService.getExpenseViewDetails($scope.expenseUid).then(function(viewDetails) {
				$scope.details = viewDetails;
			});

			$scope.assignToMe = function() {
				globalMessagesService.confirmInfo('reimbursement.expense.confirmAssignTitle',
				'reimbursement.expense.confirmAssignMessage').then(function() {
					expenseRestService.assignToMe($scope.expenseUid).then($scope.assignToMeCallback);
				});
			};

			$scope.deleteExpense = function() {
				globalMessagesService.confirmWarning('reimbursement.expense.confirmDeleteTitle',
				'reimbursement.expense.confirmDeleteMessage').then(function() {
					expenseRestService.deleteExpense($scope.expenseUid).then($scope.deleteExpenseCallback);
				});
			};

		}
	};

}]);
