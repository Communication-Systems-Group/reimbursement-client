app.controller('GuestViewExpenseController', ['$scope', '$state', '$stateParams', 'expenseRestService',

	function ($scope, $state, $stateParams, expenseRestService) {
		"use strict";

		$scope.expenseUid = $stateParams.uid;
		$scope.expenseItems = [];
		$scope.expenseState = '';


        expenseRestService.getExpense($scope.expenseUid).then(function (response) {
            $scope.expenseAccountingText = response.data.accounting;
            $scope.expenseState = response.data.state;
        });

	}]);
