app.controller('ViewExpenseController', ['$scope', '$state', '$stateParams', 'expenseRestService',

function($scope, $state, $stateParams, expenseRestService) {
	"use strict";

	$scope.expenseUid = $stateParams.uid;
	$scope.expenseItems = [];

	$scope.returnToDashboard = function() {
		$state.go('dashboard');
	};

	expenseRestService.getAccessRights($scope.expenseUid).then(function(response) {

		if(response.data.viewable) {
			expenseRestService.getExpense($scope.expenseUid).then(function(response) {
				$scope.expenseAccountingText = response.data.accounting;
			});
		}
		else {
			$state.go('dashboard');
		}

	});

}]);
