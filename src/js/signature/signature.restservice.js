app.factory("signatureRestService", ['$http', 'HOST',

function($http, HOST) {
	"use strict";

	return {
		getSignature : function() {
			return $http.get(HOST + "/api/user/signature");
		},
		postSignatureMobileToken : function() {
			return $http.post(HOST + "/api/user/signature/token");
		},
		postSignaturePath : function() {
			return HOST + "/api/user/signature";
		},
		postSignatureMobilePath: function(token) {
			return HOST + "/api/public/mobile/" + token + "/signature";
		}
	};

}]);