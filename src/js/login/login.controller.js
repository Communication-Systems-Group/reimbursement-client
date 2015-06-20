app.controller('LoginController', ['$scope', '$state', 'loginRestService', 'globalMessagesService',

function($scope, $state, loginRestService, globalMessagesService) {
	"use strict";

	$scope.form = {
		username: null,
		password: null
	};

	$scope.submit = function() {
		loginRestService.postLogin($scope.form).then(function() {
			window.location.reload();
		}, function() {
			globalMessagesService.showError("reimbursement.globalMessage.loginError.title", "reimbursement.globalMessage.loginError.message");
		});
	};

}]);
