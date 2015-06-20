app.factory('csrfTestingPageRestService', ['$http','USER',

function($http, USER) {
	"use strict";

	return {
		getUsers: function() {
			return $http({
				method: 'GET',
				url: 'http://localhost:80/testingpublic'
			});
		},
		getPrivateUsers: function() {
			return $http({
				method: 'GET',
				url: 'http://localhost:80/testingprivate'
			});
		},
		sendString: function(data) {
			return $http({
				params: data,
				method: 'POST',
				url: 'http://localhost:80/testingpublic/string'
			});
		},
		sendCroppingDto: function(data) {
			return $http({
				method: 'POST',
				url: 'http://localhost:80/testingpublic/croppingdto',
				data: data,
				headers: {'Content-Type': "application/json"}
			});
		},
		getSignature: function() {
			return $http({
				method: 'GET',
				url: 'http://localhost:80/api/user/'+USER.uid+'/signature',
				transformResponse: null
			});
		},
		getSignatureFailure: function() {
			return $http({
				method: 'GET',
				url: 'http://localhost:80/api/user/blub/signature',
				transformResponse: null
			});
		}

	};

}]);
