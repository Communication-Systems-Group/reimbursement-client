app.controller('ExpenseRedirectController', ['$state', '$stateParams', '$timeout', 'stateService', 'globalMessagesService', 'spinnerService',

function($state, $stateParams, $timeout, stateService, globalMessagesService, spinnerService) {
	"use strict";

	var expenseUid = $stateParams.uid;

	$timeout(function(){
		spinnerService.show("expenseRedirectSpinner");
	});

	stateService.getExpenseViewDetails(expenseUid).then(function(viewDetails) {
		spinnerService.hide("expenseRedirectSpinner");
		if(viewDetails.hasAccess) {
			$state.go(viewDetails.name, { uid: expenseUid });
		}
		else {
			$state.go('dashboard');
		}
	});

}]);
