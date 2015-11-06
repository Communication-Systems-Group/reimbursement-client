app.controller("RejectExpenseController", ['$scope', '$uibModalInstance', 'expenseRestService', 'expenseUid',

function($scope, $uibModalInstance, expenseRestService, expenseUid) {
	"use strict";

	$scope.reason = "";

	$scope.dismiss = $uibModalInstance.dismiss;
	$scope.reject = function() {
		expenseRestService.reject(expenseUid, $scope.reason).then(function() {
			$uibModalInstance.close();
		});
	};

}]);
