app.factory('testingPageRestService', ['$http','USER',

function($http, USER) {
	"use strict";

	return {
		getUsers: function() {
			return $http({
				method: 'GET',
				url: 'http://localhost:80/api/prof/users'
			});
		},
		getOwnUserDetails: function() {
			return $http({
				method: 'GET',
				url: 'http://localhost:80/api/prof/users/'+USER.uid
			});
		},
		sendCroppingDto: function(data) {
			return $http({
				method: 'POST',
				url: 'http://localhost:80/api/user/signature/crop',
				data: data,
				headers: {'Content-Type': "application/json"}
			});
		},
		getSignature: function() {
			return $http({
				method: 'GET',
				url: 'http://localhost:80/api/user/signature',
				transformResponse: null
			});
		},
		getSignatureFailure: function() {
			return $http({
				method: 'GET',
				url: 'http://localhost:80/api/user/NO_EXISTING_USER/signature',
				transformResponse: null
			});
		}

	};

}]);
