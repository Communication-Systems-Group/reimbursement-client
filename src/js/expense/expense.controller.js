/**
 * Created by robinengbersen on 23.05.15.
 */
app.controller('ExpenseController', ['$scope', '$filter', '$state', '$stateParams', '$modal', 'expenseRestService', 'globalMessagesService', '$timeout',

	function ($scope, $filter, $state, $stateParams, $modal, expenseRestService, globalMessagesService, $timeout) {
		"use strict";

		$scope.expense = {};
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
		 * Initializes a new expenseItem object and opens the expense modal.
		 * @param item
		 * @param expenseItem_uid
		 */
		function initNewExpenseItem(expense_uid) {
			$scope.expenseItem = {
				uid: null,
				expense_uid: expense_uid,
				date: null,
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

			$scope.modalExpenseItem = $modal.open({
				templateUrl: 'expense/expenseItem.tpl.html',
				controller: 'ExpenseItemController',
				scope: $scope
			});
		}

		/**
		 * Calculate the total value of the expenseItems.
		 */
		$scope.getTotal = function () {
			var total = 0;

			if ($scope.expense !== undefined) {
				for (var i = 0; i < $scope.expense.expenseItems.length; i++) {
					total += parseFloat($scope.expense.expenseItems[i].amount.value);
				}
			}

			$scope.total = total;
		};

		$scope.uploadExpenseItem = function () {
			// ToDo
		};

		$scope.prepareEmptyExpense = function () {
			$scope.expense = {
				uid: 1,
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
				note: [],
				expenseItems: []
			};
		};

		/**
		 * Creates an empty expenseItem element and opens the expenseItem modal.
		 */
		$scope.addNewExpenseItem = function () {
			if ($scope.expenseId === undefined) {
				if ($scope.expense.accounting.length === 0) {
					globalMessagesService.showWarning(
						$filter('translate')('reimbursement.expense.dirty_form_title'),
						$filter('translate')('reimbursement.expense.validation.bookingText'));
				} else {
					expenseRestService.postExpense({bookingText: $scope.expense.accounting, assignedManagerUid: 'jtyutyu', state: 'CREATED'})
						.success(function (response) {
							$scope.expenseId = response.uid;

							$timeout(function () {
								$scope.expense.uid = response.uid;
								initNewExpenseItem($scope.expense.uid);
							}, 800);
						})
						.error(function () {
							$filter('translate')('reimbursement.error.title');
							$filter('translate')('reimbursement.error.body');
						});
				}
			} else {
				$scope.expense.uid = $scope.expenseId;
				initNewExpenseItem($scope.expense.uid);
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
				expenseRestService.deleteExpense(expenseItem_id)
					.success(function () {
						$scope.expenseItemChanges = true;
						$scope.expense.expenseItems.splice(expenseItem[0], 1);
						$scope.getTotal();
					})
					.error(function () {
						globalMessagesService.showError(
							$filter('translate')('reimbursement.error.title'),
							$filter('translate')('reimbursement.error.body')
						);
					});

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
		 * Download an existing expense from the server based on the uid.
		 * @param uid
		 */
		$scope.downloadExpense = function (uid) {
			expenseRestService.getExpense({uid: uid})
				.success(function (response) {
					$scope.expense = response;
					$scope.getTotal();
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


		$scope.saveComment = function () {
			if ($scope.note.length > 3) {
				expenseRestService.postComment({text: $scope.note, uid: $scope.expense.uid})
					.success(function () {
						if ($scope.expenseId !== undefined) {
							$scope.downloadExpense($scope.expenseId);
						}
						$scope.note = '';
					})
					.error(function () {
						globalMessagesService.showError(
							$filter('translate')('reimbursement.error.title'),
							$filter('translate')('reimbursement.error.body'));
					});
			} else {
				globalMessagesService.showError(
					$filter('translate')('reimbursement.expense.dirty_form_title'),
					$filter('translate')('reimbursement.expense.validation.note'));
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