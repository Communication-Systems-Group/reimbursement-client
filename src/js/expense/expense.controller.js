/**
 * Created by robinengbersen on 23.05.15.
 */
app.controller('ExpenseController', ['$scope', '$filter', '$state', '$stateParams', '$modal', 'expenseRestService', 'globalMessagesService',

	function ($scope, $filter, $state, $stateParams, $modal, expenseRestService, globalMessagesService) {
		"use strict";

		$scope.expenseId = $stateParams.id;
		$scope.receiptChanges = false;

		$scope.note = '';

		$scope.find = function (obj, id) {
			for (var i = 0; i < obj.length; i++) {
				if (obj[i].id === id) {
					return [i, obj[i]];
				}
			}
		};

		$scope.getTotal = function () {
			var total = 0;

			for (var i = 0; i < $scope.expense.receipts.length; i++) {
				total += parseFloat($scope.expense.receipts[i].amount.value);
			}

			$scope.total = total;
		};

		/**
		 * Initalize empty expense object
		 * @type {{id: number, creator: {name: string}, contact: {person: {name: string}, phone: string}, accounting: string, note: Array, receipts: Array}}
		 */
		$scope.expense = {
			id: 1,
			creator: {
				name: ''
			},
			contact: {
				person: {
					name: ''
				},
				phone: ''
			},
			bookingText: '',
			note: [
				{
					date: '2015-05-11T18:00:00.000+02:00',
					person: {
						ldap_id: 20,
						name: 'Burkhard Stiller'
					},
					text: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.'
				},

				{
					date: '2015-03-12T15:12:00.000+02:00',
					person: {
						ldap_id: 23,
						name: 'Jens Meier'
					},
					text: 'Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.'
				},
				{
					date: '2015-05-12T16:30:00.000+02:00',
					person: {
						ldap_id: 23,
						name: 'Jens Meier'
					},
					text: 'At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.'
				}
			],
			receipts: []
		};

		$scope.getTotal();

		$scope.uploadReceipt = function () {
			// ToDo
		};

		/**
		 * Creates an empty receipt element and opens the receipt modal.
		 */
		$scope.addNewReceipt = function () {
			var receipt_id = 1;

			if ($scope.expense.bookingText.length === 0) {
				globalMessagesService.showWarning(
					$filter('translate')('reimbursement.expense.dirty_form_title'),
					$filter('translate')('reimbursement.expense.validation.bookingText'));
			} else {
				if ($scope.expense.receipts.length > 0) {
					receipt_id = $scope.expense.receipts[($scope.expense.receipts.length - 1)].id + 1;
				} else {
					expenseRestService.getExpense('POST', {bookingText: 'jhgjh'})
						.success(function (response) {
							// store expense id created
							console.log(response);
						})
						.error(function (response) {
							console.log(response);
						});
				}
				$scope.receipt = {
					id: receipt_id,
					uid: 0,
					date_receipt: null,
					account: null,
					description: '',
					amount: {
						original: '',
						currency: 'CHF',
						exchange_rate: '1.00',
						value: ''
					},
					cost_center: {
						prefix: 'E-1000',
						value: ''
					},
					isNew: true
				};

				$scope.modalReceipt = $modal.open({
					templateUrl: 'expense/receipt.tpl.html',
					controller: 'ReceiptController',
					scope: $scope
				});
			}
		};

		$scope.getCostCategories = function () {
			expenseRestService.getCostCategories.then(function (result) {
				$scope.costCategories = result;
			});
		};

		$scope.accounts = [306020, 306900, 310010, 310040, 310050, 312000, 313000, 313010, 313020, 320240, 320250, 321200, 322000, 322020, 322040, 325050, 325060, 325070, 326000, 329000, 329100, 330000];

		$scope.deleteReceipt = function (receipt_id) {
			var receipt = $scope.find($scope.expense.receipts, receipt_id);
			var confirm = window.confirm($filter('translate')('reimbursement.expense.delete_text', {
				name: receipt[1].description.substr(0, 25)
			}));

			if (confirm) {
				$scope.receiptChanges = true;
				$scope.expense.receipts.splice(receipt[0], 1);
				$scope.getTotal();
			}
		};

		/**
		 * Opens the modal view to edit an existing receipt.
		 * @param receipt_id
		 */
		$scope.editReceipt = function (receipt_id) {
			var receipt = $scope.find($scope.expense.receipts, receipt_id);

			$scope.receipt = angular.copy(receipt[1]);
			$scope.receipt.isNew = false;

			$scope.modalReceipt = $modal.open({
				templateUrl: 'expense/receipt.tpl.html',
				controller: 'ReceiptController',
				scope: $scope
			});
		};

		/**
		 * Save the complete expense on the server and forward it to the corresponsding persion who is
		 * responsible for the next processing step.
		 * @param form
		 */
		$scope.saveExpense = function (form) {
			if (form.$dirty) {
				globalMessagesService.showWarning(
					$filter('translate')('reimbursement.expense.dirty_form_title'),
					$filter('translate')('reimbursement.expense.dirty_form'));
			} else {
				//ToDo save expense
			}
		};

		$scope.cancel = function (form) {
			if (!form.$pristine || $scope.receiptChanges) {
				var confirm = confirm($filter('transalte')('reimbursement.expense.confirm_cancel_unsaved_changes'));

				var myModal = $modal({title: 'My Title', content: 'My Content', show: true});
				myModal.show();
				if (confirm) {
					$state.go('dashboard');
				}
			}
		};

	}]);