app.controller('UserGuideController', ['$scope', '$anchorScroll', '$location',

	function($scope, $anchorScroll, $location) {
		"use strict";

		$scope.gotoAnchor = function(anchor) {
			if ($location.hash() !== anchor) {
				$location.hash(anchor);
			}
			else {
				$anchorScroll();
			}
		};

	}]);