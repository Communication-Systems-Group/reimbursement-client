app.controller("AcceptExpenseController", ['$scope', '$modalInstance', 'expenseRestService', 'expenseUid',

function($scope, $modalInstance, expenseRestService, expenseUid) {
	"use strict";

	$scope.dismiss = $modalInstance.dismiss;
	$scope.accept = function() {
		expenseRestService.accept(expenseUid).then(function() {
			$modalInstance.close();
		});
	};

}]);
