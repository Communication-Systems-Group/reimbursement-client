app.controller('GuestExpenseController', ['$scope', '$state', '$stateParams', 'expenseRestService', 'globalMessagesService',

function ($scope, $state, $stateParams, expenseRestService, globalMessagesService) {
	"use strict";

	$scope.expenseUid = $stateParams.token;
	$scope.expenseItems = [];
	$scope.expenseState = '';
	$scope.showListExpenseItems = false;

	expenseRestService.getExpense($scope.expenseUid).then(function(response) {
		$scope.showListExpenseItems = true;
		$scope.expenseAccountingText = response.data.accounting;
		$scope.expenseState = response.data.state;

	}, function(response) {
		response.errorHandled = true;
		globalMessagesService.showErrorMd("reimbursement.globalMessages.guest.noExpenseFound.title",
			"reimbursement.globalMessages.guest.noExpenseFound.message");
		$state.go('welcome');

	});

}]);
