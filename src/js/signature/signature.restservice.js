app.factory("signatureRestService", ['$http', 'HOST',

function($http, HOST) {
	"use strict";

	function getSignature() {
		return $http.get(HOST + "/api/user/signature");
	}
	return {
		getSignature: getSignature,
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