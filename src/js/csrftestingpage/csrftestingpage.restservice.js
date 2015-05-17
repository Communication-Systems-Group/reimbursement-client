app.factory('csrfTestingPageRestService', ['$http',

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
		},
		getUsers: function() {
			return $http({
				method: 'GET',
				url: 'http://localhost:8080/testingpublic'
			});
		},
		getPrivateUsers: function() {
			return $http({
				method: 'GET',
				url: 'http://localhost:8080/testingprivate'
			});
		},
		sendString: function(data) {
			return $http({
				method: 'POST',
				url: 'http://localhost:8080/testingpublic/string?'+jQuery.param(data)
			});
		},
		sendCroppingDto: function(data) {
			return $http({
				method: 'POST',
				url: 'http://localhost:8080/testingpublic/croppingdto',
				data: data,
				headers: {'Content-Type': "application/json"}
			});
		}
		
	};

}]);
