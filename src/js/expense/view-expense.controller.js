app.controller('ViewExpenseController', ['$scope', '$state', '$stateParams', 'expenseRestService',

function ($scope, $state, $stateParams, expenseRestService) {
	"use strict";

	$scope.expenseUid = $stateParams.uid;
	$scope.expenseItems = [];
	$scope.expenseState = '';
	$scope.expenseComment = '';

	expenseRestService.getExpense($scope.expenseUid).then(function (response) {
		$scope.expenseAccountingText = response.data.accounting;
		$scope.expenseState = response.data.state;
		$scope.expenseComment = response.data.rejectComment;
	});

}]);
