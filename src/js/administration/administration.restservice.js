app.factory('administrationRestService', ['$http', 'HOST',

	function ($http, HOST) {

		'use strict';

		function getCostCategories() {
			return $http.get(HOST + '/api/user/cost-categories');
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

		return {
			getCostCategories: getCostCategories,
			postCostCategory: postCostCategory,
			putCostCategory: putCostCategory,
			deleteCostCategory: deleteCostCategory
		};

	}]);
