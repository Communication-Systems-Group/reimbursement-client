app.directive('settingsForm', ['$timeout', '$translate', 'settingsRestService', 'USER',

function($timeout, $translate, settingsRestService, USER) {
	'use strict';

	return {
		restrict: 'E',
		replace: true,
		templateUrl: 'settings/settings-form.directive.tpl.html',
		link: function($scope) {

			$scope.personnelNumberLoading = false;
			$scope.phoneNumberLoading = false;
			$scope.languageLoading = false;

			var timeoutTime = 700;
			$scope.timeouts = {};
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
				$scope.languageLoading = true;
				settingsRestService.putLanguage($scope.form.language.toUpperCase()).then(function() {
					USER.language = $scope.form.language;
					$translate.use($scope.form.language.toLowerCase());
				})['finally'](function() {
					$timeout(function() {
						$scope.languageLoading = false;
					}, timeoutTime - 1);
				});
			};

			$scope.savePersonnelNumber = function(isValid) {
				var personnelNumber = "";

				if($scope.form.personnelNumber !== null && $scope.form.personnelNumber !== undefined && isValid) {
					personnelNumber = $scope.form.personnelNumber
				}

				$timeout.cancel($scope.timeouts.personnelNumber);

				$scope.timeouts.personnelNumber = $timeout(function() {
					$scope.personnelNumberLoading = true;

					settingsRestService.putPersonnelNumber(personnelNumber).then(function() {
						USER.personnelNumber = $scope.form.personnelNumber;
					})['finally'](function() {
						$timeout(function () {
							$scope.personnelNumberLoading = false;
						}, timeoutTime - 1);
					});

				}, timeoutTime);
			};

			$scope.savePhoneNumber = function(isValid) {
				var phoneNumber = "";

				if($scope.form.phoneNumber !== null && $scope.form.phoneNumber !== undefined && isValid) {
					phoneNumber = $scope.form.phoneNumber;
				}

				$timeout.cancel($scope.timeouts.phoneNumber);

				$scope.timeouts.phoneNumber = $timeout(function() {
					$scope.phoneNumberLoading = true;

					settingsRestService.putPhoneNumber(phoneNumber).then(function() {
						USER.phoneNumber = $scope.form.phoneNumber;
					})['finally'](function() {
						$timeout(function() {
							$scope.phoneNumberLoading = false;
						}, timeoutTime - 1);
					});

				}, timeoutTime);
			};

			$scope.saveIsActive = function() {
				if($scope.form.isActive !== "") {
					$scope.isActiveLoading = true;
					settingsRestService.putIsActive($scope.form.isActive).then(function() {
						USER.isActive = $scope.form.isActive;
					})['finally'](function() {
						$timeout(function() {
							$scope.isActiveLoading = false;
						}, timeoutTime - 1);
					});
				}
			};

		}
	};

}]);
