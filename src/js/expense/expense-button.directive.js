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
			deleteExpenseCallback: '=?'
		},
		templateUrl: 'expense/expense-button.tpl.html',
		link: function ($scope) {

			$scope.details = stateService.getExpenseViewDetails($scope.expenseState, $scope.expenseUsers);

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
