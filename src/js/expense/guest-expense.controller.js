app.controller('GuestExpenseController', ['$scope', '$state', '$stateParams', 'expenseRestService', 'globalMessagesService', 'base64BinaryConverterService',

function ($scope, $state, $stateParams, expenseRestService, globalMessagesService, base64BinaryConverterService) {
	"use strict";

	$scope.expenseUid = $stateParams.token;
	$scope.expenseItems = [];
	$scope.expenseState = '';
	$scope.showListExpenseItems = false;
	$scope.pdfBlob = null;
	$scope.isIE = (window.navigator.msSaveOrOpenBlob) ? true : false;

	expenseRestService.getExpensePdf($scope.expenseUid).then(function(response) {
		// TODO crixx Refactoring (print-expense)
		var base64 = base64BinaryConverterService.toBase64FromJson(response.data);
		$scope.pdfBlob = base64BinaryConverterService.toBinary(base64);
	});

	expenseRestService.getExpense($scope.expenseUid).then(function(response) {
		$scope.showListExpenseItems = true;
		$scope.expenseAccountingText = response.data.accounting;
		$scope.expenseState = response.data.state;

	}, function(response) {
		response.errorHandled = true;

		globalMessagesService.showErrorMd("reimbursement.globalMessage.guest.noExpenseFoundTitle",
			"reimbursement.globalMessage.guest.noExpenseFoundMessage");

		$state.go('welcome');
	});

	$scope.downloadIE = function() {
		window.navigator.msSaveOrOpenBlob($scope.pdfBlob, $scope.pdfBlob.name);
	};

}]);
