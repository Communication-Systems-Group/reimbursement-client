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
				console.log(response);

				var errorLabel;
				switch(response.data.type) {
					case 'MissingCsrfTokenException':
						errorLabel = "reimbursement.globalMessage.loginError.MissingCsrfTokenException";
						break;
					case 'BadCredentialsException':
						errorLabel = "reimbursement.globalMessage.loginError.BadCredentialsException";
						break;
					default:
						errorLabel = "reimbursement.globalMessage.loginError.message";
				}

				globalMessagesService.showError("reimbursement.globalMessage.loginError.title", errorLabel);
			});
		};

	}]);
