app.directive('listGuestExpenseItems', ['$modal', '$filter', '$timeout', '$state', 'spinnerService', 'globalMessagesService', 'guestViewRestService',

	function($modal, $filter, $timeout, $state, spinnerService, globalMessagesService, guestViewRestService) {
		"use strict";

		return {
			restrict: 'E',
			replace: true,
			templateUrl: 'expense-items/list-expense-items.directive.tpl.html',
			scope: {
				expenseUid: '=',
				expenseLoaded: '='
			},
			link: function($scope) {

				$scope.editable = false;

				function updateTable() {
					spinnerService.show('spinnerListExpenseItems');

					guestViewRestService.getExpenseItems($scope.expenseToken).then(function(response) {
						$scope.expenseItems = response.data;

					})['finally'](function() {
						spinnerService.hide('spinnerListExpenseItems');
					});
				}

				function getExpenseByUid(uid) {
					for(var i=0; i<$scope.expenseItems.length; i++) {
						if($scope.expenseItems[i].uid === uid) {
							return $scope.expenseItems[i];
						}
					}
				}

				$timeout(function() {
					$scope.$watch('expenseLoaded', function (data) {
						if(data) {
							guestViewRestService.fetchExpenseToken($scope.expenseUid).then(function(response) {
								$scope.expenseToken = response.data.uid;
								updateTable();
							});


							$scope.viewExpenseItem = function(expenseItemUid) {
								$modal.open({
									templateUrl: 'expense-items/guest-expense-item.tpl.html',
									controller: 'GuestViewViewExpenseController',
									resolve: {
										expenseItem: function() {
											return getExpenseByUid(expenseItemUid);
										}
									}
								});
							};
						}
					});
				});
			}
		};

	}]);
