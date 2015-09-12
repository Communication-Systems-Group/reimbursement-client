app.controller('ViewExpenseController', ['$scope', '$state', '$stateParams', 'createExpenseRestService',

function($scope, $state, $stateParams, createExpenseRestService) {
	"use strict";

	$scope.expenseUid = $stateParams.uid;
	$scope.expenseItems = [];

	createExpenseRestService.getExpense($scope.expenseUid).then(function(response) {
		$scope.expenseAccountingText = response.data.accounting;
	}, function(response) {
		response.errorHandled = true;
		$state.go('dashboard');
	});

	$scope.returnToDashboard = function() {
		$state.go('dashboard');
	};

}]);
