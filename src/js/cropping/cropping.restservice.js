app.factory('croppingRestService', function($http) {
	"use strict";

	return {

		postSignatureCropping: function(dimensions) {
			return $http.post("http://localhost:8080/user/test-uuid/signature/crop", dimensions);
		}

	};
});
