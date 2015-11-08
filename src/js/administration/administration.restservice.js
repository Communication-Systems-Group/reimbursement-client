app.factory('administrationRestService', ['$http', 'HOST',

function($http, HOST) {

	'use strict';

	function getCostCategories() {
		return $http.get(HOST + '/api/public/cost-categories');
	}

	function postCostCategory(data) {
		return $http({
			method: 'POST',
			url: HOST + '/api/finance-admin/cost-categories',
			data: data
		});
	}

	function putCostCategory(data, uid) {
		return $http({
			method: 'PUT',
			url: HOST + '/api/finance-admin/cost-categories/' + uid,
			data: data
		});
	}

	function deactivateCostCategory(uid) {
		return $http({
			method: 'PUT',
			url: HOST + '/api/finance-admin/cost-categories/' + uid + '/deactivate'
		});
	}

	function activateCostCategory(uid) {
		return $http({
			method: 'PUT',
			url: HOST + '/api/finance-admin/cost-categories/' + uid + '/activate'
		});
	}

	function getRoles() {
		return $http.get(HOST + '/api/finance-admin/roles');
	}

	function getExpenseStates() {
		return $http.get(HOST + '/api/expenses/expense-states');
	}

	function search(data) {
		return $http({
			method: 'POST',
			url: HOST + '/api/expenses/search',
			data: data
		});
	}

	function getExpenseStateRawData() {
		return $http.get(HOST + '/api/expenses/statistics/states');
	}

	function assignToMe(uid) {
		return $http({
			method: 'PUT',
			url: HOST + '/api/expenses/' + uid + '/assign-to-me'
		});
	}

	return {
		getCostCategories: getCostCategories,
		postCostCategory: postCostCategory,
		putCostCategory: putCostCategory,
		deactivateCostCategory: deactivateCostCategory,
		activateCostCategory: activateCostCategory,
		getRoles: getRoles,
		getExpenseStates: getExpenseStates,
		search: search,
		getExpenseStateRawData: getExpenseStateRawData,
		assignToMe: assignToMe
	};
}]);
