app.controller('LoginController', ['$scope', '$state', 'spinnerService', 'loginRestService', 'globalMessagesService',

	function ($scope, $state, spinnerService, loginRestService, globalMessagesService) {
		"use strict";

		$scope.form = {
			username: null,
			password: null
		};

		$scope.submit = function () {
			spinnerService.show('spinnerLogin');

			function showGeneralError() {
				globalMessagesService.showGeneralError().then()['finally'](function() {
					window.location.reload();
				});
			}

			loginRestService.postLogin($scope.form).then(function () {
				// Reloading the page redirects the user to the page in the URL. The login state is not represented
				// in the URL (e.g. /dashboard is the URL and the effective state is login. a reload after a successful
				// login redirects then from login to /dashboard).
				window.location.reload();
				spinnerService.hide('spinnerLogin');

			}, function (response) {
				response.errorHandled = true;
				response.csrfErrorHandled = true;

				var errorTitle = "reimbursement.globalMessage.loginError.title";

				if(response.status === 401) {
					globalMessagesService.showErrorMd(errorTitle, "reimbursement.globalMessage.loginError.badCredentialsException");
					spinnerService.hide('spinnerLogin');
				}
				else if(response.status === 403) {
					// get a new csrf token
					loginRestService.getUser().then()['finally'](function() {

						// retry the call
						loginRestService.postLogin($scope.form).then(function() {
							window.location.reload();
							spinnerService.hide('spinnerLogin');

						}, function(response) {
							// 403 is now not an option anymore. the csrf token should be up to date,
							// therefore the only acceptable status is 200 or 401.
							if(response.status === 401) {
								globalMessagesService.showErrorMd(errorTitle, "reimbursement.globalMessage.loginError.badCredentialsException");
								spinnerService.hide('spinnerLogin');
							}
							else {
								showGeneralError();
								spinnerService.hide('spinnerLogin');
							}
						});
					});
				}
				else {
					showGeneralError();
					spinnerService.hide('spinnerLogin');
				}
			});
		};

	}]);
