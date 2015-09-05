app.factory("addExpenseItemRestService", ['$http', 'HOST',

function($http, HOST) {
	"use strict";

	function getExpenseItem(uid) {
		return $http({
			method: 'GET',
			url: HOST + '/api/user/expenses/expense-items/' + uid
		});
	}

	function deleteExpenseItem(uid) {
		return $http({
			method: 'DELETE',
			url: HOST + '/api/user/expenses/expense-items/' + uid
		});
	}

	function getCostCategories() {
		return $http({
			method: 'GET',
			url: HOST + '/api/user/cost-categories'
		});
	}

	function getSupportedCurrencies() {
		return $http({
			method: "GET",
			url: HOST + '/api/public/currencies'
		});
	}

	function getExchangeRates(date) {
		return $http({
			method: "GET",
			url: HOST + '/api/public/exchange-rate',
			params: {
				date: date
			}
		});
	}

	return {
		getExpenseItem: getExpenseItem,
		deleteExpenseItem: deleteExpenseItem,
		getCostCategories: getCostCategories,
		getSupportedCurrencies: getSupportedCurrencies,
		getExchangeRates: getExchangeRates
	};

}]);
