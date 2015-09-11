app.controller('LoginController', ['$scope', '$state', 'loginRestService', 'globalMessagesService',

	function ($scope, $state, loginRestService, globalMessagesService) {
		"use strict";

		$scope.form = {
			username: null,
			password: null
		};

		$scope.submit = function () {
			loginRestService.postLogin($scope.form).then(function () {
				window.location.reload();
			}, function (response) {
				response.errorHandled = true;
				var errorTitle = "reimbursement.globalMessage.loginError.title";

				switch(response.data.type) {
					case 'InvalidCsrfTokenException':
						globalMessagesService.showErrorMd(errorTitle,
							"reimbursement.globalMessage.loginError.MissingCsrfTokenException").then()['finally'](function() {

							window.location.reload();
						});
						break;
					case 'BadCredentialsException':
						globalMessagesService.showErrorMd(errorTitle, "reimbursement.globalMessage.loginError.BadCredentialsException");
						break;
					default:
						globalMessagesService.showErrorMd(errorTitle, "reimbursement.globalMessage.loginError.message");
						break;
				}

			});
		};

	}]);
