app.directive('navigationBar', ['USER',

function(USER) {
	"use strict";

	return {
		restrict: 'E',
		replace: true,
		templateUrl: 'navigation-bar/navigation-bar.tpl.html',
		link: function($scope) {

			$scope.USER = USER;

		}
	};

}]);
