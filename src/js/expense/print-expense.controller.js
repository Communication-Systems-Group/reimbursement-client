app.controller('PrintExpenseController', ['$scope', '$sce', '$state', '$stateParams', 'expenseRestService', 'globalMessagesService',

function($scope, $sce, $state, $stateParams, expenseRestService, globalMessagesService) {
	"use strict";

	$scope.expenseUid = $stateParams.uid;
	$scope.expenseItems = [];
	$scope.expenseState = '';

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

		expenseRestService.showPdf($scope.expenseUid).then(function(response) {
			var file = new window.Blob([response.data], {
				type: 'application/pdf'
			});
			var fileURL = window.URL.createObjectURL(file);
			$scope.content = $sce.trustAsResourceUrl(fileURL);

		});
	};

}]);
