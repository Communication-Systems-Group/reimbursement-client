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
			var data = {
				showSignature: true
			};
			expenseRestService.getExpensePdf($scope.expenseUid, data).then();

			// ToDo show sent document from server with signatur
		}, function() {
			var data = {
				showSignature: false
			};
			expenseRestService.getExpensePdf($scope.expenseUid, data).then();

			// ToDo show sent document from server without signature
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
