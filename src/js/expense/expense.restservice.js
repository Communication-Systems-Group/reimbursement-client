app.factory("expenseRestService", ['$http', 'HOST',

function($http, HOST) {
	"use strict";

	function postCreateExpense(accounting) {
		return $http({
			method: 'POST',
			url: HOST + '/api/expenses',
			data: {
				accounting: accounting
			}
		});
	}

	function getExpense(uid) {
		return $http({
			method: 'GET',
			url: HOST + '/api/expenses/'+uid
		});
	}

	function putExpense(uid, accounting) {
		return $http({
			method: 'PUT',
			url: HOST + '/api/expenses/'+uid,
			data: {
				accounting: accounting
			}
		});
	}

	function accept(uid) {
		return $http({
			method: 'PUT',
			url: HOST + '/api/expenses/'+uid+'/accept',
		});
	}

	function assignToProf(uid) {
		return $http({
			method: 'PUT',
			url: HOST + '/api/expenses/'+uid+'/assign-to-prof',
		});
	}

		function reject(uid, reason) {
		return $http({
			method: 'PUT',
			url: HOST + '/api/expenses/'+uid+'/reject',
			data: {
				text: reason
			}
		});
	}

	function getAccessRights(uid) {
		return $http({
			method: 'GET',
			url: HOST + '/api/expenses/'+uid+'/access-rights'
		});
	}

	return {
		postCreateExpense: postCreateExpense,
		getExpense: getExpense,
		putExpense: putExpense,
		assignToProf: assignToProf,
		getAccessRights: getAccessRights,
		accept: accept,
		reject: reject
	};

}]);
