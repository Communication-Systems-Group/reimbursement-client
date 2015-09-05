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

	function getExpenseItems(expenseUid) {
		return $http({
			method: 'GET',
			url: HOST + '/api/user/expenses/'+expenseUid+'/expense-items'
		});
	}

	function getExpenseItem(expenseItemUid) {
		return $http({
			method: 'GET',
			url: HOST + '/api/user/expenses/expense-items/'+expenseItemUid
		});
	}

	function deleteExpenseItem(uid) {
		return $http({
			method: 'DELETE',
			url: HOST + '/api/user/expenses/expense-items/'+uid
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
			url: HOST + '/api/user/expenses/expense-items/'+uid,
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
