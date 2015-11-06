app.directive('spinner', [

function() {
	"use strict";

	return {
		restrict: 'E',
		replace: true,
		templateUrl: 'spinner/spinner.directive.tpl.html',
		scope: {
			id: '@',
			label: "@?",
			showSpinner: "@?"
		},
		controller: ['$scope', '$attrs', 'spinnerService',
		function($scope, $attrs, spinnerService) {
			if ( typeof $scope.label === 'undefined') {
				$scope.label = '';
			}
			spinnerService._register($scope);
		}]

	};

}]);