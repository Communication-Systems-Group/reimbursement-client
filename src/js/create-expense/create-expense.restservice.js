app.factory("createExpenseRestService", ['$http', 'HOST',

function($http, HOST) {
	"use strict";

	function postCreateExpense(accounting) {
		return $http({
			method: 'POST',
			url: HOST + '/api/user/expenses',
			data: {
				accounting: accounting
			}
		});
	}

	return {
		postCreateExpense: postCreateExpense
	};

}]);
