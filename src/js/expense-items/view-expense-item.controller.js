app.controller('ViewExpenseItemController', ['$scope', '$uibModalInstance', 'expenseItemUid',

function($scope, $uibModalInstance, expenseItemUid) {
	"use strict";

	$scope.expenseItemUid = expenseItemUid;
	$scope.form = {};
	$scope.validatingFunction = null;

	$scope.dismiss = $uibModalInstance.dismiss;

}]);
