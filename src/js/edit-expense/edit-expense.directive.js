app.directive('editExpense', ['$modal', '$filter', 'globalMessagesService', 'editExpenseRestService',

function($modal, $filter, globalMessagesService, editExpenseRestService) {
	"use strict";

	return {
		restrict: 'E',
		replace: true,
		templateUrl: 'edit-expense/edit-expense.directive.tpl.html',
		scope: {
			expenseUid: '@'
		},
		link: function($scope) {

			$scope.addExpenseItem = function() {
				editExpenseRestService.getCostCategories().then(function(response) {
					var costCategories = response.data;
					var preSelectedCategoryUid = costCategories[0].uid;

					editExpenseRestService.postExpenseItem($scope.expenseUid, {
						date: $filter('date')(new Date(), 'yyyy-MM-dd'),
						costCategoryUid: preSelectedCategoryUid,
						currency: 'CHF',
					}).then(function(response) {

						var modalInstance = $modal.open({
							templateUrl: 'edit-expense/add-expenseitem.tpl.html',
							controller: 'AddExpenseItemController',
							resolve: {
								costCategories: function() {
									return costCategories;
								},
								expenseItemUid: function() {
									return response.data.uid;
								}
							},
							// prevent closing by accident:
							backdrop: 'static',
							keyboard: false
						});

						modalInstance.result.then(function() {
							// TODO add expense to list
							console.log(123);
						});

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
