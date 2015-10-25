app.factory('httpInterceptor', ['$q', '$timeout', '$injector',

function ($q, $timeout, $injector) {
	'use strict';
	
	function resetUserToPreLogin(){
		var $state = $injector.get('$state');
		if(!$state.is('logout') && !$state.is('login')) {
			var USER = $injector.get('USER');
			var $uibModalStack = $injector.get('$uibModalStack');

			$uibModalStack.dismissAll();
			USER.roles = [];
			USER.loggedIn = false;
			//TODO check this state.go?
			$state.go('login');
		}
	}

	return {
		responseError: function(response) {
			if(response.status === 401) {
				resetUserToPreLogin();
				return $q.reject(response);
			} else if(response.status === 403) {
				// The 403 error message can be suppressed if, immediately inside the error function,
				// response.errorHandled is set to true. This will stop the global error handler to open a modal.
				return $q.reject(response)['finally'](function() {
					$timeout(function() {
						if(response.csrfErrorHandled !== true) {
							resetUserToPreLogin();
							var globalMessagesService = $injector.get('globalMessagesService');
							globalMessagesService.showErrorMd("reimbursement.globalMessage.InvalidCsrfTokenException.title",
							"reimbursement.globalMessage.InvalidCsrfTokenException.message").then()['finally'](function() {
								$injector.get('loginRestService').getUsername();
							});
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
