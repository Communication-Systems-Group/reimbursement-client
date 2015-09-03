app.controller('GlobalMessagesConfirmController', ['$scope', '$modalInstance', 'title', 'message', 'yes', 'no',

	function ($scope, $modalInstance, title, message, yes, no) {
		"use strict";

		$scope.dismiss = $modalInstance.dismiss;
		$scope.close = $modalInstance.close;
		$scope.title = title;
		$scope.message = message;
		$scope.yes = yes;
		$scope.no = no;

	}]);
