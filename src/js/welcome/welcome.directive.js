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
				}
				else {
					$scope.isWelcomePage = false;
				}
			});

			$scope.scrollDown = function () {
				$timeout(function() {
					jQuery("html, body").animate({
						scrollTop: jQuery('.diagram').offset().top
					}, 700);
				});
				$scope.hideScrollButton = true;
			};
		}
	};

}]);
