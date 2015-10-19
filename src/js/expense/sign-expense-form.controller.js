app.controller('SignExpenseFormController', ['$scope', '$modalInstance',

function($scope, $modalInstance) {
	"use strict";

	$scope.method = null;
	$scope.dismiss = $modalInstance.dismiss;

	$scope.selectMethod = function(method) {
		$scope.method = method;
	};

	$scope.save = function() {
		var hasDigitalSignature;
		if ($scope.method === "digital") {
			hasDigitalSignature = true;
		} else {
			hasDigitalSignature = false;
		}
		$modalInstance.close(hasDigitalSignature);
	};

}]);
