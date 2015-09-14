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
			if(response.data.state === 'ASSIGNED_TO_PROFESSOR') {
				$scope.expenseAccountingText = response.data.accounting;
			}
			else {
				$state.go('dashboard');
			}
		}, function(response) {
			response.errorHandled = true;
			$state.go('dashboard');
		});
	}
	updateExpense();

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
			controller: "AcceptExpenseController"
		});
		modalInstance.result.then($scope.returnToDashboard);
	};

	$scope.decline = function() {
		var modalInstance = $modal.open({
			templateUrl: "expense/reject-expense.tpl.html",
			controller: "RejectExpenseController"
		});
		modalInstance.result.then($scope.returnToDashboard);
	};

}]);
