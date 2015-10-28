app.controller('SignExpenseController', ['$scope', '$state', '$stateParams', '$uibModal', 'expenseRestService', 'globalMessagesService',

function($scope, $state, $stateParams, $uibModal, expenseRestService, globalMessagesService) {
	"use strict";

	$scope.expenseUid = $stateParams.uid;
	$scope.expenseItems = [];
	$scope.expenseState = '';
	$scope.signedSuccessfully = false;

	expenseRestService.getExpense($scope.expenseUid).then(function(response) {
		$scope.expenseAccountingText = response.data.accounting;
		$scope.expenseState = response.data.state;
		$scope.hasDigitalSignature = response.data.hasDigitalSignature;
	});

	$scope.sign = function() {
		if ($scope.expenseState === "TO_SIGN_BY_USER") {
			var modalInstance = $uibModal.open({
				templateUrl: 'expense/sign-expense-form.tpl.html',
				controller: 'SignExpenseFormController',
				keyboard: false,
				resolve: {
					expenseUid: function() {
						return $scope.expenseUid;
					}
				}

			});

			modalInstance.result.then(function(response) {
				$scope.hasDigitalSignature = response;
				expenseRestService.setSignMethod($scope.expenseUid, $scope.hasDigitalSignature);
				signElectronically();
			});
		} else {
			signElectronically();
		}

		function signElectronically() {
			if ($scope.hasDigitalSignature === false) {
				expenseRestService.signElectronically($scope.expenseUid).then(function() {
					globalMessagesService.showInfoMd('reimbursement.expense.signInfoTitle', 'reimbursement.expense.signInfoMessage');
					$scope.signedSuccessfully = true;
				});
			}
		}
	};

}]);
