/**
 * Created by robinengbersen on 23.05.15.
 */
app.controller('ReceiptController', ['$scope', '$filter', 'Currencies', '$modalInstance', 'expenseRestService', 'globalMessagesService',
	function ($scope, $filter, Currencies, $modalInstance, expenseRestService, globalMessagesService) {
		"use strict";

		$scope.dismiss = $modalInstance.dismiss;
		$scope.currencies = Currencies.get();

		if ($scope.receipt.uid !== undefined) {
			$scope.amount_original = Math.ceil($scope.receipt.amount / $scope.receipt.exchangeRate);
		} else {
			$scope.amount_original = '0';
		}

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

//		function getCostCategories() {
//			expenseRestService.getCostCategories()
//				.success(function (response) {
//					$scope.accounts = response;
//				})
//				.error(function () {
//					globalMessagesService.showInfo($filter('translate')('reimbursement.error.title'), $filter('translate')('reimbursement.error.body'))
//				});
//		}

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
			if ($scope.receipt.costCategory === null || $scope.receipt.costCategory === undefined) {
				errorMsg.push($filter('translate')('reimbursement.expense.validation.account'));
			}
			if (!f.original.$valid || !f.currency.$valid) {
				errorMsg.push($filter('translate')('reimbursement.expense.validation.amount'));
			}
			if ($scope.receipt.currency === undefined || $scope.receipt.currency === null || $scope.receipt.currency === '') {
				errorMsg.push($filter('translate')('reimbursement.expense.validation.select_currency'));
			}
			if (!f.project.$valid) {
				errorMsg.push($filter('translate')('reimbursement.expense.validation.cost_centre'));
			}
			if (!f.reason.$valid) {
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

			if ($scope.receipt.currency !== undefined) {
				if ($scope.amount_original !== '0' && $scope.receipt.currency !== undefined) {

					// Do not load exchange rate if the selected currency is CHF
					if ($scope.receipt.currency !== 'CHF') {
						expenseRestService.getExchangeRates($scope.receipt.date).then(function (result) {

							if (result.status === 200) {
								$scope.receipt.exchangeRate = result.data.rates[$scope.receipt.currency];
								$scope.receipt.amount = Math.ceil($scope.amount_original * $scope.receipt.exchangeRate);
							} else {
								globalMessagesService.showError(
									$filter('translate')('expense.error.title'),
									$filter('translate')('expense.error.loading_exchange_rate'));
							}

						});
					} else {
						$scope.receipt.exchangeRate = 1;
						$scope.receipt.amount = Math.ceil($scope.amount_original * $scope.receipt.exchangeRate);
					}

				}
			}
		};

		$scope.onSelect = function ($item) {
			$scope.receipt.currency = $item.cc;
			this.calculateAmount();
		};

		/**
		 * Save the receipt on the server if validation passed
		 * and close the modal.
		 * @param form
		 */
		$scope.saveReceipt = function (form) {
			$scope.alert.danger.state = false;

			if (validation(form)) {
				if ($scope.receipt.isNew) {
					var d = {
						"expenseUid": $scope.expense.uid,
						"date": $scope.receipt.date,
						"costCategoryUid": $scope.receipt.costCategory.uid,
						"reason": $scope.receipt.reason,
						"currency": $scope.receipt.currency,
						"exchangeRate": $scope.receipt.exchangeRate,
						"amount": $scope.receipt.amount,
						"project": $scope.receipt.project
					};
					expenseRestService.postExpenseItem(d)
						.success(function (response, status) {
							if (status === 201) {
								$scope.expense.expenseItems.push($scope.receipt);
								$scope.getTotal();

								$scope.modalReceipt.close();
							} else {
								$scope.alert.danger.state = true;
								$scope.alert.danger.value = $filter('translate')('expense.error.body');
							}
						})
						.error(function (response) {
							console.log(response);
						});
				} else {
					var dd = {
						"expenseUid": $scope.expense.uid,
						"date": $scope.receipt.date,
						"costCategoryUid": $scope.receipt.costCategory.uid,
						"reason": $scope.receipt.reason,
						"currency": $scope.receipt.currency,
						"exchangeRate": $scope.receipt.exchangeRate,
						"amount": $scope.receipt.amount,
						"project": $scope.receipt.project
					};
					expenseRestService.putExpenseItem(dd, $scope.receipt.uid)
						.success(function (response, status) {
							if (status === 201) {
								var id = $scope.find($scope.expense.expenseItems, $scope.receipt.id);
								$scope.expense.expenseItems[id[0]] = $scope.receipt;
								$scope.getTotal();

								$scope.modalReceipt.close();
							} else {
								$scope.alert.danger.state = true;
								$scope.alert.danger.value = $filter('translate')('expense.error.body');
							}
						})
						.error(function (response) {
							console.log(response);
						});

				}
			}
		};

		$scope.dismiss = function () {
			$modalInstance.dismiss();
		};

	}]);