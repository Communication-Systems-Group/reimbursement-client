app.factory('archiveRestService', ['$http', 'HOST',

function($http, HOST) {

	'use strict';

	function getArchivedExpenses() {
		return $http.get(HOST + '/api/expenses/archive');
	}

	return {
		getArchivedExpenses: getArchivedExpenses
	};
}]);
