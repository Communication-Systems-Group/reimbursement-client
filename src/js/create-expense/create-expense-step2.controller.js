app.controller('CreateExpenseStep2Controller', ['$scope', '$stateParams', 'USER',

function($scope, $stateParams, USER) {
	"use strict";

	$scope.expenseUid = $stateParams.uid;
	$scope.expenseItems = [];

	$scope.submitButtonDisabled = true;
	if(typeof USER.manager !== "undefined") {
		$scope.professorName = { professor: USER.manager.lastName };
	}
	else {
		$scope.professorName = { professor: null };
	}

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
