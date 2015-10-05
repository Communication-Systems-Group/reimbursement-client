app.controller('GuestViewExpenseController', ['$scope', '$state', '$stateParams', 'expenseRestService',

	function ($scope, $state, $stateParams, expenseRestService) {
		"use strict";

		$scope.expenseUid = $stateParams.token;
		$scope.expenseItems = [];
		$scope.expenseState = '';

		expenseRestService.getAccessRights($scope.expenseUid).then(function(response) {
			if(response.data.viewable) {
				expenseRestService.getExpense($scope.expenseUid).then(function(response) {
					$scope.expenseAccountingText = response.data.accounting;
					$scope.expenseState = response.data.state;
				});
			}
			else {
				$state.go('dashboard');
			}
		});

	}]);
