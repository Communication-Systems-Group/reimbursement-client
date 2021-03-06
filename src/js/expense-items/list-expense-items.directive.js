app.directive('listExpenseItems', ['$uibModal', '$filter', '$timeout', '$state', 'spinnerService', 'globalMessagesService', 'expenseRestService', 'expenseItemsRestService', 'costCategorySortService',

function($uibModal, $filter, $timeout, $state, spinnerService, globalMessagesService, expenseRestService, expenseItemsRestService, costCategorySortService) {
	"use strict";

	return {
		restrict: 'E',
		replace: true,
		templateUrl: 'expense-items/list-expense-items.directive.tpl.html',
		scope: {
			expenseUid: '=',
			expenseItems: '=',
			editable: '='
		},
		link: function($scope) {

			function updateTable() {
				spinnerService.show('spinnerListExpenseItems');

				expenseItemsRestService.getExpenseItems($scope.expenseUid).then(function(response) {
					$scope.addExpenseItemButtonDisabled = false;

					$scope.expenseItems = [];

					for(var i = 0; i < response.data.length; i++) {
						// delete all expense-items with state initial (not finished creation)
						if(response.data[i].state === 'INITIAL') {
							// if an admin or finance-admin looks at a rejected expense, which
							// is again in edit mode, initial expenses should not be deleted
							if($scope.editable) {
								expenseItemsRestService.deleteExpenseItem(response.data[i].uid);
							}
						}
						// show all others
						else {
							$scope.expenseItems.push(response.data[i]);
						}
					}

				})['finally'](function() {
					spinnerService.hide('spinnerListExpenseItems');
				});
			}

			$timeout(function() {
				updateTable();

				if($scope.editable) {

					$scope.editExpenseItem = function(expenseItem) {
						var modalInstance = $uibModal.open({
							templateUrl: 'expense-items/edit-expense-item.tpl.html',
							controller: 'EditExpenseItemController',
							resolve: {
								expenseItem: function() {
									return expenseItem;
								}
							},
							// prevent closing by accident:
							backdrop: 'static',
							keyboard: false
						});

						modalInstance.result.then()['finally'](updateTable);
					};

					$scope.deleteExpenseItem = function(expenseItemUid) {
						globalMessagesService.confirmWarning("reimbursement.globalMessage.expenseItem.deleteConfirmTitle",
						"reimbursement.globalMessage.expenseItem.deleteConfirmMessage").then(function() {

							expenseItemsRestService.deleteExpenseItem(expenseItemUid).then(updateTable);
						});
					};

					$scope.addExpenseItem = function() {
						if($scope.expenseItems.length < parseInt($filter("regexValidation")("expense.maxExpenseItems"))) {
							// button is enabled again in updateTable()
							$scope.addExpenseItemButtonDisabled = true;

							expenseItemsRestService.getCostCategories().then(function(response) {
								var preSelectedCategoryUid = costCategorySortService.sort(response.data)[0].uid;

								expenseItemsRestService.postExpenseItem($scope.expenseUid, {
									date: $filter('date')(new Date(), 'yyyy-MM-dd'),
									costCategoryUid: preSelectedCategoryUid,
									currency: 'CHF'
								}).then(function(response) {

									expenseItemsRestService.getExpenseItem(response.data.uid).then(function(response) {
										var modalInstance = $uibModal.open({
											templateUrl: 'expense-items/add-expense-item.tpl.html',
											controller: 'AddExpenseItemController',
											resolve: {
												expenseItem: function() {
													return response.data;
												}
											},
											// prevent closing by accident:
											backdrop: 'static',
											keyboard: false
										});
										modalInstance.result.then()['finally'](updateTable);
									});
								});
							});
						}
						else {
							globalMessagesService.showInfoMd("reimbursement.globalMessage.expenseItem.maxAmountReachedTitle",
							"reimbursement.globalMessage.expenseItem.maxAmountReachedMessage");
						}
					};
				}

				else {
					$scope.viewExpenseItem = function(expenseItem) {
						$uibModal.open({
							templateUrl: 'expense-items/view-expense-item.tpl.html',
							controller: 'ViewExpenseItemController',
							resolve: {
								expenseItem: function() {
									return expenseItem;
								}
							}
						});
					};
				}
			});
		}
	};

}]);
