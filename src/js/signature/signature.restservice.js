app.factory("signatureRestService", function($http) {
	"use strict";
	
	return {
		
		getSignature: function() {
			return $http.get("http://localhost:8080/user/test-uuid/signature", {responseType: 'blob'});
		},
		postSignaturePath: function() {
			return "http://localhost:8080/user/test-uuid/signature";
		}
		
	};
});