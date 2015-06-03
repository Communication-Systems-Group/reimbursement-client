app.factory("signatureRestService", ['$http', 'USER',

function($http, USER) {
	"use strict";

	return {
		getSignature : function() {
			return $http.get("http://localhost:8080/api/user/"+USER.uid+"/signature", {
				responseType : 'blob'
			});
		},
		postSignaturePath : function() {
			return "http://localhost:8080/api/user/"+USER.uid+"/signature";
		}
	};

}]);