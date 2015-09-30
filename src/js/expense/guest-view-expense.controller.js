app.controller('GuestViewViewExpenseController', ['$scope', '$stateParams', 'expenseItem', '$modalInstance',

	function ($scope, $stateParams, expenseItem, $modalInstance) {
		"use strict";

		$scope.dismiss = function() {
			$modalInstance.close();
		};

		$scope.expenseItem = expenseItem;

	}]);
