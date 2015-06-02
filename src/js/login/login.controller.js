app.controller('LoginController', ['$rootScope', '$scope', '$state', 'loginRestService', 'globalMessagesService',

function($rootScope, $scope, $state, loginRestService, globalMessagesService) {
	"use strict";

	$scope.form = {
		username: null,
		password: null
	};

	$scope.submit = function() {
		loginRestService.postLogin($scope.form).then(function() {

			//make update the csrf Token
			loginRestService.getUsername().then(function(result){
				$rootScope.username = result.data.uid.toUpperCase();
				$state.go('dashboard');
			}, function() {
				globalMessagesService.showGeneralError();
			});

		}, function() {
			globalMessagesService.showError("reimbursement.globalMessage.loginError.title", "reimbursement.globalMessage.loginError.message");
		});
	};

}]);
