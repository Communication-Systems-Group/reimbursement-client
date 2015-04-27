app.directive('spinner', function() {
	"use strict";
	
	return {
		restrict: 'E',
		replace: true,
		templateUrl: 'templates/spinner.directive.html',
		scope: {
			id: '@',
			label: "@?",
			showSpinner: "@?"
		},
		controller: function($scope, $attrs, spinnerService) {
			if(typeof $scope.label === 'undefined') {
				$scope.label = '';
			}
			spinnerService._register($scope);
		}
	};
});