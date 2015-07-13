/**
 * Created by robinengbersen on 23.05.15.
 */
app.controller('ExpenseItemController', ['$scope', '$filter', 'Currencies', '$modalInstance', 'expenseRestService', 'globalMessagesService',
	function ($scope, $filter, Currencies, $modalInstance, expenseRestService, globalMessagesService) {
		"use strict";

		$scope.dismiss = $modalInstance.dismiss;
		$scope.currencies = Currencies.get();
		$scope.expenseItemAttachmentPath = false;

		if ($scope.expenseItem.uid !== undefined) {
			$scope.amount_original = Math.ceil($scope.expenseItem.amount / $scope.expenseItem.exchangeRate);
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

			if (!f.dateExpenseItem.$valid) {
				errorMsg.push($filter('translate')('reimbursement.expense.validation.date_expense_item'));
			}
			if ($scope.expenseItem.costCategory === null || $scope.expenseItem.costCategory === undefined) {
				errorMsg.push($filter('translate')('reimbursement.expense.validation.account'));
			}
			if (!f.original.$valid || !f.currency.$valid) {
				errorMsg.push($filter('translate')('reimbursement.expense.validation.amount'));
			}
			if ($scope.expenseItem.currency === undefined || $scope.expenseItem.currency === null || $scope.expenseItem.currency === '') {
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
		 * Calculates the total amount of all expenseItems elements.
		 */
		$scope.calculateAmount = function () {

			if ($scope.expenseItem.currency !== undefined) {
				if ($scope.amount_original !== '0') {

					// Do not load exchange rate if the selected currency is CHF
					if ($scope.expenseItem.currency !== 'CHF') {
						expenseRestService.getExchangeRates($scope.expenseItem.date).then(function (result) {

							if (result.status === 200) {
								$scope.expenseItem.exchangeRate = result.data.rates[$scope.expenseItem.currency];
								$scope.expenseItem.amount = Math.ceil($scope.amount_original * $scope.expenseItem.exchangeRate);
							} else {
								globalMessagesService.showError(
									$filter('translate')('expense.error.title'),
									$filter('translate')('expense.error.loading_exchange_rate'));
							}

						});
					} else {
						$scope.expenseItem.exchangeRate = 1;
						$scope.expenseItem.amount = Math.ceil($scope.amount_original * $scope.expenseItem.exchangeRate);
					}

				}
			}
		};

		$scope.onSelect = function ($item) {
			$scope.expenseItem.currency = $item.cc;
			this.calculateAmount();
		};

		/**
		 * Save the expenseItem on the server if validation passed
		 * and close the modal.
		 * @param form
		 */
		$scope.saveExpenseItem = function (form) {
			$scope.alert.danger.state = false;
			var data = {};

			if (validation(form)) {
				if ($scope.expenseItem.isNew) {
					data = {
						"expenseUid": $scope.expenseItem.uid,
						"date": $scope.expenseItem.date,
						"costCategoryUid": $scope.expenseItem.costCategory.uid,
						"reason": $scope.expenseItem.reason,
						"currency": $scope.expenseItem.currency,
						"exchangeRate": $scope.expenseItem.exchangeRate,
						"amount": $scope.expenseItem.amount,
						"project": $scope.expenseItem.project
					};
					expenseRestService.postExpenseItem(data)
						.success(function (response, status) {
							if (status === 201) {
								$scope.expenseItem.uid = response.expenseItemUid;
								$scope.expense.expenseItems.push($scope.expenseItem);
								$scope.getTotal();

								$scope.expenseItemAttachmentPath = expenseRestService.expenseItemAttachmentPath(response.expenseItemUid);
							} else {
								$scope.alert.danger.state = true;
								$scope.alert.danger.value = $filter('translate')('expense.error.body');

								$scope.expenseItemAttachmentPath = false;
							}
						})
						.error(function (response) {
							$scope.alert.danger.state = true;
							$scope.alert.danger.value = $filter('translate')('expense.error.body_message', {message: response.message});

							$scope.expenseItemAttachmentPath = false;
						});
				} else {
					data = {
						"expenseUid": $scope.expense.uid,
						"date": $scope.expenseItem.date,
						"costCategoryUid": $scope.expenseItem.costCategory.uid,
						"reason": $scope.expenseItem.reason,
						"currency": $scope.expenseItem.currency,
						"exchangeRate": $scope.expenseItem.exchangeRate,
						"amount": $scope.expenseItem.amount,
						"project": $scope.expenseItem.project
					};
					expenseRestService.putExpenseItem(data, $scope.expenseItem.uid)
						.success(function (response, status) {
							if (status === 201) {
								var id = $scope.find($scope.expense.expenseItems, $scope.expenseItem.id);
								$scope.expense.expenseItems[id[0]] = $scope.expenseItem;
								$scope.getTotal();

								$scope.expenseItemAttachmentPath = expenseRestService.expenseItemAttachmentPath(response.expenseItemUid);
							} else {
								$scope.alert.danger.state = true;
								$scope.alert.danger.value = $filter('translate')('expense.error.body');

								$scope.expenseItemAttachmentPath = false;
							}
						})
						.error(function (response) {
							$scope.alert.danger.state = true;
							$scope.alert.danger.value = $filter('translate')('expense.error.body_message', {message: response.message});

							$scope.expenseItemAttachmentPath = false;
						});

				}
			}
		};

		$scope.dismiss = function () {
			$modalInstance.dismiss();
		};

	}]);