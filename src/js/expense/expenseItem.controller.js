/**
 * Created by robinengbersen on 23.05.15.
 */
app.controller('ExpenseItemController', ['$scope', '$filter', 'Currencies', '$modalInstance', 'expenseRestService', 'globalMessagesService',
	function ($scope, $filter, Currencies, $modalInstance, expenseRestService, globalMessagesService) {
		"use strict";

		$scope.dismiss = $modalInstance.dismiss;
		$scope.currencies = Currencies.get();

		$scope.expenseItemAttachmentPath = false;
		$scope.expenseItemUploading = false;
		$scope.expenseItemUploadSucceeded = false;
		$scope.flow = {};
		$scope.filename = undefined;

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
			if ($scope.expenseItem.costCategory.uid === null || $scope.expenseItem.costCategory.uid === undefined) {
				errorMsg.push($filter('translate')('reimbursement.expense.validation.account'));
			}
			if (!f.original.$valid || !f.currency.$valid) {
				errorMsg.push($filter('translate')('reimbursement.expense.validation.amount'));
			}
			if ($scope.expenseItem.amount.currency === undefined || $scope.expenseItem.amount.currency === null || $scope.expenseItem.amount.currency === '') {
				errorMsg.push($filter('translate')('reimbursement.expense.validation.select_currency'));
			}
			if ($scope.expenseItem.amount.value === '') {
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

			if ($scope.expenseItem.amount.currency !== undefined) {
				if ($scope.expenseItem.amount.originalAmount !== '0') {

					// Do not load exchange rate if the selected currency is CHF
					if ($scope.expenseItem.amount.currency !== 'CHF') {
						expenseRestService.getExchangeRates($scope.expenseItem.date).then(function (result) {

							if (result.status === 200) {
								$scope.expenseItem.amount.exchange_rate = result.data.rates[$scope.expenseItem.amount.currency];
								$scope.expenseItem.amount.calculatedAmount = Math.ceil($scope.expenseItem.amount.originalAmount * $scope.expenseItem.amount.exchange_rate);
							} else {
								globalMessagesService.showError(
									$filter('translate')('reimbursement.expense.error.title'),
									$filter('translate')('reimbursement.expense.error.loading_exchange_rate'));
							}

						});
					} else {
						$scope.expenseItem.amount.exchange_rate = 1;
						$scope.expenseItem.amount.calculatedAmount = Math.ceil($scope.expenseItem.amount.originalAmount * $scope.expenseItem.amount.exchange_rate);
					}

				}
			}
		};

		$scope.onSelect = function ($item) {
			$scope.expenseItem.currency = $item.cc;
			this.calculateAmount();
		};


		/**
		 * Initalize fileupload.
		 */
		$scope.initUpload = function () {
			$scope.fileName = undefined;

			$scope.expenseItemUploading = true;
			$scope.alert.success.state = false;
		};

		/**
		 * Upload result handler.
		 * @param uploadSucceded {boolean}
		 */
		$scope.showUploadResult = function (uploadSucceded) {
			$scope.filename = $scope.flow.attachment.files[0].name;
			$scope.expenseItemUploading = false;

			if (uploadSucceded) {
				$scope.expenseItemUploadSucceeded = true;

				$scope.alert.success.state = true;
				$scope.alert.success.value = $filter('translate')('reimbursement.expense.document_upload.succeeded');
			} else {
				$scope.expenseItemUploadSucceeded = false;

				$scope.alert.danger.state = true;
				$scope.alert.danger.value = $filter('translate')('reimbursement.expense.document_upload.error');
			}
		};

		/**
		 * Save the expenseItem on the server if validation passed
		 * and close the modal.
		 * @param form
		 */
		$scope.saveExpenseItem = function (form, addDocument) {
			$scope.alert.danger.state = false;
			var data = {};

			if ($scope.expenseItemAttachmentPath) {
				$modalInstance.dismiss();
			} else {
				if (validation(form)) {
					if ($scope.expenseItem.uid === null) {
						data = {
							"expenseUid": $scope.expense.uid,
							"date": $scope.expenseItem.date,
							"costCategoryUid": $scope.expenseItem.costCategory.uid,
							"reason": $scope.expenseItem.reason,
							"currency": $scope.expenseItem.amount.currency,
							"exchangeRate": $scope.expenseItem.amount.exchange_rate,
							"originalAmount": $scope.expenseItem.amount.originalAmount,
							"calculatedAmount": $scope.expenseItem.amount.calculatedAmount,
							"project": $scope.expenseItem.project
						};
						expenseRestService.postExpenseItem(data)
							.success(function (response, status) {
								if (status === 201 || status === 200) {
									$scope.expenseItem.uid = response.uid;
									$scope.expense.expenseItems.push($scope.expenseItem);
									$scope.getTotal();

									if (addDocument) {
										$scope.expenseItemAttachmentPath = expenseRestService.expenseItemAttachmentPath(response.uid);
									} else {
										$modalInstance.dismiss();
									}
								} else {
									$scope.alert.danger.state = true;
									$scope.alert.danger.value = $filter('translate')('reimbursement.error.body');

									$scope.expenseItemAttachmentPath = false;
								}
							})
							.error(function (response) {
								$scope.alert.danger.state = true;
								$scope.alert.danger.value = $filter('translate')('reimbursement.error.body_message', {message: response.message});

								$scope.expenseItemAttachmentPath = false;
							});
					} else {
						data = {
							"expenseUid": $scope.expense.uid,
							"date": $scope.expenseItem.date,
							"costCategoryUid": $scope.expenseItem.costCategory.uid,
							"reason": $scope.expenseItem.reason,
							"currency": $scope.expenseItem.amount.currency,
							"exchangeRate": $scope.expenseItem.amount.exchange_rate,
							"originalAmount": $scope.expenseItem.amount.originalAmount,
							"calculatedAmount": $scope.expenseItem.amount.calculatedAmount,
							"project": $scope.expenseItem.project
						};
						expenseRestService.putExpenseItem(data, $scope.expenseItem.uid)
							.success(function (response, status) {
								if (status === 201 || status === 200) {
									var id = $scope.find($scope.expense.expenseItems, $scope.expenseItem.uid);
									$scope.expense.expenseItems[id[0]] = $scope.expenseItem;
									$scope.getTotal();

									if (addDocument) {
										$scope.expenseItemAttachmentPath = expenseRestService.expenseItemAttachmentPath(response.expenseItemUid);
									} else {
										$modalInstance.dismiss();
									}
								} else {
									$scope.alert.danger.state = true;
									$scope.alert.danger.value = $filter('translate')('reimbursement.error.body');

									$scope.expenseItemAttachmentPath = false;
								}
							})
							.error(function (response) {
								$scope.alert.danger.state = true;
								$scope.alert.danger.value = $filter('translate')('reimbursement.error.body_message', {message: response.message});

								$scope.expenseItemAttachmentPath = false;
							});

					}
				}
			}
		};

		$scope.dismiss = function () {
			$modalInstance.dismiss();
		};

	}]);