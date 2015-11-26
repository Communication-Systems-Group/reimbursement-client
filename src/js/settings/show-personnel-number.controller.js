app.controller('ShowPersonnelNumberController', ['$scope', '$uibModalInstance',

function($scope, $uibModalInstance) {
	"use strict";

	$scope.dismiss = function() {
		$uibModalInstance.dismiss();
	};
}]);
