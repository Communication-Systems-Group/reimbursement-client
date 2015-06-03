app.factory('logoutRestService', ['$http',

function($http) {
	"use strict";

	return {
		postLogout: function() {
			return $http({
				method: 'POST',
				url: 'http://localhost:8080/api/logout',
				headers: {'Content-Type': 'application/x-www-form-urlencoded'}
			});
		}
	};
}]);
