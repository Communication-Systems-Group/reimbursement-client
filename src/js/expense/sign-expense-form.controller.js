app.controller('SignExpenseFormController', ['$scope', '$uibModalInstance', '$timeout', 'THIS_HOST', 'digitallySignExpenseService', 'spinnerService', 'expenseRestService', 'globalMessagesService', 'base64BinaryConverterService', 'expense',

function($scope, $uibModalInstance, $timeout, THIS_HOST, digitallySignExpenseService, spinnerService, expenseRestService, globalMessagesService, base64BinaryConverterService, expense) {
	"use strict";

	var linkToGuestView = THIS_HOST + "/expense/guest/";

	$scope.expense = expense;
	$scope.privateKey = '';
	$scope.dismiss = $uibModalInstance.dismiss;
	$scope.methodChangeable = ($scope.expense.state === 'TO_SIGN_BY_USER');

	$scope.signDigitallyPath = expenseRestService.getSignDigitallyPath($scope.expense.uid);
	$scope.flow = {};

	(function initiallySetMethod() {
		if($scope.methodChangeable) {
			$scope.method = null;
		}
		else {
			if($scope.expense.hasDigitalSignature) {
				$scope.method = 'digital';
			}
			else {
				$scope.method = 'electronical';
			}
		}
	})();

	$scope.selectMethod = function(method) {
		if($scope.methodChangeable) {
			$scope.method = method;
		}
	};

	$scope.sign = function() {
		spinnerService.show('signSpinner');
		// first time
		if($scope.methodChangeable) {
			if($scope.method === 'digital') {
				expenseRestService.setSignMethodToDigital($scope.expense.uid).then(function() {
					expenseRestService.generatePdf($scope.expense.uid, linkToGuestView).then(signDigitally);
				});
			}
			else {
				expenseRestService.setSignMethodToElectronical($scope.expense.uid).then(signElectronically);
			}
		}
		else {
			if($scope.method === 'digital') {
				signDigitally();
			}
			else {
				signElectronically();
			}
		}
	};

	function signDigitally() {
		expenseRestService.getExpensePdf($scope.expense.uid).then(function(response) {
			var base64 = base64BinaryConverterService.toBase64FromJson(response.data);
			var signedBase64 = digitallySignExpenseService.signPdf(base64, $scope.privateKey);
			var signedBlob = base64BinaryConverterService.toBinary(signedBase64);

			$timeout(function() {
				$scope.flow.signDigitally.addFile(signedBlob);
				$scope.flow.signDigitally.upload();
			});
		});
	}
	$scope.signDigitallySuccess = function() {
		showSuccessInfo();
	};
	$scope.signDigitallyError = function() {
		spinnerService.hide('signSpinner');
		globalMessagesService.showGeneralError().then()['finally'](function() {
			window.location.reload();
		});
	};

	function signElectronically() {
		expenseRestService.signElectronically($scope.expense.uid).then(showSuccessInfo);
	}

	function showSuccessInfo() {
		spinnerService.hide('signSpinner');
		globalMessagesService.showInfo('reimbursement.expense.signInfoTitle',
		'reimbursement.expense.signInfoMessage').then($uibModalInstance.close);
	}

}]);
