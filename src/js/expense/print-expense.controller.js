app.controller('PrintExpenseController', ['$scope', '$state', '$stateParams', 'expenseRestService', 'globalMessagesService', 'base64BinaryConverterService',

function($scope, $state, $stateParams, expenseRestService, globalMessagesService, base64BinaryConverterService) {
	"use strict";

	$scope.expenseUid = $stateParams.uid;
	$scope.expenseItems = [];
	$scope.expenseState = '';
	$scope.showPdfFlag = false;

	expenseRestService.getExpense($scope.expenseUid).then(function(response) {
		$scope.expenseAccountingText = response.data.accounting;
		$scope.expenseState = response.data.state;
	}, function(response) {
		// error handled in list-expense-items.directive
		response.errorHandled = true;
	});

	$scope.showPdf = function() {
		globalMessagesService.confirmInfoMd("reimbursement.expense.printWithSignature", "reimbursement.expense.printWithSignatureMessage").then(function() {
			expenseRestService.getExpensePdf($scope.expenseUid).then();
		}, function() {
				expenseRestService.getExpensePdf($scope.expenseUid).then();
		});
	};

	$scope.showPdf2 = function() {
		expenseRestService.getExpensePdf($scope.expenseUid).then(function(response) {

			base64BinaryConverterService.toBase64FromJson(response.data, function(base64String) {
				$scope.pdfInBase64 = base64String;
				$scope.showPdfFlag = true;
			});
		});
	};

}]);
