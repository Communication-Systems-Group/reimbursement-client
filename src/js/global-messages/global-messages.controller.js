app.controller('GlobalMessagesController', ['$scope', '$modalInstance', 'title', 'message',

function($scope, $modalInstance, title, message) {
	"use strict";

	$scope.dismiss = $modalInstance.dismiss;
	$scope.title = title;
	$scope.message = message;

}]);
