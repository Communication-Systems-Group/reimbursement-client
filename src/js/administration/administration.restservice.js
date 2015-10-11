app.factory('administrationRestService', ['$http', 'HOST',

	function ($http, HOST) {

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

		function deleteCostCategory(uid) {
			return $http.delete(HOST + '/api/finance-admin/cost-categories/' + uid);
		}

		function getRoles() {
			return $http.get(HOST + '/api/finance-admin/roles');
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

		return {
			getCostCategories: getCostCategories,
			postCostCategory: postCostCategory,
			putCostCategory: putCostCategory,
			deleteCostCategory: deleteCostCategory,
			getRoles: getRoles,
			search: search,
			getExpenseStateRawData: getExpenseStateRawData
		};
	}]);
