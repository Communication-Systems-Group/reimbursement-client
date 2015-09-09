app.factory('httpInterceptor',

function ($q, $injector) {
	'use strict';

	return {
		responseError: function(response) {
			if(response.status === 401 || response.status === 403) {
				var $state = $injector.get('$state');
				var USER = $injector.get('USER');

				USER.loggedIn = false;
				$state.go('login');

				return $q.reject(response);
			}
			else {
				return $q.reject(response);
			}
		}
	};
});