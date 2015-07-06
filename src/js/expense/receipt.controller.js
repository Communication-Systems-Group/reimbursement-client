/**
 * Created by robinengbersen on 23.05.15.
 */
app.controller('ReceiptController', ['$scope', '$filter', 'Currencies', '$modalInstance', 'expenseRestService', 'globalMessagesService',
	function ($scope, $filter, Currencies, $modalInstance, expenseRestService, globalMessagesService) {
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

		/**
		 * Validates inputs and stores error messages into an array. Returns true if there are no
		 * validation errors and false if there are.
		 * @param f form object
		 * @returns {boolean}
		 */
		function validation(f) {
			var errorMsg = [];

			if (!f.dateReceipt.$valid) {
				errorMsg.push($filter('translate')('reimbursement.expense.validation.date_receipt'));
			}
			if ($scope.receipt.account === null) {
				errorMsg.push($filter('translate')('reimbursement.expense.validation.account'));
			}
			if (!f.original.$valid || !f.currency.$valid) {
				errorMsg.push($filter('translate')('reimbursement.expense.validation.amount'));
			}
			if ($scope.receipt.amount.currency === undefined) {
				errorMsg.push($filter('translate')('reimbursement.expense.validation.select_currency'));
			}
			if (!f.costCentre.$valid) {
				errorMsg.push($filter('translate')('reimbursement.expense.validation.cost_centre'));
			}
			if (!f.description.$valid) {
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

		/**
		 * Calculates the total amount of all receipt elements.
		 */
		$scope.calculateAmount = function () {

			if ($scope.receipt.amount.currency !== undefined) {
				if (!!$scope.receipt.amount.original && $scope.receipt.amount.currency.cc !== undefined) {

					// Do not load exchange rate if the selected currency is CHF
					if ($scope.receipt.amount.currency.cc !== 'CHF') {
						expenseRestService.getExchangeRates($scope.receipt.date_receipt).then(function (result) {

							if (result.status === 200) {
								$scope.receipt.amount.exchange_rate = result.data.rates[$scope.receipt.amount.currency.cc];
								$scope.receipt.amount.value = Math.ceil($scope.receipt.amount.original * $scope.receipt.amount.exchange_rate);
							} else {
								globalMessagesService.showError('expense.error.title', 'expense.error.loading_exchange_rate');
							}

						});
					} else {
						$scope.receipt.amount.exchange_rate = 1;
						$scope.receipt.amount.value = Math.ceil($scope.receipt.amount.original * $scope.receipt.amount.exchange_rate);
					}

				}
			}
		};

		$scope.onSelect = function ($item) {
			$scope.receipt.amount.currency = $item;
			this.calculateAmount();
		};

		/**
		 * Save the receipt on the server if validation passed
		 * and close the modal.
		 * @param form
		 */
		$scope.saveReceipt = function (form) {
			if (validation(form)) {
				if ($scope.receipt.isNew) {
					$scope.expense.receipts.push($scope.receipt);
				} else {
					var id = $scope.find($scope.expense.receipts, $scope.receipt.id);
					$scope.expense.receipts[id[0]] = $scope.receipt;
				}

				$scope.getTotal();

				// ToDo store receipt on server, close it only if receipt has been stored successfully
				$scope.modalReceipt.close();
			}
		};

	}]);