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
			var r = [
				{
					"uid": "a353602d-50d0-4007-b134-7fdb42f23542",
					"name": {
						de: "Reisekosten/Spesen",
						en: "Travel expenses"
					},
					"description": {
						de: "Kosten für Reisen im Rahmen der universitären Tätigkeit zb. Fahrkosten, Flugkosten, Bahnkosten, Taxi, Reisetickets Übernachtungen, Hotel, Verpflegungskosten auswärts SBB, ESTA",
						en: ""
					},
					"accountingPolicy": {
						de: "ACHTUNG: - Reisespesen von Dritte auf das Konto 322040 verbuchen\n- Gipfeli und Sandwich für Sitzungen im Büro auf das Konto 306900 buchen\n- Teilnahmegebühren für Kongresse auf das Konto 306020 buchen",
						en: ""
					},
					"accounts": []
				},
				{
					"uid": "0618c572-62e8-47c1-b053-6dd005dd9eb7",
					"name": {
						de: "Repräsentationsspesen",
						en: ""
					},
					"description": {
						de: "Repräsentationsspesen, Geschenke, Getränke und Essen für Sitzungen, Kosten für Einladungen zu Essen im Zusammenhang mit Kunden (Keine UZH-Anstellung)",
						en: ""
					},
					"accountingPolicy": {
						de: "Bei der Kontierung von Rechnungen ist jeweils der geschäftliche Zweck des Anlasses und die Teilnehmerschaft aufzuführen.\n\nACHTUNG:\n- Dieses Konto wird für Kosten im Zusammenhang mit Personen, welche keine  UZH-Anstellung haben, verwendet \n- Es ist klar zu unterscheiden von den Kosten für UZH-Angehörige (Verschiedene Personalkosten: 306900)",
						en: ""
					},
					"accounts": []
				}
			];

			return r;
			//return $http.get(HOST + '/api/user/costCategories');
		}

		/**
		 *
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
		 *
		 * @param data {uid}
		 * @returns {HttpPromise}
		 */
		function getExpense(data) {
			return $http({
				method: 'GET',
				url: HOST + '/api/user/expenses/' + data.uid + '/expense-items',
				data: data
			});
		}

		/**
		 *
		 * @param data {uid, bookingText, assignedManagerUid, state}
		 * @returns {HttpPromise}
		 */
		function putExpense(data) {
			return $http({
				method: 'PUT',
				url: HOST + '/api/user/expenses/' + data.uid + '/expense-items',
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

		return {
			getExchangeRates: getExchangeRates,
			getCostCategories: getCostCategories,
			getExpense: getExpense,
			postExpense: postExpense,
			putExpense: putExpense,
			postExpenseItem: postExpenseItem,
			putExpenseItem: putExpenseItem
		};

	}]);