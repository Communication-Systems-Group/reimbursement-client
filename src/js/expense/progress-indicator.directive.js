app.directive('progressIndicator', ['stateService',

function(stateService) {
	"use strict";

	return {
		restrict: 'E',
		replace: true,
		templateUrl: 'expense/progress-indicator.tpl.html',
		scope: {
			state: '='
		},
		link: function($scope) {
			var stateList = stateService.getStateListWorkflow();

			$scope.states = [];
			var activeStatePassedBy = false;
			for(var i = 0; i < stateList.length; i++) {
				var currentClass = "";
				if(stateList[i] === 'DRAFT' && $scope.state === 'REJECTED') {
					activeStatePassedBy = true;
					$scope.states.push({
						"class": 'active rejected',
						"state": $scope.state,
						"first": i === 0
					});
				}
				else {
					if(stateList[i] === $scope.state) {
						activeStatePassedBy = true;
						currentClass = "active";
					}
					else {
						if(activeStatePassedBy) {
							currentClass = "afterActive";
						}
						else {
							currentClass = "beforeActive";
						}
					}
					$scope.states.push({
						"class": currentClass,
						"state": stateList[i],
						"first": i === 0
					});
				}
			}
		}
	};
}]);
