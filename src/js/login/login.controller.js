app.controller('LoginController', ['$scope', '$state', 'spinnerService', 'loginRestService', 'globalMessagesService',

	function ($scope, $state, spinnerService, loginRestService, globalMessagesService) {
		"use strict";

		$scope.form = {
			username: null,
			password: null
		};



		$scope.submit = function () {
			spinnerService.show('spinnerLogin');
			loginRestService.postLogin($scope.form).then(function () {
				window.location.reload();
			}, function (response) {
				response.errorHandled = true;
				var errorTitle = "reimbursement.globalMessage.loginError.title";
				switch(response.data.type) {
					case 'BadCredentialsException':
						globalMessagesService.showErrorMd(errorTitle, "reimbursement.globalMessage.loginError.BadCredentialsException");
						break;
					default:
						globalMessagesService.showErrorMd(errorTitle, "reimbursement.globalMessage.loginError.message");
						break;
				}

			})['finally'](function() {
					spinnerService.hide('spinnerLogin');
				});
		};

	}]);
