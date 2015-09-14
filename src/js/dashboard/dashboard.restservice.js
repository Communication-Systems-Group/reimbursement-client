app.factory('dashboardRestService', ['$http', 'HOST',

function($http, HOST) {

	'use strict';

	function getMyExpenses() {
		return $http.get(HOST + '/api/expenses');
	}

	function getReviewExpenses() {
		return $http.get(HOST + '/api/expenses/review-expenses');
	}

	function deleteExpense(uid) {
		return $http.delete(HOST + '/api/expenses/' + uid);
	}

	return {
		getMyExpenses: getMyExpenses,
		getReviewExpenses: getReviewExpenses,
		deleteExpense: deleteExpense
	};

}]);
