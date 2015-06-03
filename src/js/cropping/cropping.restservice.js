app.factory('croppingRestService', ['$http', 'USER',

function($http, USER) {
	"use strict";

	return {
		postSignatureCropping : function(dimensions) {
			return $http.post("http://localhost:8080/api/user/"+USER.uid+"/signature/crop", dimensions);
		}
	};

}]);
