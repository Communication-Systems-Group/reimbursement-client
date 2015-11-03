app.controller("AcceptExpenseController", ['$scope', '$uibModalInstance', 'expenseRestService', 'expenseUid',

function($scope, $uibModalInstance, expenseRestService, expenseUid) {
	"use strict";

	$scope.dismiss = $uibModalInstance.dismiss;
	$scope.accept = function() {
		expenseRestService.accept(expenseUid).then(function() {
			$uibModalInstance.close();
		});
	};

}]);
