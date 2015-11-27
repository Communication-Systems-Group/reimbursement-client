app.directive('expenseButton', ['$state', 'stateService', 'expenseRestService', 'globalMessagesService',

function($state, stateService, expenseRestService, globalMessagesService) {
	"use strict";

	return {
		restrict: 'E',
		replace: true,
		scope: {
			expenseUid: '=',
			expenseState: '=',
			expenseUsers: '=',
			assignToMeCallback: '=?',
			deleteExpenseCallback: '=?',
			resetExpenseCallback: '=?'
		},
		templateUrl: 'expense/expense-button.tpl.html',
		link: function ($scope) {

			$scope.details = stateService.getExpenseViewDetails($scope.expenseState, $scope.expenseUsers);

			$scope.assignToMe = function() {
				globalMessagesService.confirmInfo('reimbursement.globalMessage.expense.confirmTitle',
				'reimbursement.globalMessage.expense.confirmAssignMessage').then(function() {
					expenseRestService.assignToMe($scope.expenseUid).then($scope.assignToMeCallback);
				});
			};

			$scope.deleteExpense = function() {
				globalMessagesService.confirmWarning('reimbursement.globalMessage.expense.confirmTitle',
				'reimbursement.globalMessage.expense.confirmDeleteMessage').then(function() {
					expenseRestService.deleteExpense($scope.expenseUid).then($scope.deleteExpenseCallback);
				});
			};

			$scope.resetExpense = function() {
				globalMessagesService.confirmInfo('reimbursement.globalMessage.expense.confirmTitle',
				'reimbursement.globalMessage.expense.confirmResetMessage').then(function() {
					expenseRestService.reject($scope.expenseUid, "The expense has been reset.").then($scope.resetExpenseCallback);
				});
			};
		}
	};

}]);
