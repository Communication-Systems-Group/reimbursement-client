app.controller('ReviewExpenseController', ['$scope', '$state', '$stateParams', '$timeout', '$modal', 'spinnerService', 'globalMessagesService', 'expenseRestService',

function($scope, $state, $stateParams, $timeout, $modal, spinnerService, globalMessagesService, expenseRestService) {
	"use strict";

	$scope.expenseUid = $stateParams.uid;
	$scope.expenseItems = [];

	$scope.submitButtonShown = false;

	$scope.$watch('expenseItems', function(newValue) {
		$scope.submitButtonShown = false;
		for(var i=0; i<newValue.length; i++) {
			if(newValue[i].state !== "INITIAL") {
				$scope.submitButtonShown = true;
				break;
			}
		}
	});

	function updateExpense() {
		expenseRestService.getExpense($scope.expenseUid).then(function(response) {
			$scope.expenseAccountingText = response.data.accounting;
		});
	}

	expenseRestService.getAccessRights($scope.expenseUid).then(function(response) {
		if(response.data.viewable && response.data.editable) {
			updateExpense();
		}
		else {
			$state.go('dashboard');
		}
	});

	$scope.editExpenseSap = function() {
		var modalInstance = $modal.open({
			templateUrl: 'expense/edit-expense-sap.tpl.html',
			controller: 'EditExpenseSapController',
			resolve: {
				accountingText: function() {
					return $scope.expenseAccountingText;
				},
				expenseUid: function() {
					return $scope.expenseUid;
				}
			}
		});
		modalInstance.result.then(updateExpense);
	};

	$scope.returnToDashboard = function() {
		$state.go('dashboard');
	};

	$scope.accept = function() {
		var modalInstance = $modal.open({
			templateUrl: "expense/accept-expense.tpl.html",
			controller: "AcceptExpenseController",
			resolve: {
				expenseUid: function() {
					return $scope.expenseUid;
				}
			}
		});
		modalInstance.result.then($scope.returnToDashboard);
	};

	$scope.decline = function() {
		var modalInstance = $modal.open({
			templateUrl: "expense/reject-expense.tpl.html",
			controller: "RejectExpenseController",
			resolve: {
				expenseUid: function() {
					return $scope.expenseUid;
				}
			}
		});
		modalInstance.result.then($scope.returnToDashboard);
	};

}]);
