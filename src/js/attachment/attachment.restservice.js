app.factory("attachmentRestService", ['$http', 'HOST',

function($http, HOST) {
	"use strict";

	return {
		//TODO: Chrigi - make expenseItemId dynamic
		getAttachment : function() {
			return $http.get(HOST + "/api/user/expenses/expense-items/dbeba0ee-5727-4e60-ab05-dda5f215d396/attachments");
		},
		postAttachmentMobileToken : function() {
			return $http.post(HOST + "/api/user/expenses/expense-items/dbeba0ee-5727-4e60-ab05-dda5f215d396/attachments/token");
		},
		postAttachmentPath : function() {
			return HOST + "/api/user/expenses/expense-items/dbeba0ee-5727-4e60-ab05-dda5f215d396/attachments";
		},
		postAttachmentMobilePath: function(token) {
			return HOST + "/api/public/mobile/" + token + "/attachment";
		}
	};

}]);