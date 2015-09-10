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

	function getExpense(uid) {
		return $http({
			method: 'GET',
			url: HOST + '/api/user/expenses/'+uid
		});
	}

	function putAccountingToExpense(uid) {
		return $http({
			method: 'PUT',
			url: HOST + '/api/user/expenses/'+uid
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
		getExpense: getExpense,
		putAccountingToExpense: putAccountingToExpense,
		assignToProf: assignToProf
	};

}]);
