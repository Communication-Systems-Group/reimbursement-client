/**
 * Created by robinengbersen on 23.05.15.
 */
app.controller('ReceiptController', ['$scope', '$filter', 'Currencies', '$modalInstance', function ($scope, $filter, Currencies, $modalInstance) {
	"use strict";

	$scope.dismiss = $modalInstance.dismiss;
	$scope.currencies = Currencies.get();
	$scope.receipt.amount.currency = {"cc": "CHF", "symbol": "Fr.", "name": "Swiss franc"};

	$scope.alert = {
		info: {
			state: false,
			value: ''
		},
		success: {
			state: false,
			value: ''
		},
		danger: {
			state: false,
			value: ''
		}
	};

	// ToDo Define account numbers. Should be loaded from server or stored somewhere locally => are linked with the translation
	$scope.accounts = [306020, 306900, 310010, 310040, 310050, 312000, 313000, 313010, 313020, 320240, 320250, 321200, 322000, 322020, 322040, 325050, 325060, 325070, 326000, 329000, 329100, 330000];

	function validation(f) {
		var errorMsg = [];

		if (!f.dateReceipt.$valid) {
			errorMsg.push($filter('translate')('reimbursement.expense.validation.date_receipt'));
		} else if (!f.original.$valid && !f.currency.$valid) {
			errorMsg.push($filter('translate')('reimbursement.expense.validation.amount'));
		} else if (!f.costCentre.$valid) {
			errorMsg.push($filter('translate')('reimbursement.expense.validation.cost_centre'));
		} else if (!f.description.$valid) {
			errorMsg.push($filter('translate')('reimbursement.expense.validation.description'));
		}

		if (errorMsg.length > 0) {
			$scope.alert.danger.state = true;
			$scope.alert.danger.value = '<li>' + errorMsg.join('</li><li>') + '</li>';

			return false;
		} else {
			$scope.alert.state = false;

			return true;
		}
	}

	$scope.open = function ($event) {
		$event.preventDefault();
		$event.stopPropagation();

		$scope.opened = true;
	};

	$scope.calculateAmount = function () {

		if (!!$scope.receipt.amount.original && $scope.receipt.amount.currency.cc !== undefined) {
			// ToDo load exchange rates via server => use localhost:8080/api/public/exchange-rate/
			var dummy_exchange = 1.05;

			$scope.receipt.amount.exchange_rate = dummy_exchange;
			$scope.receipt.amount.value = Math.ceil($scope.receipt.amount.original * dummy_exchange);
		}
	};

	$scope.onSelect = function ($item) {
		$scope.receipt.amount.currency = $item;
		this.calculateAmount();
	};

	$scope.checkAndClose = function (form) {
		if (validation(form)) {
			//console.log('go thru');
		}
	};

}]);