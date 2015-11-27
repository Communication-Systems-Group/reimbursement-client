app.controller('GuestExpenseController', ['$scope', '$state', '$stateParams', 'expenseRestService', 'globalMessagesService', 'base64BinaryConverterService',

function ($scope, $state, $stateParams, expenseRestService, globalMessagesService, base64BinaryConverterService) {
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

		globalMessagesService.showErrorMd("reimbursement.globalMessage.guest.noExpenseFound.title",
			"reimbursement.globalMessage.guest.noExpenseFound.message");

		$state.go('welcome');
	});

	$scope.downloadPdf = function() {
		expenseRestService.getExpensePdf($scope.expenseUid).then(function(response) {
			// TODO crixx Refactoring (print-expense)
			var base64 = base64BinaryConverterService.toBase64FromJson(response.data);
			var blob = base64BinaryConverterService.toBinary(base64);

			if(window.navigator.msSaveOrOpenBlob) {
				window.navigator.msSaveOrOpenBlob(blob, blob.name);
			}
			else {
				window.open(blob.url, '_blank');
			}
		});
	};

}]);
