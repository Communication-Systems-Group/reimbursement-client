app.controller('GlobalMessagesController', ['$scope', '$uibModalInstance', 'title', 'message',

	function ($scope, $uibModalInstance, title, message) {
		"use strict";

		$scope.close = $uibModalInstance.close;
		$scope.title = title;
		$scope.message = message;

	}]);
