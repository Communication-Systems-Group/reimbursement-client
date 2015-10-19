app.factory('testingPageRestService', ['$http','USER', 'HOST',

function($http, USER, HOST) {
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
				url: 'http://localhost:80/api/user/signature'
			});
		},
		getSignatureFailure: function() {
			return $http({
				method: 'GET',
				url: 'http://localhost:80/api/user/NO_EXISTING_USER/signature'
			});
		},
		// PDF services
		generatePDF: function(expenseUid) {
			return $http({
				method: 'POST',
				url: HOST + '/api/expenses/' + expenseUid + '/generate-pdf?url=http://google.ch'
			});
		},
		exportPDF: function(expenseUid) {
			return $http({
				method: 'POST',
				url: HOST + '/api/expenses/' + expenseUid + '/export-pdf'
			});
		}
	};
}]);
