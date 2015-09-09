app.factory('dashboardRestService', ['$http', 'HOST',

function($http, HOST) {

	'use strict';

	function getMyExpenses() {
		return $http.get(HOST + '/api/user/expenses');
	}

	function getReviewExpensesAsFinanceAdmin() {
		return $http.get(HOST + '/api/finance-admin/review-expenses');
	}

	function getReviewExpensesAsProf() {
		return $http.get(HOST + '/api/prof/review-expenses');
	}

	function deleteExpense(uid) {
		return $http.delete(HOST + '/api/user/expenses/' + uid);
	}

	return {
		getMyExpenses: getMyExpenses,
		getReviewExpensesAsFinanceAdmin: getReviewExpensesAsFinanceAdmin,
		getReviewExpensesAsProf: getReviewExpensesAsProf,
		deleteExpense: deleteExpense
	};

}]);
