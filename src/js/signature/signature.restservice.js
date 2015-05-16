app.factory("signatureRestService", ['$http',

function($http) {
	"use strict";

	return {
		getSignature : function() {
			return $http.get("http://localhost:8080/api/user/test-uuid/signature", {
				responseType : 'blob'
			});
		},
		postSignaturePath : function() {
			return "http://localhost:8080/api/user/test-uuid/signature";
		}
	};

}]);