app.directive('settingsForm', ['$timeout', '$translate', 'settingsRestService', 'USER', 'globalMessagesService', 'spinnerService',

function($timeout, $translate, settingsRestService, USER, globalMessagesService, spinnerService) {
	'use strict';

	return {
		restrict: 'E',
		replace: true,
		templateUrl: 'settings/settings-form.directive.tpl.html',
		scope: {
			isRegistration: '='
		},
		link: function($scope) {

			$scope.languages = [];
			$scope.form = {
				personnelNumber: USER.personnelNumber,
				phoneNumber: USER.phoneNumber,
				isActive: USER.isActive
			};

			settingsRestService.getSupportedLanguages().then(function(response) {
				$scope.languages = response.data;
				$timeout(function() {
					$scope.form.language = USER.language;
				});
			});

			$scope.saveLanguage = function() {
				spinnerService.show('settingsFormSpinner');
				settingsRestService.putLanguage($scope.form.language.toUpperCase()).then(function() {
					USER.language = $scope.form.language;
					$translate.use($scope.form.language.toLowerCase());
				})['finally'](function() {
					spinnerService.hide('settingsFormSpinner');
				});
			};

			$scope.savePersonnelNumber = function() {
				if($scope.form.personnelNumber === null) {
					$scope.form.personnelNumber = "";
				}
				spinnerService.show('settingsFormSpinner');
				settingsRestService.putPersonnelNumber($scope.form.personnelNumber).then(function() {
					USER.personnelNumber = $scope.form.personnelNumber;
				})['finally'](function() {
					spinnerService.hide('settingsFormSpinner');
				});
			};

			$scope.savePhoneNumber = function() {
				if($scope.form.phoneNumber === null) {
					$scope.form.phoneNumber = "";
				}
				spinnerService.show('settingsFormSpinner');
				settingsRestService.putPhoneNumber($scope.form.phoneNumber).then(function() {
					USER.phoneNumber = $scope.form.phoneNumber;
				})['finally'](function() {
					spinnerService.hide('settingsFormSpinner');
				});
			};

			$scope.saveIsActive = function() {
				if($scope.form.isActive !== "") {
					spinnerService.show('settingsFormSpinner');
					settingsRestService.putIsActive($scope.form.isActive).then(function() {
						USER.isActive = $scope.form.isActive;
					})['finally'](function() {
						spinnerService.hide('settingsFormSpinner');
					});
				}
			};

		}
	};

}]);
