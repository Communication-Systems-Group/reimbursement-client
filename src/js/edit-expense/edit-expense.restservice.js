app.factory("editExpenseRestService", ['$http', 'HOST',

function($http, HOST) {
	"use strict";

	function postExpenseItem(uid, data) {
		return $http({
			method: 'POST',
			url: HOST + '/api/user/expenses/'+uid+'/expense-items',
			data: data
		});
	}

	function getCostCategories() {
		return $http({
			method: 'GET',
			url: HOST + '/api/user/cost-categories'
		});
	}

	return {
		postExpenseItem: postExpenseItem,
		getCostCategories: getCostCategories
	};

}]);
