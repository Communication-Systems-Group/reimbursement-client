app.factory("attachmentRestService", ['$http', 'HOST',

function($http, HOST) {
	"use strict";

	return {
		getAttachment: function(expenseItemUid) {
			return $http.get(HOST + "/api/expenses/expense-items/" + expenseItemUid + "/attachments");
		},
		deleteAttachment: function(expenseItemUid) {
			return $http.delete(HOST + "/api/expenses/expense-items/" + expenseItemUid + "/attachments");
		},
		postAttachmentMobileToken: function(expenseItemUid) {
			return $http.post(HOST + "/api/expenses/expense-items/" + expenseItemUid + "/attachments/token");
		},
		postAttachmentPath: function(expenseItemUid) {
			return HOST + "/api/expenses/expense-items/" + expenseItemUid + "/attachments";
		},
		postAttachmentMobilePath: function(token) {
			return HOST + "/api/public/mobile/" + token + "/attachment";
		}
	};

}]);