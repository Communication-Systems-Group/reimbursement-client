app.controller('ViewExpenseController', ['$scope', '$stateParams',

function ($scope, $stateParams) {
	"use strict";

	$scope.expense = $stateParams.expense;
	$scope.expenseItems = [];

}]);
