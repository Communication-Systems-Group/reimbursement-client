app.controller('SignExpenseController', ['$state', '$scope', '$stateParams', '$uibModal',

function($state, $scope, $stateParams, $uibModal) {
	"use strict";

	$scope.expense = $stateParams.expense;
	$scope.expenseItems = [];
	$scope.signedSuccessfully = false;

	$scope.sign = function() {
		var modalInstance = $uibModal.open({
			templateUrl: 'expense/sign-expense-form.tpl.html',
			controller: 'SignExpenseFormController',
			keyboard: false,
			backdrop: 'static',
			resolve: {
				expense: function() {
					return $scope.expense;
				}
			}
		});

		modalInstance.result.then(function() {
			$state.go('dashboard');
		});
	};

}]);
