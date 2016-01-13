app.controller('SignExpenseFormController', ['$scope', '$uibModalInstance', '$timeout', 'THIS_HOST', 'MAX_UPLOAD_SIZE', 'digitallySignExpenseService', 'spinnerService', 'expenseRestService', 'globalMessagesService', 'base64BinaryConverterService', 'expense',

function($scope, $uibModalInstance, $timeout, THIS_HOST, MAX_UPLOAD_SIZE, digitallySignExpenseService, spinnerService, expenseRestService, globalMessagesService, base64BinaryConverterService, expense) {
	"use strict";

	var linkToGuestView = THIS_HOST + "/expense/guest/";

	$scope.maxUploadSize = MAX_UPLOAD_SIZE;
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
		// only used to prevent GUI hacking - the button should be disabled
		if(($scope.method === 'digital' && !$scope.signatureMethod.certificatePassword.$valid) || ($scope.method === 'digital' && !$scope.fileread.certificate)) {
			globalMessagesService.showInfoMd('reimbursement.globalMessage.expense.warning.formNotCompleteMessage',
				'reimbursement.globalMessage.expense.warning.formNotCompleteTitle');
		}
		else {
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
		}
	};

	function signDigitally() {
		expenseRestService.getExpensePdf($scope.expense.uid).then(function(response) {
			var base64Pdf = base64BinaryConverterService.toBase64FromJson(response.data);

			digitallySignExpenseService.signPdf(base64Pdf, $scope.fileread.certificate, $scope.certificatePassword).then(function(signedBlobPdf) {
				$timeout(function() {
					window.console.log(base64Pdf.length);
					base64BinaryConverterService.toBase64(signedBlobPdf, function(result) {
							window.console.log(result.length);
						}
					);

					$scope.flow.signDigitally.addFile(signedBlobPdf);
					$scope.flow.signDigitally.upload();
				});
			}, function(reason) {
				$scope.signDigitallyError(reason);
			});
		});
	}

	$scope.signDigitallyError = function(error) {
		spinnerService.hide('signSpinner');
		if (error.message && error.message.toLowerCase().indexOf("invalid password") > -1) {
			globalMessagesService.showWarning('reimbursement.globalMessage.expense.signPwFailTitle',
			'reimbursement.globalMessage.expense.signPwFailMessage');
		}
		else {
			globalMessagesService.showWarning('reimbursement.globalMessage.expense.signFailTitle',
			'reimbursement.globalMessage.expense.signFailMessage');
		}
	};

	$scope.flowUploadSuccess = function() {
		showSuccessInfo();
	};

	$scope.flowUploadError = function() {
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
		globalMessagesService.showInfo('reimbursement.globalMessage.expense.signSuccessTitle',
		'reimbursement.globalMessage.expense.signSuccessMessage').then($uibModalInstance.close);
	}
}]);
