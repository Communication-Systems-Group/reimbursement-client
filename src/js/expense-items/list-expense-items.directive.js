app.directive('listExpenseItems', ['$modal', '$filter', '$timeout', 'spinnerService', 'globalMessagesService', 'listExpenseItemsRestService',

function($modal, $filter, $timeout, spinnerService, globalMessagesService, listExpenseItemsRestService) {
	"use strict";

	return {
		restrict: 'E',
		replace: true,
		templateUrl: 'expense-items/list-expense-items.directive.tpl.html',
		scope: {
			expenseUid: '@'
		},
		link: function($scope) {

			function updateTable() {

				$timeout(function() {
					spinnerService.show('spinnerListExpenseItems');
				});

				listExpenseItemsRestService.getExpenseItems($scope.expenseUid).then(function(response) {
					$scope.expenseItems = [];

					var showGeneralError = function() {
						globalMessagesService.showGeneralError();
					};
					for(var i=0; i<response.data.length; i++) {
						// delete all expense-items with state initial (not finished creation)
						if(response.data[i].state === 'INITIAL') {
							listExpenseItemsRestService.deleteExpenseItem(response.data[i].uid).error(showGeneralError);
						}
						// show all others
						else {
							$scope.expenseItems.push(response.data[i]);
						}
					}

				}, function() {
					globalMessagesService.showGeneralError();
				})['finally'](function() {
					spinnerService.hide('spinnerListExpenseItems');
				});
			}

			updateTable();

			$scope.editExpenseItem = function(expenseItemUid) {
				var modalInstance = $modal.open({
					templateUrl: 'expense-items/edit-expense-item.tpl.html',
					controller: 'EditExpenseItemController',
					resolve: {
						expenseItemUid: function() {
							return expenseItemUid;
						}
					},
					// prevent closing by accident:
					backdrop: 'static',
					keyboard: false
				});

				modalInstance.result.then()['finally'](updateTable);
			};

			$scope.addExpenseItem = function() {
				listExpenseItemsRestService.getCostCategories().then(function(response) {
					var preSelectedCategoryUid = response.data[0].uid;

					listExpenseItemsRestService.postExpenseItem($scope.expenseUid, {
						date: $filter('date')(new Date(), 'yyyy-MM-dd'),
						costCategoryUid: preSelectedCategoryUid,
						currency: 'CHF',
					}).then(function(response) {

						var modalInstance = $modal.open({
							templateUrl: 'expense-items/add-expense-item.tpl.html',
							controller: 'AddExpenseItemController',
							resolve: {
								expenseItemUid: function() {
									return response.data.uid;
								}
							},
							// prevent closing by accident:
							backdrop: 'static',
							keyboard: false
						});

						modalInstance.result.then()['finally'](updateTable);

					}, function() {
						globalMessagesService.showGeneralError();
					});

				}, function() {
					globalMessagesService.showGeneralError();
				});
			};

		}
	};

}]);
