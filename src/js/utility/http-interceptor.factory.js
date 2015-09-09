app.factory('httpInterceptor',

function ($q, $injector) {
	'use strict';

	return {
		responseError: function(response) {
			if(response.status === 401 || response.status === 403) {
				var $state = $injector.get('$state');
				if(!$state.is('logout')) {
					var USER = $injector.get('USER');
					var $modalStack = $injector.get('$modalStack');

					$modalStack.dismissAll();
					USER.loggedIn = false;
					$state.go('login');
				}

				return $q.reject(response);
			}
			else {
				var globalMessagesService = $injector.get('globalMessagesService');
				globalMessagesService.showGeneralError();

				return $q.reject(response);
			}
		}
	};
});
