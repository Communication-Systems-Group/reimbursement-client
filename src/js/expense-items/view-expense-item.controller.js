app.controller('ViewExpenseItemController', ['$scope', '$modalInstance', 'expenseItemUid',

function($scope, $modalInstance, expenseItemUid) {
	"use strict";

	$scope.expenseItemUid = expenseItemUid;
	$scope.form = {};
	$scope.validatingFunction = null;

	$scope.dismiss = $modalInstance.dismiss;

}]);
