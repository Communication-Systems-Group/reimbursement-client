app.controller('SignExpenseController', ['$scope', '$state', '$stateParams', 'expenseRestService',

	function ($scope, $state, $stateParams, expenseRestService) {
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

		$scope.sign = function () {

		};

	}]);
