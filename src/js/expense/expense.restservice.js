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
			return $http.get(HOST + '/api/user/cost-categories');
		}

		/**
		 * Uploads a new expense item and returns the http promise.
		 * @param data {bookingText, assignedManagerUid, state}
		 * @returns {HttpPromise}
		 */
		function postExpense(data) {
			return $http({
				method: 'POST',
				url: HOST + '/api/user/expenses',
				data: data
			});
		}

		/**
		 * Downloads an expense for the specified uid and returns the http promise.
		 * @param data {uid}
		 * @returns {HttpPromise}
		 */
		function getExpense(data) {
			return $http({
				method: 'GET',
				url: HOST + '/api/user/expenses/' + data.uid,
				data: data
			});
		}

		/**
		 * Updates an existing expense item and returns the http promise.
		 * @param data [uid, bookingText, assignedManagerUid, state]
		 * @returns {HttpPromise}
		 */
		function putExpense(data) {
			return $http({
				method: 'PUT',
				url: HOST + '/api/user/expenses/' + data.uid,
				data: data
			});
		}

		/**
		 * Sends a comment to the server and returns a http promise.
		 * @param data [uid, text]
		 * @returns {HttpPromise}
		 */
		function postComment(data) {
			return $http({
				method: 'POST',
				url: HOST + '/api/user/expenses/' + data.uid + '/comments',
				data: data
			});
		}

		/**
		 * Sends a new expense item to the server and returns
		 * the http promise.
		 * @param data
		 * @returns {*}
		 */
		function postExpenseItem(data) {
			return $http({
				method: 'POST',
				url: HOST + '/api/user/expenses/' + data.expenseUid + '/expense-items',
				data: data
			});
		}

		/**
		 * Modifies an existing expense item on the server
		 * and returns the http promise.
		 * @param data
		 * @param uid
		 * @returns {*}
		 */
		function putExpenseItem(data, uid) {
			return $http({
				method: 'PUT',
				url: HOST + '/api/user/expenses/expense-items/' + uid,
				data: data
			});
		}

		/**
		 * Returns the url for the expense attachment upload directory.
		 * @param expenseItem_uid {String}
		 * @returns {*}
		 */
		function expenseItemAttachmentPath(expenseItem_uid) {
			return HOST + '/api/user/expenses/expense-items/' + expenseItem_uid + '/attachments';
		}

		return {
			getExchangeRates: getExchangeRates,
			getCostCategories: getCostCategories,
			getExpense: getExpense,
			postExpense: postExpense,
			putExpense: putExpense,
			postComment: postComment,
			postExpenseItem: postExpenseItem,
			putExpenseItem: putExpenseItem,
			expenseItemAttachmentPath: expenseItemAttachmentPath
		};

	}]);