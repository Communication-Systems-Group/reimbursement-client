app.factory('croppingRestService', ['$http', 'HOST',

function($http, HOST) {
	"use strict";

	return {
		postSignatureCropping : function(dimensions) {
			return $http.post(HOST + "/api/user/signature/crop", dimensions);
		}
	};

}]);
