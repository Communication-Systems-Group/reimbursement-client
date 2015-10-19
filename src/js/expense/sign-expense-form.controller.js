app.controller('SignExpenseFormController', ['$scope', '$modalInstance',

function($scope, $modalInstance) {
	"use strict";

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
