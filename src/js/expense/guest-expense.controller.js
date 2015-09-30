app.controller('GuestViewExpenseController', ['$scope', '$stateParams', 'guestViewRestService',

	function ($scope, $stateParams, guestViewRestService) {
		"use strict";

		$scope.expenseAccountingText = '';

		$scope.expenseUid = $stateParams.uid;
		$scope.expenseLoaded = false;
		$scope.expenseItems = [];


		guestViewRestService.fetchExpenseToken($scope.expenseUid).then(function(response) {
			$scope.expenseToken = response.data.uid;

		})['finally'](function() {

			guestViewRestService.getExpense($scope.expenseToken).then(function(response) {
				$scope.expense = response.data;
				$scope.expenseLoaded = true;

				$scope.expenseUid = $scope.expense.uid;
			});

		});

	}]);
