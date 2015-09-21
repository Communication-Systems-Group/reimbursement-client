app.controller('GuestViewExpenseController', ['$scope', '$state', '$stateParams',

	function ($scope, $state, $stateParams) {
		"use strict";

		$scope.token = '';
        $scope.expenseUid = $stateParams.uid;

        $scope.isAuthorized = true;
        $scope.isLoading = false;

	}]);
