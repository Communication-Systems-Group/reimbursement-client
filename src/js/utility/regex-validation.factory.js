app.factory('regexValidation', [

	function() {
		"use strict";

		var FIELDS = [
			{
				name: "registration.personalNumber",
				pattern: "[1]{1}[0-9]{6}"
			},
			{
				name: "registration.phoneNumber",
				pattern: "[0]{1}[0-9]{9}"
			},
			{
				name: "expense.sapDescription",
				pattern: "(\\d|[\\S](?!.*\\s{2,}).*[\\S]|\\w){3,50}"
			},
			{
				name: "expense.amount",
				pattern: ""
			},
			{
				name: "expense.project",
				pattern: "(\\d|[\\S](?!.*\\s{2,}).*[\\S]|\\w){5,255}"
			},
			{
				name: "expense.explanation",
				pattern: "(\\d|[\\S](?!.*\\s{2,}).*[\\S]|\\n|\\w){5,50}"
			},
			{
				name: "expense.reject.reason",
				pattern: "(\\d|[\\S](?!.*\\s{2,}).*[\\S]|\\w){10,50}"
			},
			{
				name: "admin.search.lastname",
				pattern: "(\\d|[\\S](?!.*\\s{2,}).*[\\S]|\\w){3,50}"
			},
			{
				name: "admin.search.sapDescription",
				pattern: "(\\d|[\\S](?!.*\\s{2,}).*[\\S]|\\w){3,50}"
			},
			{
				name: "admin.costCategories.number",
				pattern: "^[0-9]*"
			},
			{
				name: "admin.costCategories.name",
				pattern: "(\\d|[\\S](?!.*\\s{2,}).*[\\S]|\\w){2,50}"
			},
			{
				name: "admin.costCategories.description",
				pattern: "(\\d|[\\S](?!.*\\s{2,}).*[\\S]|\\n|\\w){3,50}"
			}
		];

		function getPattern(name) {
			var returnValue;

			for(var i = 0; i < FIELDS.length; i++) {
				if(FIELDS[i].name === name) {
					returnValue = FIELDS[i].pattern;
					break;
				}
			}
			return returnValue;
		}

		return {
			getPattern: getPattern
		};

	}]);