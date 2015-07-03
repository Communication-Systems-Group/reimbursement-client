/**
 * Created by robinengbersen on 03.07.15.
 */
app.factory("expenseRestService", ['$http', 'HOST',

	function ($http, HOST) {
		"use strict";

		return {
			getExchangeRates: function (date) {
				return $http.get(HOST + '/api/public/exchange-rate', {
						params: {
							date: date.toISOString().slice(0, 10)
						}
					}
				)
					;
			}
		}
			;

	}])
;