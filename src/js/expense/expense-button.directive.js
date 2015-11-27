app.directive('expenseButton', ['$state', '$filter', 'stateService', 'expenseRestService', 'globalMessagesService',

function($state, $filter, stateService, expenseRestService, globalMessagesService) {
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
				expenseRestService.getExpense($scope.expenseUid).then(function(response) {
					expenseRestService.getUserByUid(response.data.userUid).then(function(response) {
						var comment = $filter('commentValidation')('reimbursement.globalMessage.expense.resetMessage', response.data.language.toLowerCase());
						globalMessagesService.confirmInfo('reimbursement.globalMessage.expense.confirmTitle',
						'reimbursement.globalMessage.expense.confirmResetMessage').then(function() {
							expenseRestService.reject($scope.expenseUid, comment).then($scope.resetExpenseCallback);
						});
					});
				});
			};
		}
	};

}]);
