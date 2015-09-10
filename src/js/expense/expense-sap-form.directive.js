app.directive('expenseSapForm', [

function() {
	"use strict";

	return {
		restrict: 'E',
		templateUrl: 'expense/expense-sap-form.tpl.html',
		scope: {
			accountingText: '='
		}
	};

}]);
