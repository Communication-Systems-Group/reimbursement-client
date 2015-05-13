app.directive('crop', [

function() {
	"use strict";

	return {
		restrict: 'A',
		scope: {
			id: '=',
			dimensions: '='
		},
		link: function($scope, $element, attrs) {
			$scope.dimensions = {};

			function storeCoords(coords) {
				$scope.dimensions = {
					width: coords.w,
					height: coords.h,
					top: coords.y,
					left: coords.x
				};
				$scope.$apply();
			}

			var boxWidth = parseInt(jQuery($element).parent().css('width'), 10);

			jQuery('#' + attrs.id).Jcrop({
				onChange: storeCoords,
				onSelect: storeCoords,
				boxWidth: boxWidth
			});
		}
	};

}]);