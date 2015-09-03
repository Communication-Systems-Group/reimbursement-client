app.controller('GlobalMessagesController', ['$scope', '$modalInstance', 'title', 'message',

	function ($scope, $modalInstance, title, message) {
		"use strict";

		$scope.close = $modalInstance.close;
		$scope.title = title;
		$scope.message = message;

	}]);
