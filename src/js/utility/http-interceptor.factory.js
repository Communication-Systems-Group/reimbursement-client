app.factory('httpInterceptor', ['$q', '$timeout', '$injector',

function ($q, $timeout, $injector) {
	'use strict';

	function resetUserToPreLogin() {
		var $state = $injector.get('$state');
		if(!$state.is('login')) {
			var USER = $injector.get('USER');
			var $uibModalStack = $injector.get('$uibModalStack');

			$uibModalStack.dismissAll();
			USER.roles = [];
			USER.loggedIn = false;
			$state.go('login');
		}
	}

	return {
		responseError: function(response) {
			if(response.status === 401) {
				// the user receives a 401 on logout which should not be handled.
				var $state = $injector.get('$state');
				if(!$state.is('logout')) {
					resetUserToPreLogin();
				}
				return $q.reject(response);

			}
			else if(response.status === 403) {
				// The 403 error message can be suppressed if, immediately inside the error function,
				// response.csrfErrorHandled is set to true. This will stop the global error handler to open a modal.
				return $q.reject(response)['finally'](function() {
					$timeout(function() {
						if(response.csrfErrorHandled !== true) {
							resetUserToPreLogin();
							$injector.get('loginRestService').getUser();

							var globalMessagesService = $injector.get('globalMessagesService');
							globalMessagesService.showInfoMd("reimbursement.globalMessage.invalidCsrfTokenException.title",
								"reimbursement.globalMessage.invalidCsrfTokenException.message");
						}
					});
				});
			}
			else {
				// The global error message can be suppressed if, immediately inside the error function,
				// response.errorHandled is set to true. This will stop the global error handler to open a modal.
				return $q.reject(response)['finally'](function() {
					$timeout(function() {
						if(response.errorHandled !== true) {
							var globalMessagesService = $injector.get('globalMessagesService');
							globalMessagesService.showGeneralError().then(function() {
								window.location.reload();
							});
						}
					});
				});
			}
		}
	};

}]);
