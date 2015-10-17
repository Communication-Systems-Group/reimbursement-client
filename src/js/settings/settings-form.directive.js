app.directive('settingsForm', ['$timeout', '$translate', 'settingsRestService', 'USER', 'globalMessagesService',

function($timeout, $translate, settingsRestService, USER, globalMessagesService) {
	'use strict';

	return {
		restrict: 'E',
		replace: true,
		templateUrl: 'settings/settings-form.directive.tpl.html',
		scope: {
			isRegistration: '=',
			finallyFunction: '='
		},
		link: function($scope) {

			$scope.form = {
				personnelNumber: USER.personnelNumber,
				phoneNumber: USER.phoneNumber,
				isActive: USER.isActive
			};

			$scope.languages = [];

			settingsRestService.getSupportedLanguages().then(function(response) {
				$scope.languages = response.data;
				$timeout(function() {
					$scope.form.language = USER.language;
				});
			});

			$scope.saveSettings = function() {
				settingsRestService.putSettings($scope.form).then(function() {
					USER.isActive = $scope.form.isActive;
					USER.personnelNumber = $scope.form.personnelNumber;
					USER.phoneNumber = $scope.form.phoneNumber;
					USER.language = $scope.form.language;
					$translate.use($scope.form.language.toLowerCase());

					if(typeof $scope.finallyFunction !== 'undefined' && $scope.finallyFunction !== null) {
						$scope.finallyFunction();
					}
					else {
						globalMessagesService.showInfoMd('reimbursement.settings.user.submitInfoTitle',
							'reimbursement.settings.user.submitInfoMessage');
					}
				});
			};

		}
	};

}]);
