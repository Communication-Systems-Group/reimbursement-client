app.controller('SignExpenseFormController', ['$scope', '$uibModalInstance', 'signExpenseService', 'expenseRestService', 'globalMessagesService', 'expenseUid', 'HOST',

function($scope, $uibModalInstance, signExpenseService, expenseRestService, globalMessagesService, expenseUid, HOST) {
	"use strict";

	$scope.expenseUid = expenseUid;
	$scope.method = null;
	$scope.privateKey = '';

	$scope.selectMethod = function(method) {
		$scope.method = method;
	};

	$scope.save = function() {
		var hasDigitalSignature;
		if ($scope.method === "digital") {
			hasDigitalSignature = true;
			digitallySignExpense(function(result) {
				if(result) {
					$uibModalInstance.close(hasDigitalSignature);
				}
			});
		}
		else {
			hasDigitalSignature = false;
			$uibModalInstance.close(hasDigitalSignature);
		}

		function digitallySignExpense(callback) {
			if(validation()) {
				expenseRestService.generatePdf($scope.expenseUid, HOST).then(function() {}, function() {
					globalMessagesService.showErrorMd('reimbursement.expense.signForm.error',
					'reimbursement.expense.signForm.pdfCannotBeCreated').then(function() {
						$scope.privateKey = '';
						$scope.method = null;

						callback(false);
					});
				})['finally'](function() {
					expenseRestService.getExpensePdf($scope.expenseUid).then(function(response) {
						signExpenseService.construct(response.data.content, $scope.privateKey, function(signature) {
							if(signature) {
								signExpenseService.verify(response.data.content, signature, function() {
									globalMessagesService.showInfo('reimbursement.expense.signForm.success',
										'reimbursement.expense.signForm.documentSignedSuccessfully').then(function() {
										$scope.privateKey = '';
										$scope.method = null;

										// TODO upload signature

										callback(true);
									});
								});
							}
							else {
								globalMessagesService.showErrorMd('reimbursement.expense.signForm.error',
								'reimbursement.expense.signForm.signatureCannotBeCreated').then(function() {

									callback(false);
								});
							}
						});
					}, function() {
						globalMessagesService.showErrorMd('reimbursement.expense.signForm.error',
						'reimbursement.expense.signForm.pdfExportFailed').then(function() {
							$scope.privateKey = '';
							$scope.method = null;

							callback(false);
						});
					});
				});
			}
		}

		function validation() {
			if($scope.privateKey.length < 255) {
				globalMessagesService.showWarningMd('reimbursement.expense.signForm.validationError',
				'reimbursement.expense.signForm.noPrivateKeyProvided');

				return false;
			}
			else {
				return true;
			}
		}
	};

}]);
