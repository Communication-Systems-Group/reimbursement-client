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

	function getReviewExpenseAsProf(uid) {
		return $http({
			method: 'GET',
			url: HOST + '/api/prof/review-expenses/'+uid
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

	return {
		postCreateExpense: postCreateExpense,
		getExpense: getExpense,
		getReviewExpenseAsProf: getReviewExpenseAsProf,
		putExpense: putExpense,
		assignToProf: assignToProf
	};

}]);
