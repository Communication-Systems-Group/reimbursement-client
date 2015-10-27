app.controller('PrintExpenseController', ['$scope', '$state', '$stateParams', '$window', 'spinnerService', 'THIS_HOST', 'expenseRestService', 'base64BinaryConverterService',

function($scope, $state, $stateParams, $window, spinnerService, THIS_HOST, expenseRestService, base64BinaryConverterService) {
	"use strict";

	$scope.expenseUid = $stateParams.uid;
	$scope.expenseItems = [];
	$scope.expenseState = '';

	expenseRestService.getExpense($scope.expenseUid).then(function(response) {
		$scope.expenseAccountingText = response.data.accounting;
		$scope.expenseState = response.data.state;
		$scope.hasDigitalSignature = response.data.hasDigitalSignature;
	}, function(response) {
		// error handled in list-expense-items.directive
		response.errorHandled = true;
	});

	$scope.showPdf = function() {
			spinnerService.show('spinnerPrintExpense');
		if($scope.hasDigitalSignature === true || $scope.expenseState === 'PRINTED') {
			getExpensePdf();
		}
		else {
			var url = THIS_HOST + "/guest-view-expense/";
			expenseRestService.generatePdf($scope.expenseUid, url).then(getExpensePdf);
		}
	};

	function getExpensePdf() {
		expenseRestService.getExpensePdf($scope.expenseUid).then(function(response) {

			base64BinaryConverterService.toBase64FromJson(response.data, function(base64String) {
			$window.open(base64String, '_blank');
			});
		})['finally'](function() {
					spinnerService.hide('spinnerPrintExpense');
				});
	}

}]);
