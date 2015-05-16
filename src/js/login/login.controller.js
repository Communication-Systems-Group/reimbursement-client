app.controller('LoginController', ['$scope', 'loginRestService',

function($scope, loginRestService) {
	"use strict";

	$scope.form = {
		username: null,
		password: null
	};

	$scope.loginSent = false;
	$scope.loginSuccess = false;
	$scope.submit = function() {
		loginRestService.postLogin($scope.form).then(function() {
			$scope.loginSuccess = true;
		}, function() {
			$scope.loginSuccess = false;
		})['finally'](function() {
			$scope.loginSent = true;
		});
	};

}]);
