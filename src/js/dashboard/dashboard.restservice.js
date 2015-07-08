app.factory('dashboardRestService', ['$http', 'HOST',

	function ($http, HOST) {
		'use strict';

		function getExpenses() {
			return $http.get(HOST + '/api/user/expenses');
		}

		function deleteExpense(uid) {
			return $http({method: 'DELETE', url: HOST + '/api/user/expense/' + uid});
		}

		return {
			getExpenses: getExpenses,
			deleteExpense: deleteExpense
		};

	}]);
