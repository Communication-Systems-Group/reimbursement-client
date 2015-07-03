/**
 * Created by robinengbersen on 23.05.15.
 */
app.factory('Currencies', [

	function () {
		"use strict";

		return {
			get: function () {
				return [
					{"cc": "CHF", "symbol": "Fr.", "name": "Swiss franc"},
					{"cc": "AUD", "symbol": "$", "name": "Australian dollar"},
					{"cc": "BGN", "symbol": "BGN", "name": "Bulgarian lev"},
					{"cc": "BRL", "symbol": "R$", "name": "Brazilian real"},
					{"cc": "CAD", "symbol": "$", "name": "Canadian dollar"},
					{"cc": "CNY", "symbol": "\u00a5", "name": "Chinese/Yuan renminbi"},
					{"cc": "CZK", "symbol": "K\u010d", "name": "Czech koruna"},
					{"cc": "DKK", "symbol": "Kr", "name": "Danish krone"},
					{"cc": "EUR", "symbol": "\u20ac", "name": "European Euro"},
					{"cc": "GBP", "symbol": "\u00a3", "name": "British pound"},
					{"cc": "HKD", "symbol": "HK$", "name": "Hong Kong dollar"},
					{"cc": "HRK", "symbol": "kn", "name": "Croatian kuna"},
					{"cc": "HUF", "symbol": "Ft", "name": "Hungarian forint"},
					{"cc": "IDR", "symbol": "Rp", "name": "Indonesian rupiah"},
					{"cc": "ILS", "symbol": "\u20aa", "name": "Israeli new sheqel"},
					{"cc": "INR", "symbol": "\u20B9", "name": "Indian rupee"},
					{"cc": "JPY", "symbol": "\u00a5", "name": "Japanese yen"},
					{"cc": "KRW", "symbol": "W", "name": "South Korean won"},
					{"cc": "MXN", "symbol": "$", "name": "Mexican peso"},
					{"cc": "MYR", "symbol": "RM", "name": "Malaysian ringgit"},
					{"cc": "NOK", "symbol": "kr", "name": "Norwegian krone"},
					{"cc": "NZD", "symbol": "NZ$", "name": "New Zealand dollar"},
					{"cc": "PHP", "symbol": "\u20b1", "name": "Philippine peso"},
					{"cc": "PLN", "symbol": "z\u0142", "name": "Polish zloty"},
					{"cc": "RON", "symbol": "L", "name": "Romanian leu"},
					{"cc": "RUB", "symbol": "R", "name": "Russian ruble"},
					{"cc": "SEK", "symbol": "kr", "name": "Swedish krona"},
					{"cc": "SGD", "symbol": "S$", "name": "Singapore dollar"},
					{"cc": "THB", "symbol": "\u0e3f", "name": "Thai baht"},
					{"cc": "TRY", "symbol": "TRY", "name": "Turkish new lira"},
					{"cc": "USD", "symbol": "US$", "name": "United States dollar"},
					{"cc": "ZAR", "symbol": "R", "name": "South African rand"},
					{"cc": "ZMK", "symbol": "ZK", "name": "Zambian kwacha"},
					{"cc": "ZWR", "symbol": "Z$", "name": "Zimbabwean dollar"}
				];
			}
		};

	}]);