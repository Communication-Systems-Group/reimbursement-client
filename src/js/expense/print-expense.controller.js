app.controller('PrintExpenseController', ['$scope', '$stateParams', '$window', 'THIS_HOST', 'spinnerService', 'expenseRestService', 'base64BinaryConverterService', 'globalMessagesService',

function($scope, $stateParams, $window, THIS_HOST, spinnerService, expenseRestService, base64BinaryConverterService, globalMessagesService) {
	"use strict";

	$scope.expense = $stateParams.expense;
	$scope.expenseItems = [];

	$scope.showPdf = function() {
		spinnerService.show('spinnerPrintExpense');

		if ($scope.expense.hasDigitalSignature === true || $scope.expense.state === 'PRINTED') {
			getExpensePdf();
		}
		else {
			var url = THIS_HOST + "/expense/guest/";
			expenseRestService.generatePdf($scope.expense.uid, url).then(function() {
				$scope.expense.state = 'PRINTED';
				getExpensePdf();
			});
		}
	};

	function getExpensePdf() {
		expenseRestService.getExpensePdf($scope.expense.uid).then(function(response) {
			// TODO Refactoring
			var base64 = base64BinaryConverterService.toBase64FromJson(response.data);
			var blob = base64BinaryConverterService.toBinary(base64);

			if (window.navigator.msSaveOrOpenBlob) {
				window.navigator.msSaveOrOpenBlob(blob, blob.name);
			}
			else {
				var newWin = window.open(blob.url, '_blank');
				if(!newWin || newWin.closed || typeof newWin.closed === 'undefined') {
					globalMessagesService.showErrorMd('reimbursement.globalMessage.warning',
						'reimbursement.globalMessage.popupBlockerDiscovered');
				}
			}

		})['finally'](function() {
			spinnerService.hide('spinnerPrintExpense');
			if($scope.expense.state === 'PRINTED') {
				globalMessagesService.confirmInfoMd('reimbursement.globalMessage.expense.info.archiveExpenseTitle',
					'reimbursement.globalMessage.expense.info.archiveExpenseMessage').then(function() {
						expenseRestService.archiveExpense($scope.expense.uid);
					});
			}
		});
	}
}]);
