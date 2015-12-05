app.directive('welcome', ['$rootScope', '$timeout', 'USER',

function ($rootScope, $timeout, USER) {
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
					$scope.hideWelcome = false;
				}
				else {
					$scope.isWelcomePage = false;

					// scrollbar of #welcome is visible everywhere
					// therefore hide element after css fadeout
					$timeout(function() {
						$scope.hideWelcome = true;
					}, 500);
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
