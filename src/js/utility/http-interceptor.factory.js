/**
 * Created by robinengbersen on 06.07.15.
 */
app.factory('httpInterceptor', function ($q, $injector) {
	'use strict';

	return {
		'requestError': function (rejection) {

			return $q.reject(rejection);
		},


		'responseError': function (rejection) {

			if (rejection.status === 400) {
				// ToDo logout user if the user he's using has not been found
				if (rejection.data.type === 'UserNotFoundException') {
					var modal = $injector.get('$modalStack');
					console.log(modal);
					//modal.dismissAll();

					//$injector.get('$state').transitionTo('login');
				}
			}

			return $q.reject(rejection);
		}
	};
});