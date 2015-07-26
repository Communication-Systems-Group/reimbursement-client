/**
 * Created by robinengbersen on 23.05.15.
 */
app.controller('ExpenseController', ['$scope', '$filter', '$state', '$stateParams', '$modal', 'expenseRestService', 'globalMessagesService', 'USER',

	function ($scope, $filter, $state, $stateParams, $modal, expenseRestService, globalMessagesService, USER) {
		"use strict";

		$scope.user = USER;
		console.log(USER);

		$scope.expense = {};
		$scope.expenseId = $stateParams.id;
		$scope.isReview = $stateParams.isReview;
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
				project: '',
				reason: '',
				amount: {
					originalAmount: '',
					currency: '',
					exchange_rate: '',
					calculatedAmount: ''
				},
				costCategory: {},
				isNew: true
			};

			$scope.modalExpenseItem = $modal.open({
				templateUrl: 'expense/expenseItem.tpl.html',
				controller: 'ExpenseItemController',
				scope: $scope
			});
		}

		function expenseNotFound() {
			globalMessagesService.showError(
				$filter('translate')('reimbursement.expense.not_found.title'),
				$filter('translate')('reimbursement.expense.not_found.body'));

			$state.go('dashboard');
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
				accounting: '',
				note: [],
				expenseItems: []
			};
		};

		/**
		 * This function adds a new expenseItem element.
		 */
		$scope.addNewExpenseItem = function () {
			if ($scope.expenseId === undefined) {
				if ($scope.expense.accounting.length === 0) {
					globalMessagesService.showWarning(
						$filter('translate')('reimbursement.expense.dirty_form_title'),
						$filter('translate')('reimbursement.expense.validation.accounting'));
				} else {
					expenseRestService.postExpense({accounting: $scope.expense.accounting, assignedManagerUid: 'jtyutyu', state: 'CREATED'})
						.success(function (response) {
							$scope.expenseId = response.uid;

							$scope.expense.uid = response.uid;
							initNewExpenseItem($scope.expense.uid);
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
			expenseRestService.getCostCategories().success(function (result) {
				$scope.costCategories = result;
			});

			//$scope.costCategories = expenseRestService.getCostCategories();
		};

		$scope.deleteExpenseItem = function (expenseItem_id) {
			var expenseItem = $scope.find($scope.expense.expenseItems, expenseItem_id);
			var confirm;

			if (expenseItem[1].reason !== null && expenseItem[1].reason !== undefined) {
				confirm = window.confirm($filter('translate')('reimbursement.expense.delete_text', {
					name: expenseItem[1].reason.substr(0, 25)
				}));
			} else {
				confirm = window.confirm($filter('translate')('reimbursement.expense.delete_text', {
					name: 'undefined'
				}));
			}

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

		$scope.saveExpense = function (form, state) {
			if (form.$valid) {

				var data = {};
				var successText, errorText;

				switch (state) {
					case 'CREATE':
						data = {
							uid: $scope.expense.uid,
							accounting: $scope.expense.accounting,
							assignedManagerUid: $scope.user.manager.uid,
							state: 'ASSIGNED_TO_PROFESSOR'
						};

						successText = $filter('translate')('reimbursement.expense.created', {manager: $scope.user.firstName + ' ' + $scope.user.lastName});
						errorText = $filter('translate')('reimbursement.error.body');
						break;
					case 'ACCEPT':
						data = {
							uid: $scope.expense.uid,
							accounting: $scope.expense.accounting,
							assignedManagerUid: $scope.expense.contact.uid,
							state: 'ACCEPTED'
						};

						successText = $filter('translate')('reimbursement.expense.accepted', {manager: $scope.user.firstName + ' ' + $scope.user.lastName});
						errorText = $filter('translate')('reimbursement.error.body');
						break;
					case 'REJECT':
						data = {
							uid: $scope.expense.uid,
							accounting: $scope.expense.accounting,
							assignedManagerUid: $scope.user.manager.uid,
							state: 'REJECTED'
						};

						successText = $filter('translate')('reimbursement.rejected', {manager: $scope.user.firstName + ' ' + $scope.user.lastName});
						errorText = $filter('translate')('reimbursement.error.body');
						break;
				}
				;

				expenseRestService.putExpense(data)
					.success(function () {
						alert(successText);
						$state.go('dashboard');
					})
					.error(function () {
						globalMessagesService.showError(
							$filter('translate')('reimbursement.error.title'),
							errorText
						);
					});
			} else {
				globalMessagesService.showError(
					$filter('translate')('reimbursement.expense.dirty_form_title'),
					$filter('translate')('reimbursement.expense.enter_account_or_add_expense_item')
				);
			}
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
						expenseNotFound();
					} else {
						globalMessagesService.showInfo(
							$filter('translate')('reimbursement.error.title'),
							$filter('translate')('reimbursement.error.body'));

						$state.go($state.previous.name);
					}
				});
		};

		/**
		 * Cancels the creation of an expense.
		 * @param form
		 */
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
		 * Saves an entered comment on the server and
		 * resets the input field.
		 */
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


		}

		$scope.getCostCategories();

	}]);