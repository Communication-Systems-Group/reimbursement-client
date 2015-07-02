app.factory("dashboardRestService", ['$http', 'HOST',

	function ($http, HOST) {
		"use strict";

		return {
			getExpenses: function () {
				return $http.get(HOST + "/api/user/expenses");
			}
		};

	}]);
