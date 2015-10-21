app.directive('navigationBar', ['USER', '$state', '$translate', 'globalMessagesService',

function(USER, $state, $translate, globalMessagesService) {
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

			$scope.goToWelcomePage = function() {
				if($state.is('registrationForm') || $state.is('registrationSignature') || $state.is('registrationCropping')) {
					globalMessagesService.confirmWarningMd("reimbursement.navbar.leavePageWarning.title",
						"reimbursement.navbar.leavePageWarning.message").then(function() {

						$state.go('welcome');
					});
				}
				else {
					$state.go('welcome');
				}
			};
		}
	};

}]);
