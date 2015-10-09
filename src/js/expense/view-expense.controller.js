app.controller('ViewExpenseController', ['$scope', '$state', '$stateParams', 'expenseRestService',

	function ($scope, $state, $stateParams, expenseRestService) {
		"use strict";

		$scope.expenseUid = $stateParams.uid;
		$scope.expenseItems = [];
		$scope.expenseState = '';
		$scope.expenseComment = '';

		$scope.returnToDashboard = function () {
			$state.go('dashboard');
		};

		expenseRestService.getAccessRights($scope.expenseUid).then(function (response) {

			if (response.data.viewable) {
				expenseRestService.getExpense($scope.expenseUid).then(function (response) {
					$scope.expenseAccountingText = response.data.accounting;
					$scope.expenseState = response.data.state;
					$scope.expenseComment = response.data.rejectComment;
				});
			}
			else {
				$state.go('dashboard');
			}

		}, function(response) {
			// error handled in list-expense-items.directive
			response.errorHandled = true;
		});

	}]);
