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

	function assignToProf(uid) {
		return $http({
			method: 'PUT',
			url: HOST + '/api/user/expenses/'+uid+'/assign-to-prof',
			});
	}
	return {
		postCreateExpense: postCreateExpense,
		assignToProf: assignToProf
	};

}]);
