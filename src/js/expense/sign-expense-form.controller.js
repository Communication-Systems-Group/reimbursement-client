app.controller('SignExpenseFormController', ['$scope', '$modalInstance', 'signExpenseFactory', 'testingPageRestService', 'globalMessagesService', 'expenseUid',

function($scope, $modalInstance, signExpenseFactory, testingPageRestService, globalMessagesService, expenseUid) {
	"use strict";

	$scope.expenseUid = expenseUid;
	$scope.method = null;
	$scope.dismiss = $modalInstance.dismiss;
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
					$modalInstance.close(hasDigitalSignature);
				}
			});
		} else {
			hasDigitalSignature = false;
			$modalInstance.close(hasDigitalSignature);
		}

		function digitallySignExpense(callback) {
			if(validation()) {
				testingPageRestService.generatePDF($scope.expenseUid).then(function() {}, function() {
					globalMessagesService.showErrorMd('reimbursement.expense.signForm.error',
							'reimbursement.expense.signForm.pdfCannotBeCreated').then(function() {
							$scope.privateKey = '';
							$scope.method = null;

							callback(false);
						});
				})['finally'](function() {
					testingPageRestService.exportPDF($scope.expenseUid).then(function(response) {
						signExpenseFactory.construct(response.data.content, $scope.privateKey, function(signature) {
							if(signature) {
								signExpenseFactory.verify(response.data.content, signature, function() {
									globalMessagesService.showInfo('reimbursement.expense.signForm.success',
											'reimbursement.expense.signForm.documentSignedSuccessfully').then(function() {
											$scope.privateKey = '';
											$scope.method = null;

											callback(true);
										});
								});
							} else {
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
				globalMessagesService.showErrorMd('reimbursement.expense.signForm.validationError',
						'reimbursement.expense.signForm.noPrivateKeyProvided');
				return false;
			} else {
				return true;
			}
		}
	};

}]);
