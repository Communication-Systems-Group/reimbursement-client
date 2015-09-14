app.factory("attachmentRestService", ['$http', 'HOST',

function($http, HOST) {
	"use strict";

	return {
		//TODO: Chrigi - make expenseItemId dynamic
		getAttachment : function() {
			return $http.get(HOST + "/api/expenses/expense-items/f6570b82-344f-4ebe-84cc-c15a081f03a3/attachments");
		},
		postAttachmentMobileToken : function() {
			return $http.post(HOST + "/api/expenses/expense-items/f6570b82-344f-4ebe-84cc-c15a081f03a3/attachments/token");
		},
		postAttachmentPath : function() {
			return HOST + "/api/expenses/expense-items/f6570b82-344f-4ebe-84cc-c15a081f03a3/attachments";
		},
		postAttachmentMobilePath: function(token) {
			return HOST + "/api/public/mobile/" + token + "/attachment";
		}
	};

}]);