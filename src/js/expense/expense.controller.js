/**
 * Created by robinengbersen on 23.05.15.
 */
app.controller('ExpenseController', ['$scope', '$filter', '$state', '$stateParams', '$modal', 'expenseRestService', 'globalMessagesService',

	function ($scope, $filter, $state, $stateParams, $modal, expenseRestService, globalMessagesService) {
		"use strict";

		$scope.expenseId = $stateParams.id;
		$scope.expenseItemChanges = false;

		$scope.note = '';

		$scope.find = function (obj, uid) {
			for (var i = 0; i < obj.length; i++) {
				if (obj[i].uid === uid) {
					return [i, obj[i]];
				}
			}
		};

		/**
		 * Initializes an expenseItem object and opens the expense modal.
		 * @param item
		 * @param expenseItem_uid
		 */
		function initExpenseItem(item, expenseItem_uid) {
			if (item !== undefined) {
				$scope.expenseItem = item;
			} else {
				$scope.expenseItem = {
					uid: expenseItem_uid,
					date_expenseItem: null,
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
			}

			$scope.modalExpenseItem = $modal.open({
				templateUrl: 'expense/expenseItem.tpl.html',
				controller: 'ExpenseItemController',
				scope: $scope
			});
		}

		$scope.getTotal = function () {
			var total = 0;

			for (var i = 0; i < $scope.expense.expenseItems.length; i++) {
				total += parseFloat($scope.expense.expenseItems[i].amount);
			}

			$scope.total = total;
		};

		$scope.uploadExpenseItem = function () {
			// ToDo
		};

		$scope.prepareEmptyExpense = function () {
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
				expenseItems: []
			};
		};

		/**
		 * Creates an empty expenseItem element and opens the expenseItem modal.
		 */
		$scope.addNewExpenseItem = function () {
			var expenseItem_uid = 1;

			if ($scope.expense.bookingText.length === 0) {
				globalMessagesService.showWarning(
					$filter('translate')('reimbursement.expense.dirty_form_title'),
					$filter('translate')('reimbursement.expense.validation.bookingText'));
			} else {
				if ($scope.expense.expenseItems.length > 0) {
					expenseItem_uid = $scope.expense.expenseItems[($scope.expense.expenseItems.length - 1)].uid + 1;
					initExpenseItem(undefined, expenseItem_uid);
				} else {
//					expenseRestService.postExpense({bookingText: $scope.expense.bookingText, assignedManagerUid: 'jtyutyu', state: 'CREATED'})
//						.success(function (response) {
//							expenseItem_uid = response.expenseUid;
//							initExpenseItem(undefined, expenseItem_uid);
//						})
//						.error(function () {
//							$filter('translate')('reimbursement.error.title');
//							$filter('translate')('reimbursement.error.body');
//						});
					expenseItem_uid = 'dd9b3c5f-eb4d-4ece-96ed-9645355278f6';
					initExpenseItem(undefined, expenseItem_uid);
				}

			}
		};

		$scope.getCostCategories = function () {
//			expenseRestService.getCostCategories.then(function (result) {
//				$scope.costCategories = result;
//			});

			$scope.costCategories = expenseRestService.getCostCategories();
		};

		$scope.deleteExpenseItem = function (expenseItem_id) {
			var expenseItem = $scope.find($scope.expense.expenseItems, expenseItem_id);
			var confirm = window.confirm($filter('translate')('reimbursement.expense.delete_text', {
				name: expenseItem[1].description.substr(0, 25)
			}));

			if (confirm) {
				$scope.expenseItemChanges = true;
				$scope.expense.expenseItems.splice(expenseItem[0], 1);
				$scope.getTotal();
			}
		};

		/**
		 * Opens the modal view to edit an existing expenseItem.
		 * @param expenseItem_id
		 */
		$scope.editExpenseItem = function (expenseItem_id) {
			var expenseItem = $scope.find($scope.expense.expenseItems, expenseItem_id);

			$scope.expenseItem = angular.copy(expenseItem[1]);
			$scope.expenseItem.isNew = false;

			$scope.modalExpenseItem = $modal.open({
				templateUrl: 'expense/expenseItem.tpl.html',
				controller: 'ExpenseItemController',
				scope: $scope
			});
		};

		/**
		 * Save the complete expense on the server and forward it to the corresponsding persion who is
		 * responsible for the next processing step.
		 * @param form
		 */
		$scope.saveExpenseItem = function (form) {
			if (form.$dirty) {
				globalMessagesService.showWarning(
					$filter('translate')('reimbursement.expense.dirty_form_title'),
					$filter('translate')('reimbursement.expense.dirty_form')
				);
			} else {
				//ToDo save expense
			}
		};

		/**
		 * Download an existing expense from the server based on the uid.
		 * @param uid
		 */
		$scope.downloadExpense = function (uid) {
			expenseRestService.getExpense('GET', {uid: uid})
				.success(function (response) {
					if (response[0] !== undefined) {
						$scope.expense = response[0].expense;
						$scope.getTotal();
					} else {
						$scope.prepareEmptyExpense();
					}
				})
				.error(function (response) {
					if (response.type === "ExpenseNotFoundException") {
						globalMessagesService.showError(
							$filter('translate')('reimbursement.expense.not_found.title'),
							$filter('translate')('reimbursement.expense.not_found.body'));

						$state.go($state.previous.name);
					} else {
						globalMessagesService.showInfo(
							$filter('translate')('reimbursement.error.title'),
							$filter('translate')('reimbursement.error.body'));

						$state.go($state.previous.name);
					}
				});
		};

		$scope.cancel = function (form) {
			if (!form.$pristine || $scope.expenseItemChanges) {
				var confirm = confirm($filter('transalte')('reimbursement.expense.confirm_cancel_unsaved_changes'));

				var myModal = $modal({title: 'My Title', content: 'My Content', show: true});
				myModal.show();
				if (confirm) {
					$state.go('dashboard');
				}
			}
		};


		/**
		 * Initalize empty expense object
		 * @type {{id: number, creator: {name: string}, contact: {person: {name: string}, phone: string}, accounting: string, note: Array, expenseItems: Array}}
		 */
		if ($scope.expenseId !== undefined) {
			$scope.downloadExpense($scope.expenseId);
		} else {
			$scope.prepareEmptyExpense();
		}

		$scope.getCostCategories();

	}]);