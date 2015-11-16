app.controller('LoginController', ['$scope', '$state', 'USER', 'spinnerService', 'loginRestService', 'globalMessagesService',

	function ($scope, $state, USER, spinnerService, loginRestService, globalMessagesService) {
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
				spinnerService.hide('spinnerLogin');

				loginRestService.getUser().then(function(response) {
					storeUserAndRedirect(response.data);
				});

			}, function (response) {
				response.errorHandled = true;
				response.csrfErrorHandled = true;

				var errorTitle = "reimbursement.globalMessage.loginError.title";

				if(response.status === 401) {
					globalMessagesService.showWarningMd(errorTitle, "reimbursement.globalMessage.loginError.badCredentialsException");
					spinnerService.hide('spinnerLogin');
				}
				else if(response.status === 403) {
					var userResponse = {};

					// get a new csrf token and store user (for success case)
					loginRestService.getUser().then(function(response) {
						userResponse = response;
					})['finally'](function() {

						// retry the call
						loginRestService.postLogin($scope.form).then(function() {
							spinnerService.hide('spinnerLogin');
							storeUserAndRedirect(userResponse.data);

						}, function(response) {
							// 403 is now not an option anymore. the csrf token should be up to date,
							// therefore the only acceptable status is 200 or 401.
							if(response.status === 401) {
								globalMessagesService.showWarningMd(errorTitle, "reimbursement.globalMessage.loginError.badCredentialsException");
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

		function storeUserAndRedirect(data) {
			USER.loggedIn = true;
			for(var key in data) {
				if(data.hasOwnProperty(key)) {
					USER[key] = data[key];
				}
			}

			// the target URL is stored during the previous state redirection (to the login).
			// you can find this logic in app.js (catching the event $stateChangeError)
			if(typeof $state.targetStateBeforeRedirect !== "undefined") {
				$state.go($state.targetStateBeforeRedirect, $state.targetStateParamsBeforeRedirect);
			}
			else {
				$state.go('dashboard');
			}
		}

	}]);
