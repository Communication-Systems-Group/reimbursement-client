app.directive('navigationBar', ['USER', '$translate',

function(USER, $translate) {
	"use strict";

    function reverselanguage(language) {
        if(language === 'en') {
            return 'de';
        } else {
            return 'en';
        }
    }

	return {
		restrict: 'E',
		replace: true,
		templateUrl: 'navigation-bar/navigation-bar.tpl.html',
		link: function($scope) {

			$scope.USER = USER;
            $scope.inverseLanguage = reverselanguage($translate.use());

            $scope.switchLanguage = function(language) {
                $translate.use(language);

                $scope.inverseLanguage = reverselanguage(language);
            };
		}
	};

}]);
