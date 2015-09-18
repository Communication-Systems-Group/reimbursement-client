app.factory('dashboardRestService', ['$http', 'HOST',

function($http, HOST) {

	'use strict';

	function getMyExpenses() {
		return $http.get(HOST + '/api/expenses');
	}

	function getReviewExpenses() {
		return $http.get(HOST + '/api/expenses/review-expenses');
	}

	function assignToMe(uid) {
		return $http({
			method: 'PUT',
			url: HOST + '/api/expenses/'+uid+'/assign-to-me'
		});
	}

	function deleteExpense(uid) {
		return $http({
			method: 'DELETE',
			url: HOST + '/api/expenses/'+uid
		});
	}

	return {
		getMyExpenses: getMyExpenses,
		assignToMe: assignToMe,
		getReviewExpenses: getReviewExpenses,
		deleteExpense: deleteExpense
	};

}]);
