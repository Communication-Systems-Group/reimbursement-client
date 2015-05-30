app.factory('loginRestService', ['$http',

function($http) {
	"use strict";

	return {
		postLogin: function(data) {
			return $http({
				method: 'POST',
				url: 'http://localhost:8080/api/login',
				data: jQuery.param(data),
				headers: {'Content-Type': 'application/x-www-form-urlencoded'}
			});
		}
	};
}]);
