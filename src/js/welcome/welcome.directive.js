app.directive('welcome', ['$rootScope', 'USER',

function ($rootScope, USER) {
	"use strict";

	return {
		restrict: 'E',
		replace: true,
		templateUrl: 'welcome/welcome.directive.tpl.html',
		scope: true,
		link: function($scope) {
			$scope.isWelcomePage = false;
			$scope.USER = USER;

			$rootScope.$on('$stateChangeStart', function (event, toState) {
				if(toState.name === 'welcome') {
					$scope.isWelcomePage = true;
				}
				else {
					$scope.isWelcomePage = false;

					// Scroll to top to see login input.
					jQuery(window).scrollTop(0);
				}
			});

			(function scrollingToBottom() {
				var jQueryWindow = jQuery(window);
				var jQueryDiagram = jQuery('.diagram');
				var jQueryGoDownButton = jQuery('.goDown');
				var jQueryGoDownButtonVisible = true;

				jQueryGoDownButton.click(function() {
					jQuery("html, body").animate({
						scrollTop: jQueryDiagram.offset().top
					}, 700);
				});

				jQueryWindow.scroll(function() {
					var belowLimit = jQueryWindow.scrollTop() > 200;

					if(!jQueryGoDownButtonVisible && !belowLimit) {
						jQueryGoDownButtonVisible = true;
						jQueryGoDownButton.fadeIn(400);
					}
					else if(jQueryGoDownButtonVisible && belowLimit) {
						jQueryGoDownButtonVisible = false;
						jQueryGoDownButton.fadeOut(400);
					}
				});

			})();
		}
	};

}]);
