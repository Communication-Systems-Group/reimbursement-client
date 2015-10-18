app.controller('SignExpenseFormController', ['$scope', '$modalInstance',

function($scope, $modalInstance) {
	"use strict";

	$scope.save = function() {
		if ($scope.method === "digital") {
			$scope.hasDigitalSignature = true;
		} else {
			$scope.hasDigitalSignature = false;
		}
		$modalInstance.close($scope.hasDigitalSignature);
	};

}]);
