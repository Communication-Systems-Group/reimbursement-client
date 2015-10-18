app.controller('SignExpenseController', ['$scope', '$state', '$stateParams', '$uibModal', 'expenseRestService',

	function ($scope, $state, $stateParams, $uibModal, expenseRestService) {
		"use strict";

		$scope.expenseUid = $stateParams.uid;
		$scope.expenseItems = [];
		$scope.expenseState = '';

		expenseRestService.getAccessRights($scope.expenseUid).then(function (response) {

			if (response.data.viewable && response.data.signable && !response.data.editable) {
				expenseRestService.getExpense($scope.expenseUid).then(function (response) {
					$scope.expenseAccountingText = response.data.accounting;
					$scope.expenseState = response.data.state;
				});
			}
			else {
				$state.go('dashboard');
			}

		}, function(response) {
			// error handled in list-expense-items.directive
			response.errorHandled = true;
		});

		expenseRestService.getExpense($scope.expenseUid).then(function (response) {
			$scope.hasDigitalSignature = response.data.hasDigitalSignature;
		});

		$scope.sign = function () {
			if($scope.expenseState === "TO_SIGN_BY_USER") {
				var modalInstance = $uibModal.open({
				templateUrl: 'expense/sign-expense-form.tpl.html',
				controller: 'SignExpenseFormController',
				backdrop: 'static',
				keyboard: false

			});

			modalInstance.result.then(function(response) {
				$scope.hasDigitalSignature = response;
				console.log($scope.hasDigitalSignature);
				console.log(response);
				expenseRestService.setSignMethod($scope.expenseUid, $scope.hasDigitalSignature);
			});
			}

			if($scope.hasDigitalSignature === false) {
				expenseRestService.signElectronically($scope.expenseUid);
			}
		};

	}]);
