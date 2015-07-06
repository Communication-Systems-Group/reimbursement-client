/**
 * Created by robinengbersen on 03.07.15.
 */
app.factory("expenseRestService", ['$http', 'HOST',

	function ($http, HOST) {
		"use strict";

		function getExchangeRates(date) {
			return $http.get(HOST + '/api/public/exchange-rate', {
					params: {
						date: date.toISOString().slice(0, 10)
					}
				}
			);
		}

		function getCostCategories() {
			return $http.get(HOST + '/api/user/costCategories');
		}

		/**
		 *
		 * @param method {POST, GET, PUT, DELETE}
		 * @param data
		 * @returns {HttpPromise}
		 */
		function getExpense(method, data) {
			return $http({
				method: method,
				url: HOST + '/api/user/expenses',
				data: data
			});
		}

		return {
			getExchangeRates: getExchangeRates,
			getCostCategories: getCostCategories,
			getExpense: getExpense
		};

	}]);