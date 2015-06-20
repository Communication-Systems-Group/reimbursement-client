app.factory('loginRestService', ['$http', 'HOST',

function($http, HOST) {
	"use strict";

	return {
		postLogin: function(data) {
			return $http({
				method: 'POST',
				url: HOST + '/api/login',
				data: jQuery.param(data),
				headers: {'Content-Type': 'application/x-www-form-urlencoded'}
			});
		},
		getUsername: function(){
			return $http.get(HOST + '/api/user');
		}
	};
}]);
