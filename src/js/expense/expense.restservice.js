app.factory("expenseRestService", ['$http', 'HOST',

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

	function putExpense(uid, accounting) {
		return $http({
			method: 'PUT',
			url: HOST + '/api/user/expenses/'+uid,
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

		function assignToFinanceAdmin(uid) {
		return $http({
			method: 'PUT',
			url: HOST + '/api/prof/expenses/'+uid+'/assign-to-finance-admin',
		});
	}

		function rejectExpense(uid) {
		return $http({
			method: 'PUT',
			url: HOST + '/api/prof/expenses/'+uid+'/reject',
		});
	}

	return {
		postCreateExpense: postCreateExpense,
		getExpense: getExpense,
		putExpense: putExpense,
		assignToProf: assignToProf,
		assignToFinanceAdmin: assignToFinanceAdmin,
		rejectExpense: rejectExpense
	};

}]);
