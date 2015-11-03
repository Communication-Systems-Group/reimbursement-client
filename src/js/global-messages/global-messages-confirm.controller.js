app.controller('GlobalMessagesConfirmController', ['$scope', '$uibModalInstance', 'title', 'message', 'yes', 'no',

	function ($scope, $uibModalInstance, title, message, yes, no) {
		"use strict";

		$scope.dismiss = $uibModalInstance.dismiss;
		$scope.close = $uibModalInstance.close;
		$scope.title = title;
		$scope.message = message;
		$scope.yes = yes;
		$scope.no = no;

	}]);
