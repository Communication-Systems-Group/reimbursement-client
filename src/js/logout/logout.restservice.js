app.factory('logoutRestService', ['$http', 'HOST',

function($http, HOST) {
	"use strict";

	return {
		postLogout: function() {
			return $http({
				method: 'POST',
				url: HOST + '/api/logout',
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
			});
		},
		refreshCSRFToken: function() {
			$http.get(HOST + "/api/user", { withCredentials: true });
		}
	};
}]);
