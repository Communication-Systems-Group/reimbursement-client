app.controller('SignExpenseController', ['$state', '$scope', '$stateParams', '$uibModal', 'expenseRestService', 'globalMessagesService',

function($state, $scope, $stateParams, $uibModal, expenseRestService, globalMessagesService) {
	"use strict";

	$scope.expense = $stateParams.expense;
	$scope.expenseItems = [];
	$scope.signedSuccessfully = false;

	$scope.sign = function() {
		if ($scope.expense.state === "TO_SIGN_BY_USER") {

			var modalInstance = $uibModal.open({
				templateUrl: 'expense/sign-expense-form.tpl.html',
				controller: 'SignExpenseFormController',
				keyboard: false,
				resolve: {
					expenseUid: function() {
						return $scope.expense.uid;
					}
				}
			});

			modalInstance.result.then(function(response) {
				$scope.expense.hasDigitalSignature = response;
				expenseRestService.setSignMethod($scope.expense.uid, $scope.expense.hasDigitalSignature).then(function() {
				signElectronically();
				});
			});
		} else {
			signElectronically();
		}

		function signElectronically() {
			expenseRestService.signElectronically($scope.expense.uid).then(function() {
				globalMessagesService.showInfo('reimbursement.expense.signInfoTitle',
					'reimbursement.expense.signInfoMessage').then(function () {
					$scope.signedSuccessfully = true;
					$state.go('dashboard');
				});
			});
		}
	};

}]);
