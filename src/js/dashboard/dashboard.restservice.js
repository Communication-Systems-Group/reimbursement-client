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

	return {
		getMyExpenses: getMyExpenses,
		getReviewExpensesAsFinanceAdmin: getReviewExpensesAsFinanceAdmin,
		getReviewExpensesAsProf: getReviewExpensesAsProf
	};

}]);
