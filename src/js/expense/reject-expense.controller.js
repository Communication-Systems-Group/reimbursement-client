app.controller("RejectExpenseController", ['$scope', '$modalInstance', 'expenseRestService', 'expenseUid',

function($scope, $modalInstance, expenseRestService, expenseUid) {
	"use strict";

	$scope.reason = "";

	$scope.dismiss = $modalInstance.dismiss;
	$scope.reject = function() {
		expenseRestService.reject(expenseUid, $scope.reason).then(function() {
			$modalInstance.close();
		});
	};


}]);
