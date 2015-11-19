app.controller('ViewExpenseItemController', ['$scope', '$uibModalInstance', 'expenseItem',

function($scope, $uibModalInstance, expenseItem) {
	"use strict";

	$scope.expenseItem = expenseItem;
	$scope.form = {};
	$scope.validatingFunction = null;
	$scope.dismiss = $uibModalInstance.dismiss;

}]);
