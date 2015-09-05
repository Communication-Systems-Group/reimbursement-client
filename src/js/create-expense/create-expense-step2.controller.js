app.controller('CreateExpenseStep2Controller', ['$scope', '$stateParams',

function($scope, $stateParams) {
	"use strict";

	$scope.expenseUid = $stateParams.uid;

	$scope.submitToProf = function() {
		console.log("submitToProf");
	};

}]);
