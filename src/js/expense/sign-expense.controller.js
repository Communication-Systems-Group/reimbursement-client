app.controller('SignExpenseController', ['$scope', '$state', '$stateParams', 'expenseRestService',

	function ($scope, $state, $stateParams, expenseRestService) {
		"use strict";

		$scope.expenseUid = $stateParams.uid;
		$scope.expenseItems = [];
		$scope.expenseState = '';

		$scope.returnToDashboard = function () {
			$state.go('dashboard');
		};

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

		});

		$scope.sign = function () {

		};

	}]);