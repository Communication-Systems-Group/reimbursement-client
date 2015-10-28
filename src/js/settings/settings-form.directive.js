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

			var timeoutTime = 1000;
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
				spinnerService.show('settingsFormSpinner');
				settingsRestService.putLanguage($scope.form.language.toUpperCase()).then(function() {
					USER.language = $scope.form.language;
					$translate.use($scope.form.language.toLowerCase());
				})['finally'](hideSpinner);
			};

			$scope.savePersonnelNumber = function(immediacy) {
				if($scope.form.personnelNumber === null) {
					$scope.form.personnelNumber = "";
				}
				function pushToBackEnd() {
					spinnerService.show('settingsFormSpinner');
					settingsRestService.putPersonnelNumber($scope.form.personnelNumber).then(function() {
						USER.personnelNumber = $scope.form.personnelNumber;
					})['finally'](hideSpinner);
				}

				$timeout.cancel($scope.timeouts.personnelNumber);
				if(immediacy === "delayed") {
					$scope.timeouts.personnelNumber = $timeout(pushToBackEnd, timeoutTime);
				}
				else {
					pushToBackEnd();
				}
			};

			$scope.savePhoneNumber = function(immediacy) {
				if($scope.form.phoneNumber === null) {
					$scope.form.phoneNumber = "";
				}
				function pushToBackEnd() {
					spinnerService.show('settingsFormSpinner');
					settingsRestService.putPhoneNumber($scope.form.phoneNumber).then(function() {
						USER.phoneNumber = $scope.form.phoneNumber;
					})['finally'](hideSpinner);
				}

				$timeout.cancel($scope.timeouts.phoneNumber);
				if(immediacy === 'delayed') {
					$scope.timeouts.phoneNumber = $timeout(pushToBackEnd, timeoutTime);
				}
				else {
					pushToBackEnd();
				}
			};

			$scope.saveIsActive = function() {
				if($scope.form.isActive !== "") {
					spinnerService.show('settingsFormSpinner');
					settingsRestService.putIsActive($scope.form.isActive).then(function() {
						USER.isActive = $scope.form.isActive;
					})['finally'](hideSpinner);
				}
			};

			function hideSpinner() {
				if(!$scope.isRegistration) {
					// saving in settings should always display spinner shortly, otherwise it is confusing.
					$timeout(function() {
						spinnerService.hide('settingsFormSpinner');
					}, 500);
				}
				else {
					spinnerService.hide('settingsFormSpinner');
				}
			}
		}
	};

}]);
