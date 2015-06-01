app.controller('LoginController', ['$rootScope','$scope', 'loginRestService','$state',

function($rootScope, $scope, loginRestService, $state) {
	"use strict";

	$scope.form = {
		username : null,
		password : null
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
			//make update the csrf Token
			loginRestService.getUsername().then(function(result){
				 $rootScope.username = result.data.uid.toUpperCase();
				 $state.go('dashboard');
			});
		});
	};

}]);
