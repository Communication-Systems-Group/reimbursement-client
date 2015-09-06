app.controller('CreateExpenseStep2Controller', ['$scope', '$stateParams',

function($scope, $stateParams) {
	"use strict";

	$scope.expenseUid = $stateParams.uid;
	$scope.expenseItems = [];
	$scope.submitButtonDisabled = true;

	$scope.$watch('expenseItems', function(newValue) {
		$scope.submitButtonDisabled = true;
		for(var i=0; i<newValue.length; i++) {
			if(newValue[i].state !== "INITIAL") {
				$scope.submitButtonDisabled = false;
				break;
			}
		}
	});

	$scope.submitToProf = function() {
		console.log("submit");
	};

}]);
