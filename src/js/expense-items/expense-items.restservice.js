app.factory("expenseItemsRestService", ['$http', 'HOST',

function($http, HOST) {
	"use strict";

	function postExpenseItem(uid, data) {
		return $http({
			method: 'POST',
			url: HOST + '/api/expenses/' + uid + '/expense-items',
			data: data
		});
	}

	function getCostCategories() {
		return $http({
			method: 'GET',
			url: HOST + '/api/public/cost-categories'
		});
	}

	function getExpenseItems(expenseUid) {
		return $http({
			method: 'GET',
			url: HOST + '/api/expenses/' + expenseUid + '/expense-items'
		});
	}

	function getExpenseItem(expenseItemUid) {
		return $http({
			method: 'GET',
			url: HOST + '/api/expenses/expense-items/' + expenseItemUid
		});
	}

	function deleteExpenseItem(uid) {
		return $http({
			method: 'DELETE',
			url: HOST + '/api/expenses/expense-items/' + uid
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

	function putExpenseItem(uid, data) {
		return $http({
			method: "PUT",
			url: HOST + '/api/expenses/expense-items/' + uid,
			data: data
		});
	}

	return {
		postExpenseItem: postExpenseItem,
		getCostCategories: getCostCategories,
		getExpenseItems: getExpenseItems,
		getExpenseItem: getExpenseItem,
		putExpenseItem: putExpenseItem,
		deleteExpenseItem: deleteExpenseItem,
		getSupportedCurrencies: getSupportedCurrencies,
		getExchangeRates: getExchangeRates
	};

}]);
