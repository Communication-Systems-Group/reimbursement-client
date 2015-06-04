app.factory("signatureRestService", ['$http', 'USER',

function($http, USER) {
	"use strict";

	return {
		//TODO SEBI here is a base64 string returned. Probably FLOW .js has to be changed? See testing page...
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