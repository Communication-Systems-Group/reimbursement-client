app.factory('croppingRestService', ['$http',

function($http) {
	"use strict";

	return {
		postSignatureCropping : function(dimensions) {
			return $http.post("http://localhost:8080/user/test-uuid/signature/crop", dimensions);
		}
	};

}]);