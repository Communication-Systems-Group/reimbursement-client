app.controller('ExpenseRedirectController', ['$state', '$stateParams', '$timeout', 'stateService', 'globalMessagesService', 'spinnerService', 'expenseRestService',

function($state, $stateParams, $timeout, stateService, globalMessagesService, spinnerService, expenseRestService) {
	"use strict";

	var expenseUid = $stateParams.uid;

	$timeout(function() {
		spinnerService.show("expenseRedirectSpinner");
		expenseRestService.getExpense(expenseUid).then(function(response) {

		var expense = response.data;
		var expenseState = expense.state;
		var expenseUsers = {
		userUid: expense.userUid,
		assignedManagerUid: expense.assignedManagerUid,
		financeAdminUid: expense.financeAdminUid
		};

		var viewDetails = stateService.getExpenseViewDetails(expenseState, expenseUsers);

		if(viewDetails.hasAccess) {
		$state.go(viewDetails.name, { expense: expense });
		}
		else {
		$state.go('dashboard');
		}

		}, function(response) {
		response.errorHandled = true;

		globalMessagesService.showErrorMd("reimbursement.globalMessage.expenseNotFoundException.title",
		"reimbursement.globalMessage.expenseNotFoundException.message").
		then()['finally'](function() {
		$state.go('dashboard');
		});

		})['finally'](function() {
			spinnerService.hide("expenseRedirectSpinner");
		});
	});

}]);
