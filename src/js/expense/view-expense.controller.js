app.controller('ViewExpenseController', ['$scope', '$state', '$stateParams', 'expenseRestService',

function($scope, $state, $stateParams, expenseRestService) {
	"use strict";

	$scope.expenseUid = $stateParams.uid;
	$scope.expenseItems = [];

	expenseRestService.getExpense($scope.expenseUid).then(function(response) {
		$scope.expenseAccountingText = response.data.accounting;
	}, function(response) {
		response.errorHandled = true;
		$state.go('dashboard');
	});

	$scope.returnToDashboard = function() {
		$state.go('dashboard');
	};

}]);
