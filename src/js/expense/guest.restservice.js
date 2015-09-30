app.factory('guestViewRestService', ['$http', 'HOST',

	function ($http, HOST) {
		"use strict";

		function fetchExpenseToken(expenseUid) {
			return $http({
				method: 'POST',
				url: HOST + '/api/public/expenses/' + expenseUid + '/token'
			});
		}

		function fetchExpenseItemsToken(expenseUid) {
			return $http({
				method: 'POST',
				url: HOST + '/api/public/expenses/' + expenseUid + '/token'
			});
		}

		function getExpense(token) {
			return $http({
				method: 'GET',
				url: HOST + '/api/public/mobile/' + token + '/expense'
			});
		}

		function getExpenseItems(token) {
			return $http({
				method: 'GET',
				url: HOST + '/api/public/mobile/' + token + '/expenseItems'
			});
		}

		function getExpenseItem(token) {
			return $http({
				method: 'GET',
				url: HOST + '/api/public/mobile/' + token + '/expense-item'
			});
		}

		return {
			fetchExpenseToken: fetchExpenseToken,
			fetchExpenseItemsToken: fetchExpenseItemsToken,
			getExpense: getExpense,
			getExpenseItems: getExpenseItems,
			getExpenseItem: getExpenseItem
		};

	}]);
