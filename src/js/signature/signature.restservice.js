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
		postSignatureMobileToken : function() {
			return $http.post("http://localhost:8080/api/user/signature/token");
		},
		postSignaturePath : function() {
			return "http://localhost:8080/api/user/"+USER.uid+"/signature";
		},
		postSignatureMobilePath: function(token) {
			return "http://localhost:8080/api/mobile/"+token+"/signature";
		}
	};

}]);